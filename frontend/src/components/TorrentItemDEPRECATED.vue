<template>
    <AccordionTab :key="torrent.id" class="" header="ass">
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

    
</template>
<script setup lang="ts">
import {type Torrent} from '../api';
import {type Instance} from '../types/webtorrent';


export interface Props {
    torrent: Torrent;
    client: Instance;
}
defineProps<Props>()


const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
const openMagnet = (link: string) =>  {
    // @ts-ignore
    window.location.href = link;
    }

</script>
<style >
    
</style>