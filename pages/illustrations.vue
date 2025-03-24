<template>
  <div>
    <SearchHeader :title="title" :subtitle="subtitle" />

    <div class="d-flex">
      <aside class="sidebar-container me-4" style="width: 280px">
        <SearchSidebar
          :external-asset-type="currentAssetType"
          @filter-changed="handleFilterChange"
        />
      </aside>
      <div>
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
const totalItems = ref();

const updateTotalItems = (total: number) => {
  totalItems.value = total;
};

const { currentAssetType, handleAssetTypeChange, handleFilterChange } =
  useSearchFilter("illustrations");
const { searchQuery, performSearch } = useSearchQuery("illustrations");
const { title, subtitle } = useSearchTitle(
  searchQuery,
  totalItems,
  "Illustrations"
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
