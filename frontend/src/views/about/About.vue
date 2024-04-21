<template>
  <div class="about mx-0 md:mx-8 mt-6 mx-2">
    <div class="faq">
      <div
        v-for="(question, index) in faqList"
        :key="index"
        class="faq-item"
      >
        <h3 class="text-center md:text-left underline">
          {{ question.question }}
        </h3>
        <p
          class="font-light font-xs m-0"
          v-html="question.answer"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'About',
  components: {},
  data() {
    return {
      faqList: [
        {
          question: 'What is this?',
          answer: 'This simple website is a curated torrent tracker of UAP related videos and files, offering torrents for download and an RSS feed of new torrents to automatically subscribe to.',
        },
        {
          question: 'Why is this necessary?',
          answer: `As users of the internet, we think of sites like YouTube, Facebook, and X as user-curated spaces safe
          from tampering, shaping, and censorship. As recent revelations (or even a moments consideration) have shown 
          about the connections between the US government and social networks, 
          this is not the case. Moderators at tech companies censor information continuously at the behest of the government who claims to be curbing disinformation online.
          To succeed, we must aknowledge that NHI information exists in an adversarial environment in which clandestine efforts 
          by the CIA, the DOE, and others are ongoing to suppress it. Hardened content distribution is 
          necessary for "Catastropic Disclosure" to even be possible. 
          `,
        },
        {
          question: 'What are torrents?',
          answer: `Torrents are a way to download and share files without a central server as a host. Each downloader shares the task of distributing the file to the other downloaders. Typically associated with content-piracy, they are difficult to stop and hardended against attack.
          You need a torrent client, like qBittorrent (or Flud on Android), to download and share files. It is easy. 
          `,
        },

        {
          question: 'Who should submit files?',
          answer: `Those who come across or create UFO related files and who wish to preserve their evidence against censorship should upload them here. 
          Submissions relating to gravimetric technologies and other related topics are also welcome.
          `,
        },
        {
          question: 'How can you help?',
          answer: `You can <a href="/subscribe">subscribe</a> to the torrent RSS feed and become part of the swarm. Your torrent client (like qBittorrent) will 
          automatically fetch new files from the swarm as they become available, ensuring that distribution of the files cannot be stopped
           even if this server goes down. As a bonus, you will find interesting UFO videos and documents downloaded on your computer
           and ready to view when you check your client. Ensure that files are set to seed forever.
          `,
        },
        
        // Add more FAQ items here
      ],
    };
  },
});
</script>

<style scoped>
.about {
  /* Add PrimeVue spacing and styling classes here */
}

.faq {
  /* Add PrimeVue spacing and styling classes here */
}

.faq-item {
  /* Add PrimeVue spacing and styling classes here */
}
</style>
