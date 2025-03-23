<template>
  <div>
    <SearchHeader :title="title" :subtitle="subtitle" />
    <AssetTabs @asset-type-changed="handleAssetTypeChange" />

    <div class="d-flex mt-4">
      <aside class="sidebar-container me-4" style="width: 280px">
        <SearchSidebar
          :external-asset-type="currentAssetType"
          @filter-changed="handleFilterChange"
        />
      </aside>
      <div class="flex-grow-1">
        <!-- Content for displaying 3D illustrations will go here -->
        <div class="p-3 bg-light rounded">
          <p class="text-center text-muted">
            3D Illustrations content will be displayed here
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { capitalizeWords } from "~/utils/string";

const totalItems = ref(9698); // TODO: This would come from API response

const { currentAssetType, handleAssetTypeChange, handleFilterChange } =
  useSearchFilter("3d-illustrations");
const { searchQuery, performSearch } = useSearchQuery("3d-illustrations");
const { title, subtitle } = useSearchTitle(
  searchQuery,
  totalItems,
  "3D Illustrations"
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
