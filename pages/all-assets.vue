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
  humanizeAssetType,
  handleAssetTypeChange,
  handleFilterChange,
} = useSearchFilter("all-assets");
const { searchQuery, performSearch } = useSearchQuery("all-assets");

// Create a computed property for the humanized asset type
const humanizedAssetType = computed(() =>
  humanizeAssetType(currentAssetType.value)
);

const title = computed(() => `All Assets (${totalItems.value})`);
const subtitle = computed(
  () => `Browse our collection of ${humanizedAssetType.value}`
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
