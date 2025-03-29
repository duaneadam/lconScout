// illustrations.vue
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
      }${humanizedAssetType.value} - Free Download in SVG, PNG, EPS | IconScout`
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
          } to enhance your design projects in Canva, Figma, Adobe XD, After Effects, Sketch & more. Available in SVG, PNG, EPS, AI or JPG formats.`
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
          } to enhance your design projects in Canva, Figma, Adobe XD, After Effects, Sketch & more. Available in SVG, PNG, EPS, AI or JPG formats.`
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
          } to enhance your design projects in Canva, Figma, Adobe XD, After Effects, Sketch & more. Available in SVG, PNG, EPS, AI or JPG formats.`
      ),
    },
  ],
});
</script>
