<template>
  <div>
    <h1>Subscribe to Torrent RSS Feed</h1>
    <p>
      To subscribe to the RSS feed of torrents, follow these steps:
    </p>
    <ol>
      <li>Open your torrent client (e.g., qBittorrent).</li>
      <li>Navigate to the RSS feed section.</li>
      <li>Click on the "Add RSS feed" button.</li>
      <li>Enter the RSS feed URL:</li>
      <li>{{ rssFeedUrl }}</li> <!-- Replace with the actual RSS feed URL -->
      <li>Click on the "Subscribe" button.</li>
    </ol>
    <p>
      Once you have subscribed to the RSS feed, your torrent client will automatically download new torrents that match the specified criteria.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Subscribe',
  data() {
    return {
      rssFeedUrl: 'https://example.com/rss-feed', // Replace with the actual RSS feed URL
    };
  },
});
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
