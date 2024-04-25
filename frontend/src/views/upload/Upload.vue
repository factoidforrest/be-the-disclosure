<template>
  <div class="about mx-0 md:mx-8 mt-6 mx-2">
    <h2>Uploading</h2>
    <p class="notification-blurb">
      <strong>Note:</strong> You will need to create a torrent with your torrent
      client to do this. This wizard will walk you through it. At present,
      uploads go through a manual review process before they are permanently
      added to the swarm. If this doesn't work, you're confused about torrenting
      but want to contribute anyway, or you have other questions, you can email
      <a href="mailto:upload@bethedisclosure.com">upload@bethedisclosure.com</a
      >.
    </p>
  </div>
  <form @submit.prevent>
    <Panel header="Create Torrent" class="md:m-8">
      <Stepper>
        <StepperPanel header="Enter Details">
          <template #content="{ nextCallback }">
            <div class="">
              <div class=" ">
                <div class="flex flex-column gap-5">
                  <div class="flex flex-column gap-2">
                    <label for="description">Description</label>
                    <Textarea
                      id="description"
                      v-model="description"
                      aria-describedby="describe-help"
                      required
                    />
                    <small id="describe-help"
                      >Please describe the contents in a few sentences, please
                      try to be professional and proof-read.</small
                    >
                  </div>
                  <div class="flex flex-column gap-2">
                    <label for="tags">Tags</label>
                    <InputGroup>
                      <InputText
                        v-model="newTag"
                        aria-describedby="tag-help"
                        @keydown.enter="addTag()"
                      />
                      <Button
                        icon="pi pi-plus"
                        severity="primary"
                        @click="addTag()"
                      />
                    </InputGroup>

                    <small id="tag-help"
                      >Type a single-word tag and hit enter to add it to the
                      tags. Try doing at least a couple! Examples: "david-grusch", "jelleyfish", "documents"</small
                    >
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Chip
                      v-for="tag in tags"
                      ref="chipRefs"
                      :key="tag"
                      :label="tag"
                      removable
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex pt-4 justify-content-end">
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="nextCallback"
                :disabled="!formValid"
              />
            </div>
          </template>
        </StepperPanel>
        <StepperPanel>
          <template #header="{ index, clickCallback }">
            <button @click="(e) => {e.preventDefault(); formValid && clickCallback()}" class="p-stepper-action" role="tab" data-pc-section="action"><span class="p-stepper-number" data-pc-section="number">{{2}}</span><span class="p-stepper-title" data-pc-section="title">Insert Metadata</span></button>
        </template>
          <template #content="{ prevCallback, nextCallback }">
            <p>Create a folder on your computer with your desired torrent contents inside. Create a file called <code class="font-bold">meta.json</code> in the root of the folder,
               open it with any text editor (notepad is fine) and paste in the below information. You can remove the "creator" if you want to be anonymous.</p>
            <div class="">
              <VCodeBlock
                :code="metadata"
                highlightjs
                label="meta.json"
                lang="json"
                theme="monokai"
              />
            </div>
            <div class="flex pt-4 justify-content-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="prevCallback"
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="nextCallback"
              />
            </div>
          </template>
        </StepperPanel>
        <StepperPanel header="Paste Magnet Link">

          <template #header="{ index, clickCallback }">
            <button :disabled="!formValid" @click="(e) => {clickCallback()}" class="p-stepper-action" role="tab" data-pc-section="action"><span class="p-stepper-number" data-pc-section="number">{{3}}</span><span class="p-stepper-title" data-pc-section="title">Paste Magnet Link</span></button>
        </template>
        <template  #content="{ prevCallback }">
          <p v-if="uploadRes">{{ uploadRes.message }}</p>
          <div class="">
            <div class="">
              <p>Almost done! In your torrent client create a torrent from your folder containing the <code>meta.json</code> and your ufo-related files. Note that what you name the torrent will show up for everyone, so use a good name!  Once your torrent is created and seeding, get a magnet link from your client and paste it here.</p>
              <form>
              <div class="flex flex-column gap-2">
                <label for="magnetlink">Magnet Link</label>
                <InputText
                  id="magnetlink"
                  v-model="magnetLink"
                  aria-describedby="magnet-help"
                  required
                  :invalid="magnetLink !== '' && !magnetValid"
                />
                <small id="magnet-help"
                  >Use your torrent client to create a new torrent and copy
                  the magnet link it creates here. Remember to seed for at
                  least a few days.</small
                >
              </div>
            </form>
              <p>The system will begin loading your torrent shortly, although it won't be added to the RSS feed for the rest of the swarm, or appear on the site, until it has been reviewed by a moderator.</p>
            </div>
          </div>
          <div class="flex pt-4 justify-content-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="prevCallback"
            />
            <Button
              label="Submit"
              :disabled="!magnetValid || isLoading"
              severity="success"
              :icon="isLoading ? 'pi pi-spinner pi-spin' : 'pi pi-arrow-right'"
              iconPos="right"
              @click="submitMagnet"
            />
          </div>
        </template>
        </StepperPanel>
      </Stepper>
    </Panel>
  </form>
</template>

<script setup lang="ts">
  import VCodeBlock from '@wdns/vue-code-block';
import {computed, ref, VNodeRef, watch} from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import {api, UploadRes} from '../../api'
const auth0 = useAuth0();
const tags = ref<Array<string>>([]);
const newTag = ref("");

// const chipContainer = ref<VNodeRef>();
// const chipContainerRef = chipContainer.value;
// const chipElements = chipContainerRef.children;
// const chipTexts = Array.from(chipElements).map(chip => chip.innerText);
// console.log(chipTexts);

const chipRefs = ref<VNodeRef[]>([])
// @ts-ignore
// console.log(chipRefs._value.map((r) => r.label))

const description = ref("");
const source = ref("");
const magnetLink = ref("");
const formValid = computed(() => description.value !== "");

function addTag(){
  if (!newTag.value){
    return;
  }
  tags.value.push(newTag.value.toLowerCase());
  newTag.value = "";
}

const metadata = computed(() => {
  const m =  {
    description:description.value,
    source:source.value,
    creator: auth0.user.value?.given_name || auth0.user.value?.email,
    // @ts-ignore
    tags: chipRefs.value.map((r) => r.label)
  }
  const prettyJson = JSON.stringify(m, null, 2);
  return prettyJson;

  });

const magnetRegex = /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i

const magnetValid = computed(() => {
  console.log('computing valid regex')
  console.log(magnetRegex.test(magnetLink.value))
  return magnetRegex.test(magnetLink.value)
})

const isLoading = ref(false);
const uploadRes = ref<UploadRes|null> (null);
async function submitMagnet() {
  isLoading.value = true;
  const res = await api.upload(magnetLink.value, await auth0.getAccessTokenSilently());
  uploadRes.value = res;
}

//magnet:?xt=urn:btih:ebea1d2fbda94017c4f96614b5b3f5ac93f04678&dn=4chan%20Crash%20Retrievals&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337
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


