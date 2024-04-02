import path from 'path';
import WebTorrent from 'webtorrent-hybrid';
import { type WebTorrent as WebTorrentType } from '@types/webtorrent';
import fs from 'fs/promises';
import crypto from 'crypto';
import { db } from '../db/db';
import chokidar from 'chokidar';
import Deluge from './deluge-client';

const TypedWebTorrent = WebTorrent as WebTorrentType;
export const client = new TypedWebTorrent({});

interface TorrentMeta {
  name: string
  description: string
  source: string
}

const torrentRoot = process.env.TORRENT_DIR || path.resolve(import.meta.dir + '/../torrents/');

// set up deluge API client
const delugeUrl = process.env.DELUGE_URI || 'http://localhost:8112/json';
const delugePass = process.env.DELUGE_PASSWORD || 'deluge';
const deluge = new Deluge(delugeUrl, delugePass, torrentRoot);

async function addTorrents (dir: string) {
  try {
    const torrentDirs = await fs.readdir(dir, { withFileTypes: true });
    console.log('TORRENT DIRS FOUND ', torrentDirs);
    await Promise.all(torrentDirs.filter((d) => d.isDirectory()).map(async (d) => {
      const torrentPath = path.join(torrentRoot, d.name);
      console.log('torrentPath is ', torrentPath);
      await processDirToTorrent(torrentPath);
    }));
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err}`);
  }
}

async function processDirToTorrent (torrentDir: string) {
  console.log('torrentdir is ', torrentDir);
  try {
    const torrentMetaDirty = await import(path.join(torrentDir, 'meta.json')) as TorrentMeta;
    // @ts-ignore
    const torrentMeta = torrentMetaDirty.default;
    console.log('CLEAN TORRENT METADATA IS ', torrentMeta);
    // since webtorrent seems awful or even broken at seeding, also add it to a local deluge client for that initial seed
    // we also need to wrap the torrent name like this so that it will find it since deluge automatically wraps files like this in the torrent name, annoying and clunky

    console.log('creating a torrent from folder', torrentDir);
    const torrentName = path.basename(torrentDir);
    // const folderHash = await hashFolder(contentsPath);
    const magnetLink = await new Promise<string>((res, rej) => {
      // @ts-expect-error
      client.seed(torrentDir, { name: torrentName }, (torrent) => {
        deluge.add(torrent.magnetURI, torrentRoot).then(() => {
          console.log('deluge added');
          res(torrent.magnetURI);
        }).catch((e: unknown) => { rej(e); });
      });
    });

    const tags = torrentMeta.tags || [];
    delete torrentMeta.tags;
    const torrentForUpsert = {
      ...torrentMeta,
      name: torrentName,
      magnetLink
    };
    console.log('created torrent and attempting upsert', torrentForUpsert);

    await db.upsertTorrent(torrentForUpsert, tags); 
    console.log('Torrent created and seeding');
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND'){
      console.log('watched a directory for torrents that didnt have a meta.json, skipping!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    } else {
      console.error('SKIPPING TORRENT DUE TO FAILURE: ', e)
    }
  }
}

export const startSeeding = async () => {
  console.log('IS IT CONNECTED?????????', await deluge.isConnected());
  await addTorrents(torrentRoot);
  // TODO: BROKEN WATCHER
  // await startWatcher();
};


startWatcher();

async function startWatcher () {
  // watch for any added
  const watcher = chokidar.watch(torrentRoot, { ignored: /^\./, persistent: true, depth: 1 });

  async function onDirectoryAdded (newPath: string) {
    console.log('directory added from watch', newPath)
    const allTorrents = await db.getAllTorrents();
    const existing = allTorrents.find((t) => t.name === path.basename(newPath));
    if (existing){
      console.log('watched a torrent that already is in the db, skipping')
      return;
    }
    await processDirToTorrent(newPath);
  }

  watcher.on('addDir', async path => {
    if (await fs.stat(path) && (await fs.lstat(path)).isDirectory()) {
      await onDirectoryAdded(path);
    }
  });
}
