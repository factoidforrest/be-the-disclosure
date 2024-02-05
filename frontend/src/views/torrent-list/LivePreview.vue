<script setup lang="ts">
import {type Torrent} from '../api';
import WebTorrent, {type Instance} from '../types/webtorrent';
import { ref, reactive } from 'vue';
import { Ref } from 'vue';
import { onMounted } from 'vue';

export interface Props {
    torrent: Torrent;
    client: Instance;
}
const props = defineProps<Props>()


const fetchedTorrent: Ref<WebTorrent.Torrent | null> = ref(null);
 
onMounted(() => {


    console.log("MOUNTED RAN");
    

    props.client.on('error', (err: unknown) => {
        console.log('[+] Webtorrent error: ' + err);
    });

    findOrCreateTorrent(props.client, props.torrent.magnetLink).then((torrent) => {
        fetchedTorrent.value = reactive(torrent);
        console.log('torrent added is ', torrent)
        // const interval = setInterval(() => {
        //     // console.log('[+] Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
        //     this.setState({torrentProgress: (torrent.progress * 100).toFixed(1) + '%'});
        // }, 5000);
        torrent.on('done', () => {
            console.log('Progress: 100%');
            // clearInterval(interval);
        })

        // this.setState({
        //     torrentInfoHash: torrent.infoHash,
        //     torrentMagnetURI: torrent.magnetURI,
        //     torrentName: torrent.name,
        //     torrentFiles: torrent.files
        // });

        // TODO Figure out a better way to render these files 
        torrent.files.map((file) => {
            file.appendTo(`body`);
        })
        console.log(torrent);
    })
      

    });

// const randIdForPreview = ref<string>(Math.random().toString())



function findOrCreateTorrent(client: Instance, magnetURI: string): Promise<WebTorrent.Torrent> {
    return new Promise<WebTorrent.Torrent>((res, rej) => {
        try{
            const existing = client.torrents.find((t) => t.magnetURI === magnetURI);
            console.log('searching through ', client.torrents)
            if (existing){
                console.log('found existing torrent')
                return res(existing);
            }

            props.client.add(props.torrent.magnetLink, (newTorrent) => {
                console.log('adding new torrent')
                res(newTorrent);
            });
        } catch (e) {
            rej(e);
        }

    })
    
}

    


</script>

<template>

    <Card class="flex flex-column align-items-center justify-content-center">
        <template #header>
            <span class="text-center" style="{text-align: center}">Live Preview</span>
        </template>
        <template #content>
            <p v-if="!fetchedTorrent">Failed to start torrent. Sorry, this is experimental. Download using the magnet link and a torrent client to view this file.</p>
            {{ fetchedTorrent?.progress }}% Loaded, {{ fetchedTorrent?.numPeers }} peers    
        </template>
    </Card>
</template>

<style scoped>


</style>
