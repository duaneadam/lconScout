<template>
  <SearchLayout card-variant="default" />
</template>

<script setup lang="ts">
const searchStore = useSearchStore();
const { query, apiTotalItems, humanizedAssetType } = storeToRefs(searchStore);

await useAsyncData("search-init", () => searchStore.initializeFromRoute());

useHead({
  title: computed(
    () =>
      `${formatNumber(apiTotalItems.value)} ${
        query.value ? capitalizeWords(query.value) + " " : ""
      }${humanizedAssetType.value} - Free Download in JSON | IconScout`
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `Free Download ${formatNumber(apiTotalItems.value)} ${
            query.value ? capitalizeWords(query.value) + " " : ""
          }${
            humanizedAssetType.value
          } for commercial and personal use in Canva, Figma, Adobe XD, etc.`
      ),
    },
  ],
});
</script>
