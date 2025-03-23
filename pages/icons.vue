<template>
  <div>
    <SearchHeader :title="title" :subtitle="subtitle" />
    <AssetTabs @asset-type-changed="handleAssetTypeChange" />

    <div class="d-flex mt-4">
      <div class="sidebar-container me-4" style="width: 280px">
        <SearchSidebar
          :external-asset-type="currentAssetType"
          @filter-changed="handleFilterChange"
        />
      </div>
      <div class="flex-grow-1">
        <!-- Content for displaying icons will go here -->
        <div class="p-3 bg-light rounded">
          <p class="text-center text-muted">
            Icons content will be displayed here
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const totalItems = ref(120248); // TODO: This would come from API response

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
