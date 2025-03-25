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
import { capitalizeWords } from "~/utils/string";

const totalItems = ref(0);

const updateTotalItems = (total: number) => {
  totalItems.value = total;
};

const {
  currentAssetType,
  humanizeAssetType,
  handleAssetTypeChange,
  handleFilterChange,
} = useSearchFilter("3d-illustrations");
const { searchQuery, performSearch } = useSearchQuery("3d-illustrations");

// Create a computed property for the humanized asset type
const humanizedAssetType = computed(() =>
  humanizeAssetType(currentAssetType.value)
);

const title = computed(() => `3D Illustrations (${totalItems.value})`);
const subtitle = computed(
  () => `Browse our collection of ${humanizedAssetType.value}`
);

useHead({
  title: computed(
    () =>
      `${formatNumber(totalItems.value)} ${capitalizeWords(
        searchQuery.value
      )} 3D Illustrations - Free Download in PNG, BLEND, glTF | IconScout`
  ),
});
</script>
