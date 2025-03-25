<template>
  <SearchLayout
    :title="title"
    :subtitle="subtitle"
    :current-asset-type="currentAssetType"
    :search-query="searchQuery"
    @update:total-items="updateTotalItems"
    @asset-type-changed="handleAssetTypeChange"
    @filter-changed="handleFilterChange"
  />
</template>

<script setup lang="ts">
const { totalItems, updateTotalItems } = await useInitialSearch(
  "3d-illustrations"
);

const {
  currentAssetType,
  humanizedAssetType,
  handleAssetTypeChange,
  handleFilterChange,
} = useSearchFilter("3d-illustrations");
const { searchQuery, performSearch } = useSearchQuery("3d-illustrations");

const { title, subtitle } = useSearchTitle(
  searchQuery,
  totalItems,
  humanizedAssetType
);

useHead({
  title: computed(
    () =>
      `${formatNumber(totalItems.value)} ${capitalizeWords(
        searchQuery.value
      )} ${
        humanizedAssetType.value
      } - Free Download in PNG, BLEND, glTF | IconScout`
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `Free Download ${formatNumber(totalItems.value)} ${capitalizeWords(
            searchQuery.value
          )} ${
            humanizedAssetType.value
          } for commercial and personal use in Canva, Figma, Adobe XD, After Effects, Sketch & more. Available in line, flat, gradient, isometric, glyph, sticker & more design styles`
      ),
    },
  ],
});
</script>
