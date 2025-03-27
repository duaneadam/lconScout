<template>
  <div>
    <SearchLayout
      :title="title"
      :subtitle="subtitle"
      :current-asset-type="filters.assetType"
      :search-query="query"
      card-variant="square"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAsyncData } from "nuxt/app";

const route = useRoute();
const { filters, humanizedAssetType, exclusiveItemsCount, totalItems, query } =
  storeToRefs(useSearchStore());
const { fetchResults, updateQuery } = useSearchStore();

// Fetch initial data
await useAsyncData("lottie-search", async () => {
  if (route.params.query) {
    updateQuery(decodeURIComponent(route.params.query as string));
  }
  return fetchResults("lottie");
});

// Watch for route parameter changes
watch(
  () => route.params.query,
  (newQuery) => {
    if (newQuery) {
      updateQuery(decodeURIComponent(newQuery as string));
    }
    fetchResults("lottie");
  }
);

const { title, subtitle } = useSearchTitle(
  query,
  totalItems,
  exclusiveItemsCount,
  humanizedAssetType
);

useHead({
  title: computed(
    () =>
      `${formatNumber(totalItems.value)} ${capitalizeWords(query.value)} ${
        humanizedAssetType.value
      } - Free Download in JSON | IconScout`
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
