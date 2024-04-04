<template>
  <div class="grid md:mx-6 mx-3 mt-5 mb-3">
    <div
      class="col-12 md:col-4 md:col-offset-8 "
    >
      <InputGroup>
        <InputText
          v-model="searchQuery"
          placeholder="Keyword or Tag"
          @keyup.enter="submitSearch"
        />
        <Button
          :icon="loading ? 'pi pi-spinner pi-spin' : 'pi pi-search'"
          @click="submitSearch"
        />
      </InputGroup>
    </div>
  </div>
</template>
  


<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


export default defineComponent({
  name: 'SearchBar',
  components: {

  },
  props: {
    loading: Boolean,
  },
  setup() {

    const route = useRoute();
    const searchQuery = ref(route.query.search?.toString() || "");

    const router = useRouter();

    const submitSearch = () => {
      const escapedQuery = encodeURIComponent(searchQuery.value);
      router.push({ query: { search: escapedQuery } });
    };

    return {
      searchQuery,
      submitSearch,
    };
  },
});
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
}
</style>
