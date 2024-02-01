
import path from 'path';
import WebTorrent from 'webtorrent-hybrid';
import {type WebTorrent as WebTorrentType} from '@types/webtorrent'
import fs from 'fs/promises';
import crypto from 'crypto';
import {db, TorrentRecord} from '../db/db'
import chokidar from 'chokidar'
import Deluge from './deluge-client';



const TypedWebTorrent = WebTorrent as WebTorrentType;
export const client = new TypedWebTorrent({});

interface TorrentMeta {
    name: string;
    description: string;
    source: string;
}

const torrentRoot = process.env.TORRENT_DIR || path.resolve(import.meta.dir + '/../torrents/');

// set up deluge API client
const delugeUrl = 'http://localhost:8112/json';
const delugePass = process.env.DELUGE_PASSWORD || 'deluge'
const deluge = new Deluge(delugeUrl, delugePass, torrentRoot);



async function addTorrents(dir: string) {
    try {
        const torrentDirs = await fs.readdir(dir, { withFileTypes: true });
            await Promise.all(torrentDirs.filter((d) => d.isDirectory()).map((d) => {
                const torrentPath = path.join(torrentRoot, d.name);
                console.log('torrentPath is ', torrentPath)
                return processDirToTorrent(torrentPath);
            }))
        
    } catch (err) {
        console.error(`Error reading directory ${dir}: ${err}`);
    }
}

async function processDirToTorrent(torrentDir: string){

    console.log('torrentdir is ', torrentDir)
    const torrentMeta = await import(path.join(torrentDir, 'meta.json')) as TorrentMeta;

    const contentsPath = path.join(torrentDir, 'contents');
    console.log('creating a torrent from folder', contentsPath)
    // const folderHash = await hashFolder(contentsPath);
    const magnetLink = await new Promise<string>((res, rej) => {
        // @ts-ignore
        client.seed(contentsPath, {name: torrentMeta.name }, (torrent) => {
            // since webtorrent seems awful or even broken at seeding, also add it to a local deluge client for that initial seed
            deluge.add(torrent.magnetURI, contentsPath).then(() => {
                console.log('deluge added');
                res(torrent.magnetURI);
            }).catch((e:unknown) => rej(e))




        })
    })

    const torrentForUpsert: TorrentRecord = {
        ...torrentMeta,
        magnetLink,
    }
    console.log('created torrent and attempting upsert', torrentForUpsert)
    
    db.upsertVideo(torrentForUpsert); // AWAITING THIS IS BROKEN, WEIRD AF
    console.log('Torrent created and seeding')
    
}




export const startSeeding = async () => {
    console.log('IS IT CONNECTED?????????', await deluge.isConnected())
    await addTorrents(torrentRoot);
    console.log('torrents are ', client.torrents)
    // TODO: BROKEN WATCHER
    // await startWatcher(); 
}


async function startWatcher() {

    // watch for any added
    const watcher = chokidar.watch(torrentRoot, { ignored: /^\./, persistent: true });

    async function onDirectoryAdded(path:string) {
        await processDirToTorrent(path);
    }

    watcher.on('addDir', async path => {
    if (await fs.stat(path) && (await fs.lstat(path)).isDirectory()) {
        await onDirectoryAdded(path);
    }
    });

}
