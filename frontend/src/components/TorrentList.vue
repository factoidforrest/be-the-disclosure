<template>
        
  <Accordion :activeIndex="0" :multiple="true" class="mx-0 md:mx-8 mt-6">
    <AccordionTab v-for="(torrent) in torrents" :key="torrent.id" class="">
      <template #header>
            <span class="flex align-items-center gap-2 w-full pr-8">
                <!-- <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" /> -->
                <span class="font-bold white-space-nowrap">{{torrent.name}}</span>
                <!-- <Badge value="3" class="ml-auto" /> -->
              <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis font-light text-sm" >{{ torrent.description }}</span>

            </span>
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
        <Button class="p-2 m-1" label="Live Preview (experimental)" icon="pi pi-play" size="small" outlined/>
        </div>
        <div class="col-8">
          <!-- <h4 class="p-0 m-0">{{ torrent.name }}</h4> -->
            <p>{{ torrent.description }}</p>
        </div>
        <div class="col">
            <div class="webtorrent-container"></div>
        </div>
    </div>
    </AccordionTab>
    <AccordionTab header="Header II">
        <p class="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
        </p>
    </AccordionTab>
    <AccordionTab header="Header III">
        <p class="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
            culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
        </p>
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

  import { defineComponent } from 'vue';
  import { BiMagnetFill } from "oh-vue-icons/icons"
  import {api, Torrent} from '../api'

  export default defineComponent({
      name: 'TorrentList',
      data() {
      return {
        torrents: [] as Torrent[]
      };
    },
    components: {
      BiMagnetFill
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
      }
    },
    async mounted() {
        try {
        this.torrents = await api.list();
        
        } catch (error) {
        console.error('There was an error fetching the torrents:', error);
        }
  }
  });
  </script>
  
  <style scoped>
  .v-container {
    padding-top:75px;
  }

  .torrent-container {
    box-shadow: 0px 4px 4px -2px grey;
  }
</style>