import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import {auth, type VerifyJwtResult} from 'express-oauth2-jwt-bearer';
import {Feed} from 'feed';
import {db, type TorrentRecord} from './db/db';
import {client, startSeeding} from './torrent/seeder';
import {getUserInfo} from './auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
const staticAssetPath = path.join(__dirname, '../static');

// eslint-disable-next-line @typescript-eslint/no-floating-promises
startSeeding();

console.log('Starting Server');
const app = express();
const port = 3000;

app.use(express.json());

// Basic logging
app.use((request, res, next) => {
	console.log('Route hit', request.originalUrl);
	next();
});
app.get('/list', async (request, res) => {
	const {tag, search} = request.query;

	const videos = await db.getAllTorrents(tag, search);
	return res.status(200).send(videos);
});

// If (process.env.NODE_ENV === 'development'){
//     app.post('/insert/magnet', async (req,res) => {
//         const videoData = req.body.record as TorrentRecord;
//         try {
//             await db.addVideo(videoData);
//         } catch (e) {
//             return res.status(500).send(String(e));
//         }
//         return res.status(200).send({success:true})
//     })
// }

export type UploadResponse = {
	message: string;
	success: boolean;
};

const jwtCheck = auth({
	audience: 'https://www.bethedisclosure.com/api',
	issuerBaseURL: process.env.TOKEN_ISSUER || 'https://dev-qrziy3kg2izg6egj.us.auth0.com/',
	tokenSigningAlg: 'RS256',
});

app.post('/upload', jwtCheck, async (request, res) => {
	const auth = request.auth as VerifyJwtResult;
	console.log('auth is', auth);
	const userInfo = await getUserInfo(auth);
	if (userInfo instanceof Error) {
		res.status(401).send();
		return;
	}

	const magnetLink = request.body.magnetLink;
	if (!magnetLink) {
		res.status(400).send('Missing magnet link in the request body');
		return;
	}

	console.log('user', userInfo);
	try {
		await db.upload(magnetLink);
		res.status(200).send({success: true});
	} catch (error) {
		console.error(error);
		res.status(500).send('Error uploading magnet link');
	}
});

app.get('/torrent-feed', async (request, res) => {
	try {
		const videos = await db.getAllTorrents();

		const feed = new Feed({
			title: 'UFO Torrent Feed',
			description: 'Feed of ufo content for mirroring',
			link: 'https://bethedisclosure.com/torrent-feed',
			language: 'en',
			id: 'https://bethedisclosure.com',
			copyright: 'GPL',
		});

		for (const video of videos) {
			feed.addItem({
				title: video.name,
				description: 'Magnet link for ' + video.name,
				link: video.magnetLink,
				id: video.magnetLink,
				date: new Date(video.createdAt),
				enclosure: {
					url: `${video.magnetLink}`,
					type: 'application/x-bittorrent',
				},
			});
		}

		res.contentType('text/xml');
		res.send(feed.rss2());
	} catch (error) {
		console.error(error);
		res.status(500).send('Error generating feed');
	}
});

// If (process.env.NODE_ENV !== 'development'){
//     app.use(express.static(staticAssetPath));
//     console.log("serving statics from ", staticAssetPath);

//     // All other GET requests not handled before will return our Vue app
//     app.get('*', (req, res) => {
//         console.log("Serving homepage off route" , req.path);
//         res.sendFile(path.join(staticAssetPath, 'index.html'));
//     });
// }

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
