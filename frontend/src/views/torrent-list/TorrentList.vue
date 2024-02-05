<template>
  <Accordion :multiple="true" class="mx-0 md:mx-8 mt-6">
    <span v-for="torrent in torrents" >ass2 {{ torrent.id }}</span>
    <span>test</span>
    <p>text-justify</p>

    <AccordionTab  v-for="torrent in torrents" :key="torrent.id" class="">
      <template #header>
            <div class="flex gap-2 w-full  flex-column md:flex-row md:justify-content-end md:align-items-end">
                <!-- <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" /> -->
              <span class="font-bold white-space-nowrap">{{torrent.name}}</span>
                <!-- <Badge value="3" class="ml-auto" /> -->
              <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis font-light text-sm" >{{ torrent.description }}</span>

            </div>
        </template>
        <div class="grid p-3">
    <div class="col-12 md:col-4 flex flex-column">
        <span class="m-1">Added on: {{ formatDate(torrent.createdAt) }}</span>
        <!-- <a :href="torrent.magnetLink">
          <v-icon name="io-magnet" style="color:red"/>
            Magnet Link
          </a> -->
          <!-- <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="p-button font-bold">Navigate</a> -->

          <!-- <Button class="m-1" link icon="pi pi-users" badge="8" badgeClass="p-badge-danger">Preview Content</Button> -->
          <!-- <a>Preview Content <span class="font-light">(experimental)</span></a> -->
          <span class="m-1">Tag groups: <span class="font-light">(coming soon)</span></span>
        <Button class="p-2 m-1" severity="danger" label="Magnet Link" icon="pi pi-download" size="small" outlined @click="openMagnet(torrent.magnetLink)"/>
        <!-- <Button class="p-2 m-1" label="Live Preview (coming soon)" icon="pi pi-play" size="small" :outlined="!torrent.livePreview" @click="toggleLivePreview(torrent)" /> -->
        <Button class="p-2 m-1" label="Live Preview (coming soon)" icon="pi pi-play" size="small" :outlined="!torrent.livePreview"  />

        </div>
        <div class="col-8"> 
          <!-- <h4 class="p-0 m-0">{{ torrent.name }}</h4> -->
            <p>{{ torrent.description }}</p>
        </div>
        <div class="col">
            <div v-if="torrent.livePreview" class="webtorrent-container">
              <LivePreview :torrent="torrent" :client="client"/>
            </div>
        </div>
    </div>
    </AccordionTab>
</Accordion>
<!-- 
    <v-container>
      <v-list two-line>
        <v-list-item 
          v-for="(torrent, index) in torrents" 
          :key="torrent.id" 
          three-line 
          class="mb-2"
        >
          <v-card class="pa-3 torrent-container" outlined>
            <v-list-item-content>
              <v-list-item-title>{{ torrent.name }}</v-list-item-title>
              <v-list-item-subtitle >{{ torrent.description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <a :href="torrent.magnetLink">
                <v-icon
                    size="medium"
                    color="red"
                    icon="mdi-magnet"
                    >
                </v-icon>
                Torrent Magnet
              </a>
            </v-list-item-action>
            <text-caption class="text-medium-emphasis ">
              Added on: {{ formatDate(torrent.createdAt) }}
              <span v-if="torrent.source">, Source: 
                <v-list-item-subtitle>
                  <a v-bind:href="torrent.source">{{ torrent.source }}</a>
              </v-list-item-subtitle></span>
            </text-caption>
          </v-card>
          Add a divider between list items, except after the last item -->
          <!-- <v-divider v-if="index < torrents.length - 1" />
        </v-list-item>
      </v-list>
    </v-container> -->
  </template>
  
<script lang="ts">
  // @ts-ignore
  import WebTorrentHybrid from 'webtorrent';
  import {type WebTorrent as WebTorrentType} from '../../types/webtorrent';
  import { defineComponent } from 'vue';
  import { BiMagnetFill } from "oh-vue-icons/icons"
  import {api, Torrent} from '../../api'
  import LivePreview from './LivePreview.vue'


  const TypedWebTorrent = WebTorrentHybrid as WebTorrentType;

  export default defineComponent({
      name: 'TorrentList',
      data() {
      return {
        torrents: [] as Torrent[],
        client: new TypedWebTorrent({}),
      };
    },
    components: {
      BiMagnetFill,
      LivePreview
    },
    methods: {
      formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      },
      openMagnet(link: string) {
        // @ts-ignore
        window.location.href = link;
      },
      toggleLivePreview(torrent: Torrent){
        console.log(torrent);
        // @ts-ignore THIS IS AUTOMATIC UNWRAPPED WTH
        torrent.livePreview = !torrent.livePreview;
        console.log('livepreivew is ', torrent.livePreview)
      }
    },
    async mounted() {

        try {
        this.torrents = await api.list();
        
        } catch (error) {
        console.error('There was an error fetching the torrents:', error);
        }

        // var torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'

        
        

        
        // this.client.on('error', err => {
        //   console.log('[+] Webtorrent error: ' + err);
        // });



        // this.client.add(torrentId, (torrent) => {
        //   // const interval = setInterval(() => {
        //   //   // console.log('[+] Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
        //   //   this.setState({torrentProgress: (torrent.progress * 100).toFixed(1) + '%'});
        //   // }, 500);
        //   // torrent.on('done', () => {
        //   //   console.log('Progress: 100%');
        //   //   clearInterval(interval);
        //   // })

        //   torrent.files.forEach((file) => {
        //     file.appendTo('body');
        //   })

        //   });
  }
  });
  </script>
  
  <style>
  .v-container {
    padding-top:75px;
  }

  .torrent-container {
    box-shadow: 0px 4px 4px -2px grey;
  }

  .p-accordion-content{
    padding: 0;
  }
</style>