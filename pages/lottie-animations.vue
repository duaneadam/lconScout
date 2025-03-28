<template>
  <SearchLayout>
    <SearchResults :card-variant="cardVariant" />
  </SearchLayout>
</template>

<script setup lang="ts">
const searchStore = useSearchStore();
const { query, apiTotalItems, humanizedAssetType, filters } =
  storeToRefs(searchStore);

const cardVariant = computed(() =>
  filters.value.assetType === "icons" ? "square" : "default"
);

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
          } in GIF, static SVG, JSON for Lottie, AEP or MP4 formats. Bring motion to your designs or projects in Canva, Figma, Adobe XD, After Effects, Sketch & more.`
      ),
    },
    {
      name: "og:description",
      content: computed(
        () =>
          `Free Download ${formatNumber(apiTotalItems.value)} ${
            query.value ? capitalizeWords(query.value) + " " : ""
          }${
            humanizedAssetType.value
          } in GIF, static SVG, JSON for Lottie, AEP or MP4 formats. Bring motion to your designs or projects in Canva, Figma, Adobe XD, After Effects, Sketch & more.`
      ),
    },
    {
      name: "twitter:description",
      content: computed(
        () =>
          `Free Download ${formatNumber(apiTotalItems.value)} ${
            query.value ? capitalizeWords(query.value) + " " : ""
          }${
            humanizedAssetType.value
          } in GIF, static SVG, JSON for Lottie, AEP or MP4 formats. Bring motion to your designs or projects in Canva, Figma, Adobe XD, After Effects, Sketch & more.`
      ),
    },
  ],
});
</script>
