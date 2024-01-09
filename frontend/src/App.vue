<script setup lang="ts">
import TorrentList from './components/TorrentList.vue';
import Header from './components/Header.vue';


const sampleTorrents = [
  {
    id: 1,
    name: 'Example Torrent 1',
    magnetLink: 'magnet:?xt=urn:btih:EXAMPLEHASH1',
    createdAt: '2023-01-01T00:00:00Z',
    source: 'Source A',
    description: 'This is a description of the first example torrent.'
  },
  {
    id: 2,
    name: 'Example Torrent 2',
    magnetLink: 'magnet:?xt=urn:btih:EXAMPLEHASH2',
    createdAt: '2023-01-02T00:00:00Z',
    description: 'This is a description of the second example torrent.'
  }
]


</script>

<template>
  <v-app>
    
    <Header></Header>
    <container>
      <TorrentList :torrents="sampleTorrents"/>

    </container>
</v-app>

</template>

<style scoped>

</style>
