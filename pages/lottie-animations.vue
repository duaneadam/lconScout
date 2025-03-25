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
} = useSearchFilter("lottie-animations");
const { searchQuery, performSearch } = useSearchQuery("lottie-animations");

// Create a computed property for the humanized asset type
const humanizedAssetType = computed(() =>
  humanizeAssetType(currentAssetType.value)
);

const title = computed(() => `Lottie Animations (${totalItems.value})`);
const subtitle = computed(
  () => `Browse our collection of ${humanizedAssetType.value}`
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
