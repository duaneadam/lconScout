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
  "lottie-animations"
);

const {
  currentAssetType,
  humanizedAssetType,
  handleAssetTypeChange,
  handleFilterChange,
} = useSearchFilter("lottie-animations");
const { searchQuery, performSearch } = useSearchQuery("lottie-animations");

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
      )} Animations - Free Download in GIF, MP4, Lottie JSON | IconScout`
  ),
});
</script>
