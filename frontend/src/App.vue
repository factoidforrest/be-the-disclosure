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
  <Header></Header>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <TorrentList :torrents="sampleTorrents"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
