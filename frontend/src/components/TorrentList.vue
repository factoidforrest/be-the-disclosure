<template>
    <v-container>
      <v-list two-line>
        <v-list-item 
          v-for="(torrent, index) in torrents" 
          :key="torrent.id" 
          three-line 
          class="mb-2"
        >
          <v-card class="pa-3" outlined>
            <v-list-item-content>
              <v-list-item-title>{{ torrent.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ torrent.description }}</v-list-item-subtitle>
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
            <v-list-item-subtitle>
              Added on: {{ formatDate(torrent.createdAt) }}
              <span v-if="torrent.source">, Source: {{ torrent.source }}</span>
            </v-list-item-subtitle>
          </v-card>
          <!-- Add a divider between list items, except after the last item -->
          <v-divider v-if="index < torrents.length - 1" />
        </v-list-item>
      </v-list>
    </v-container>
  </template>
  
<script lang="ts">
  import { defineComponent } from 'vue';

  import {api, Torrent} from '../api'

  export default defineComponent({
    name: 'TorrentList',
    data() {
    return {
      torrents: [] as Torrent[]
    };
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
  
  