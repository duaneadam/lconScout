<template>
  <div>
    <SearchHeader :title="title" :subtitle="subtitle" />

    <div class="d-flex">
      <div class="sidebar-container me-4" style="width: 280px">
        <SearchSidebar
          :external-asset-type="currentAssetType"
          @filter-changed="handleFilterChange"
        />
      </div>
      <div class="flex-grow-1">
        <AssetTabs @asset-type-changed="handleAssetTypeChange" />
        <div class="p-3 rounded">
          <SearchResults
            :asset-type="currentAssetType"
            :search-query="searchQuery"
            @total-updated="updateTotalItems"
          />
        </div>
      </div>
    </div>
  </div>
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
