<script setup lang="ts">

</script>

<template>
  <!-- <v-app-bar title="Be The Disclosure" elevation="3" density="default">
            </v-app-bar> -->

  <div class="header shadow-div grid">
    <div class="col-12 md:col-6 flex flex-column">
      <h1 class="title">
        Be The Disclosure <span class="font-light text-sm">(beta)</span>
      </h1>
      <p class="font-light font-xs m-0">
        Defeating adversarial censorship through peer-to-peer torrenting.
      </p>
    </div>

    <div class="col-12 md:col-6 flex flex-row gap-3 justify-content-center align-items-end md:pl-5">
      <router-link
        v-slot="{ isActive }"
        to="/"
      >
        <Button
          :class="{ active: isActive }"
          :disabled="isActive"
          severity="secondary"
          link
        >
          Torrents
        </Button>
      </router-link>
      <router-link
        v-slot="{ isActive }"
        to="/about"
      >
        <Button
          :class="{ active: isActive }"
          :disabled="isActive"
          severity="secondary"
          link
        >
          How this works
        </Button>
      </router-link>
      <router-link
        v-slot="{ isActive }"

        to="/subscribe"
      >
        <Button
          :class="{ active: isActive }"
          link
          :disabled="isActive"
          severity="secondary"
        >
          Subscribe
        </Button>
      </router-link>
      <router-link
        v-slot="{ isActive }"

        to="/upload"
      >
        <Button
          :class="{ active: isActive }"
          link
          :disabled="isActive"
          severity="secondary"
        >
          Upload
        </Button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.header {
    width: 100%;
    padding: 20px;
    padding-left: 50px;
}

.shadow-div {
    box-shadow: 0 6px 4px -4px gray;
}

.title {
    font-size: 1.3rem;
    min-width: 0;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.75rem;
    text-transform: none;
}

</style>
