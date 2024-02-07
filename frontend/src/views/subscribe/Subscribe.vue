<template>
  <div class="about mx-0 md:mx-8 mt-6 mx-2">
    <Fieldset legend="Feed URL">
      <p class="m-0 font-bold">
        {{ rssFeedUrl }}
      </p>
    </Fieldset>
    <h2>QBittorrent Instructions</h2>
    <div class="instructions font-light">
      <p>
        To subscribe to the RSS feed of torrents, follow these steps:
      </p>
      <ol>
        <li> Go to Tools > Preferences </li>
        <li>Head to the RSS section on the bottom left, and then check "enable fetching RSS feeds". Set a high maximum article number like 100.</li>
        <li>While here also check "enable auto downloading of RSS torrents"</li>
        <li>Save settings and then head to the new RSS (0) tab on the top bar.</li>
        <li>Hit new subscription and enter the RSS feed URL:</li>
        <li>{{ rssFeedUrl }}</li> <!-- Replace with the actual RSS feed URL -->
        <li>Click on the "Subscribe" button.</li>
      </ol>
      <p>
        Once you have subscribed to the RSS feed, your torrent client should automatically download new torrents, thus joining the swarm to help make catastropic disclosure possible.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Subscribe',
  data() {
    return {
      //@ts-ignore
      rssFeedUrl: window.location.origin + '/torrent-feed' , // Replace with the actual RSS feed URL
    };
  },
});
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
