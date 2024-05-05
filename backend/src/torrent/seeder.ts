import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import WebTorrent from 'webtorrent-hybrid';
import {type WebTorrent as WebTorrentType} from '@types/webtorrent';
import chokidar from 'chokidar';
import {db} from '../db/db';
import Deluge from './deluge-client';

const TypedWebTorrent = WebTorrent as WebTorrentType;
export const client = new TypedWebTorrent({});

type TorrentMeta = {
	name: string;
	description: string;
	source: string;
};

const torrentRoot
  = process.env.TORRENT_DIR || path.resolve(import.meta.dir + '/../torrents/');

// Set up deluge API client
const delugeUrl = process.env.DELUGE_URI || 'http://localhost:8112/json';
const delugePass = process.env.DELUGE_PASSWORD || 'deluge';
const deluge = new Deluge(delugeUrl, delugePass, torrentRoot);

async function addTorrents(dir: string) {
	try {
		const torrentDirectories = await fs.readdir(dir, {withFileTypes: true});
		console.log('TORRENT DIRS FOUND', torrentDirectories);
		await Promise.all(
			torrentDirectories
				.filter(d => d.isDirectory())
				.map(async d => {
					const torrentPath = path.join(torrentRoot, d.name);
					console.log('torrentPath is', torrentPath);
					await processDirToTorrent(torrentPath);
				}),
		);
	} catch (error) {
		console.error(`Error reading directory ${dir}: ${error}`);
	}
}

async function processDirToTorrent(torrentDir: string) {
	console.log('torrentdir is', torrentDir);
	try {
		const torrentMetaDirty = (await import(
			path.join(torrentDir, 'meta.json')
		)) as TorrentMeta;
		// @ts-expect-error
		const torrentMeta = torrentMetaDirty.default;
		console.log('CLEAN TORRENT METADATA IS', torrentMeta);
		// Since webtorrent seems awful or even broken at seeding, also add it to a local deluge client for that initial seed
		// we also need to wrap the torrent name like this so that it will find it since deluge automatically wraps files like this in the torrent name, annoying and clunky

		console.log('creating a torrent from folder', torrentDir);
		const torrentName = path.basename(torrentDir);
		// Const folderHash = await hashFolder(contentsPath);
		const magnetLink = await new Promise<string>((res, rej) => {
			// @ts-expect-error
			client.seed(torrentDir, {name: torrentName}, torrent => {
				deluge
					.add(torrent.magnetURI, torrentRoot)
					.then(() => {
						console.log('deluge added');
						res(torrent.magnetURI);
					})
					.catch((error: unknown) => {
						rej(error);
					});
			});
		});

		const tags = torrentMeta.tags || [];
		delete torrentMeta.tags;
		const torrentForUpsert = {
			...torrentMeta,
			name: torrentName,
			magnetLink,
		};
		console.log('created torrent and attempting upsert', torrentForUpsert);

		await db.upsertTorrent(torrentForUpsert, tags);
		console.log('Torrent created and seeding');
	} catch (error) {
		if (error.code === 'ERR_MODULE_NOT_FOUND') {
			console.log(
				'watched a directory for torrents that didnt have a meta.json, skipping!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
			);
		} else {
			console.error('SKIPPING TORRENT DUE TO FAILURE:', error);
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

async function startWatcher() {
	// Watch for any added
	const watcher = chokidar.watch(torrentRoot, {
		ignored: /^\./,
		persistent: true,
		depth: 1,
	});

	async function onDirectoryAdded(newPath: string) {
		console.log('directory added from watch', newPath);
		const allTorrents = await db.getAllTorrents();
		const existing = allTorrents.find(t => t.name === path.basename(newPath));
		if (existing) {
			console.log('watched a torrent that already is in the db, skipping');
			return;
		}

		await processDirToTorrent(newPath);
	}

	watcher.on('addDir', async path => {
		if ((await fs.stat(path)) && (await fs.lstat(path)).isDirectory()) {
			await onDirectoryAdded(path);
		}
	});
}
