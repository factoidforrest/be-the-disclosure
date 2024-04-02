<template>
  <div class="row justify-content-center align-items-center">
    <div class="search-bar col-4">
      <InputGroup>
        <InputText
          v-model="searchQuery"
          placeholder="Keyword"
          @keyup.enter="submitSearch"
        />
        <Button
          icon="pi pi-search"
          severity=""
          @click="submitSearch"
        />
      </InputGroup>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'SearchBar',
  components: {

  },
  setup() {
    const searchQuery = ref('');

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
