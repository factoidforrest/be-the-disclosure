import express from 'express';
import RSS from 'rss';
import {db, type TorrentRecord} from './db/db'


import { Feed } from 'feed';
import {client, startSeeding} from './torrent/seeder'


startSeeding().then(() => {
    console.log("Starting Server")
    const app = express();
    const port = 3000;

    app.use(express.json());


    app.use((req,res,next) => {
        console.log('Route hit ', req.originalUrl);
        next();
    })
    app.get('/list', async (req,res) => {
        const videos = await db.getAllVideos();
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
            const videos = await db.getAllVideos();

            const feed = new Feed({
                title: 'UFO Torrent Feed',
                description: 'Feed of ufo content for mirroring',
                link: 'http://localhost:3000/torrent-feed',
                language: 'en',
                id: 'http://localhost:3000',
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


    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

});
