<script setup lang="ts">
import {type Torrent} from '../api';
import {type Instance} from '../types/webtorrent';
import { ref } from 'vue';
import { Ref } from 'vue';
import { onMounted } from 'vue';

export interface Props {
    torrent: Torrent;
    client: Instance;
}
const props = defineProps<Props>()


const fetchedTorrent: Ref<Instance['torrents'][number] | null> = ref(null);
 
onMounted(() => {


    console.log("MOUNTED RAN");
    

    props.client.on('error', (err: unknown) => {
        console.log('[+] Webtorrent error: ' + err);
    });

    props.client.add(props.torrent.magnetLink, (torrent) => {

        fetchedTorrent.value = torrent;
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

    });

// const randIdForPreview = ref<string>(Math.random().toString())
}) 

    


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
