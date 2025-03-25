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
  humanizeAssetType,
  handleAssetTypeChange,
  handleFilterChange,
} = useSearchFilter("icons");
const { searchQuery, performSearch } = useSearchQuery("icons");

// Create a computed property for the humanized asset type
const humanizedAssetType = computed(() =>
  humanizeAssetType(currentAssetType.value)
);

const title = computed(() => `Icons (${totalItems.value})`);
const subtitle = computed(
  () => `Browse our collection of ${humanizedAssetType.value}`
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
