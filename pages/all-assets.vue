<template>
  <SearchLayout
    :title="title"
    :subtitle="subtitle"
    :current-asset-type="filters.assetType"
    :search-query="query"
    card-variant="square"
  />
</template>

<script setup lang="ts">
const route = useRoute();
const { filters, humanizedAssetType, totalItems, query } = storeToRefs(
  useSearchStore()
);
const { fetchResults, updateQuery } = useSearchStore();

// Update query from route params if present
onMounted(() => {
  if (route.params.query) {
    updateQuery(decodeURIComponent(route.params.query as string));
  } else {
    updateQuery("");
  }
  
  // Fetch initial results
  fetchResults("all-assets");
});

// Watch for route parameter changes
watch(
  () => route.params.query,
  (newQuery) => {
    if (newQuery) {
      updateQuery(decodeURIComponent(newQuery as string));
    } else {
      updateQuery("");
    }
    fetchResults("all-assets");
  }
);

const { title, subtitle } = useSearchTitle(
  query,
  totalItems,
  humanizedAssetType
);

useHead({
  title: computed(
    () =>
      `${formatNumber(totalItems.value)} ${capitalizeWords(
        query.value
      )} ${
        humanizedAssetType.value
      } - Free Download | IconScout`
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `Free Download ${formatNumber(totalItems.value)} ${capitalizeWords(
            query.value
          )} ${
            humanizedAssetType.value
          } for commercial and personal use in Canva, Figma, Adobe XD, After Effects, Sketch & more. Available in line, flat, gradient, isometric, glyph, sticker & more design styles`
      ),
    },
  ],
});
</script>
