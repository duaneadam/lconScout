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
        <!-- Content for displaying lottie animations will go here -->
        <div class="p-3 bg-light rounded">
          <p class="text-center text-muted">
            Lottie animations content will be displayed here
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const totalItems = ref(2180); // TODO: This would come from API response

const { currentAssetType, handleAssetTypeChange, handleFilterChange } =
  useSearchFilter("lottie-animations");
const { searchQuery, performSearch } = useSearchQuery("lottie-animations");
const { title, subtitle } = useSearchTitle(
  searchQuery,
  totalItems,
  "Lottie Animations"
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
