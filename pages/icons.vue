<template>
  <SearchLayout
    :title="title"
    :subtitle="subtitle"
    :current-asset-type="currentAssetType"
    :search-query="searchQuery"
    card-variant="square"
    @update:total-items="updateTotalItems"
    @asset-type-changed="handleAssetTypeChange"
    @filter-changed="handleFilterChange"
  />
</template>

<script setup lang="ts">
const totalItems = ref(0);

const updateTotalItems = (total: number) => {
  totalItems.value = total;
};

const {
  currentAssetType,
  handleAssetTypeChange,
  handleFilterChange,
  humanizedAssetType,
} = useSearchFilter("icons");
const { searchQuery, performSearch } = useSearchQuery("icons");

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
      )} Icons, Logos, Symbols - Free Download in SVG, PNG, ICO | IconScout`
  ),
});
</script>
