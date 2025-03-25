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
const totalItems = ref(0);

const updateTotalItems = (total: number) => {
  totalItems.value = total;
};

const {
  currentAssetType,
  humanizedAssetType,
  handleAssetTypeChange,
  handleFilterChange,
} = useSearchFilter("illustrations");
const { searchQuery, performSearch } = useSearchQuery("illustrations");

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
      )} Illustrations - Free Download in SVG, PNG, EPS | IconScout`
  ),
});
</script>
