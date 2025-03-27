<template>
  <SearchLayout :card-variant="cardVariant" />
</template>

<script setup lang="ts">
const searchStore = useSearchStore();
const { query, apiTotalItems, humanizedAssetType } = storeToRefs(searchStore);

const cardVariant = computed(() =>
  searchStore.filters.assetType === "icons" ? "square" : "default"
);

await useAsyncData("search-init", () => searchStore.initializeFromRoute());

// SEO Meta Tags - Use computed refs from the store
useHead({
  title: computed(
    () =>
      `${formatNumber(apiTotalItems.value)} ${
        query.value ? capitalizeWords(query.value) + " " : ""
      }${humanizedAssetType.value} - Free Download | IconScout` // Simplified title
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
          } for commercial and personal use. Available in various styles.` // Simplified description
      ),
    },
  ],
});
</script>
