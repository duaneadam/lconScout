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
      <div>
        <AssetTabs @asset-type-changed="handleAssetTypeChange" />
        <div class="p-3 rounded">
          <SearchResults
            :asset-type="currentAssetType"
            :search-query="searchQuery"
            @total-updated="updateTotalItems"
            card-variant="square"
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

const { currentAssetType, handleAssetTypeChange, handleFilterChange } =
  useSearchFilter("icons");
const { searchQuery, performSearch } = useSearchQuery("icons");
const { title, subtitle } = useSearchTitle(searchQuery, totalItems, "Icons");

useHead({
  title: computed(
    () =>
      `${formatNumber(totalItems.value)} ${capitalizeWords(
        searchQuery.value
      )} Icons, Logos, Symbols - Free Download in SVG, PNG, ICO | IconScout`
  ),
});
</script>
