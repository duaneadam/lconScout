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
} = useSearchFilter("all-assets");
const { searchQuery, performSearch } = useSearchQuery("all-assets");

const { title, subtitle } = useSearchTitle(
  searchQuery,
  totalItems,
  humanizedAssetType
);

/**
 * Only all assets does not have totalItems as seen on IconScout website
 */
useHead({
  title: computed(
    () =>
      `${capitalizeWords(
        searchQuery.value
      )} Design Assets - Free Download in SVG, PNG, BLEND, GIF | IconScout`
  ),
});
</script>
