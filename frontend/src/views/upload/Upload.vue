<template>
  <div class="about mx-0 md:mx-8 mt-6 mx-2">
    <h2>Uploading</h2>
    <p class="notification-blurb">
      <strong>Note:</strong> At present, uploads go through a manual review process before they are permanently added to the swarm. If this doesn't work,
      you're confused about torrenting but want to contribute anyway, or you have other questions, 
      you can email <a href="mailto:upload@bethedisclosure.com">upload@bethedisclosure.com</a>.
    </p>
  </div>
  <form>
    <Panel
      header="Create Torrent"
      class="md:m-8 "
    >
      <div class="flex flex-column gap-5">
        <div class="flex flex-column gap-2">
          <label for="magnetlink">Magnet Link</label>
          <InputText
            id="magnetlink"
            v-model="magnetlink"
            aria-describedby="magnet-help"
          />
          <small id="magnet-help">Use your torrent client to create a new torrent and copy the magnet link it creates here. Remember to seed for at least a few days.</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="title">Title</label>
          <InputText
            id="title"
            v-model="title"
          />
          <!-- <small id="username-help">Enter your username to reset your password.</small> -->
        </div>
        <div class="flex flex-column gap-2">
          <label for="description">Description</label>
          <Textarea
            id="description"
            v-model="description"
            aria-describedby="describe-help"
          />
          <small id="describe-help">Please describe the contents in a few sentences, please try to be professional and proof-read.</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="tags">Tags</label>
          <InputText
            id="tags"
            v-model="newTag"
            aria-describedby="tag-help"
          />
          <small id="tag-help">type a single-word tag and hit enter to add it to the tags. Example: "david-grusch"</small>
        </div>
        <div class="flex flex-wrap gap-2">
          <Chip
            v-for="tag in tags"
            :key="tag"
            :label="tag"
            removable
            :remove="() => {console.log('ass')}"
          />
        </div>
      </div>
    </Panel>
  </form>
</template>
  
  <script setup lang="ts">
    import auth0 from 'auth0';
    import {ref} from 'vue';
    const tags = ref<Array<string>>(['ass','double ass']);

    function removeTag(tag: string) {
      tags.value = tags.value.filter((t) => t !== tag);
    }
  </script>
  
<style scoped>
  .notification-blurb {

    background-color: #e2e8f0;
    border-radius: 10px;
    color: #334155;
    font-weight: 500;
    line-height: 1.5;
    padding: 1rem;
  }
</style>
