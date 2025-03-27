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
const {
  filters,
  humanizedAssetType,
  exclusiveItemsCount,
  totalItems,
  query,
  isLoading,
} = storeToRefs(useSearchStore());
const { fetchResults, updateQuery } = useSearchStore();

// Fetch initial data
await useAsyncData("lottie-search", async () => {
  return fetchResults("lottie");
});

// Watch for route parameter changes
watch(
  () => route.params.query,
  (newQuery) => {
    if (newQuery) {
      updateQuery(decodeURIComponent(newQuery as string));
    }
  }
);

const { title, subtitle } = useSearchTitle(
  query,
  totalItems,
  exclusiveItemsCount,
  humanizedAssetType,
  isLoading
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
