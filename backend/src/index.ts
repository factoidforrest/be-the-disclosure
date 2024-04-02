import express from 'express';
import {db, type TorrentRecord} from './db/db'
import path from 'path'

import { Feed } from 'feed';
import {client, startSeeding} from './torrent/seeder'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log(__dirname);
const staticAssetPath = path.join(__dirname, '../static')

startSeeding().then(() => {
    console.log("Starting Server")
    const app = express();
    const port = 3000;



    app.use(express.json());



    // basic logging
    app.use((req,res,next) => {
        console.log('Route hit ', req.originalUrl);
        next();
    })
    app.get('/list', async (req,res) => {

        const {tag, search} = req.query;

        const videos = await db.getAllTorrents(tag, search);
        return res.status(200).send(videos);
    })

    // if (process.env.NODE_ENV === 'development'){
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

    app.get('/torrent-feed', async (req, res) => {
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

            videos.forEach(video => {
                feed.addItem({
                    title: video.name,
                    description: 'Magnet link for ' + video.name,
                    link: video.magnetLink, 
                    id: video.magnetLink,
                    date: new Date(video.createdAt as Date), 
                    enclosure: {
                        url: `${video.magnetLink}`, 
                        type: 'application/x-bittorrent'
                    }
                });
            });

            res.contentType('text/xml');
            res.send(feed.rss2());
        } catch (error) {
            console.error(error);
            res.status(500).send('Error generating feed');
        }
    });


    if (process.env.NODE_ENV !== 'development'){
        app.use(express.static(staticAssetPath));
        console.log("serving statics from ", staticAssetPath);

        // All other GET requests not handled before will return our Vue app
        app.get('*', (req, res) => {
            console.log("Serving homepage off route" , req.path);
            res.sendFile(path.join(staticAssetPath, 'index.html'));
        });
    }


    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

});
