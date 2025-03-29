// icons.vue
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

// SEO Meta Tags - Use computed refs from the store
useHead({
  title: computed(
    () =>
      `${formatNumber(apiTotalItems.value)} ${
        query.value ? capitalizeWords(query.value) + " " : ""
      }${humanizedAssetType.value} - Free Download | IconScout`
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
          } for commercial and personal use in Canva, Figma, Adobe XD, After Effects, Sketch & more. Available in line, flat, gradient, isometric, glyph, sticker & more design styles.`
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
          } for commercial and personal use in Canva, Figma, Adobe XD, After Effects, Sketch & more. Available in line, flat, gradient, isometric, glyph, sticker & more design styles.`
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
          } for commercial and personal use in Canva, Figma, Adobe XD, After Effects, Sketch & more. Available in line, flat, gradient, isometric, glyph, sticker & more design styles.`
      ),
    },
  ],
});
</script>
