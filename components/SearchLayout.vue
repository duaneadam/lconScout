<template>
  <div class="w-100">
    <SearchHeader :title="title" :subtitle="subtitle" />

    <div class="d-flex">
      <div class="sidebar-container" style="width: 280px">
        <SearchSidebar
          :external-asset-type="currentAssetType"
          @filter-changed="handleFilterChange"
        />
      </div>
      <div class="flex-grow-1">
        <AssetTabs @asset-type-changed="handleAssetTypeChange" />
        <SearchResults
          :asset-type="currentAssetType"
          :search-query="searchQuery"
          :card-variant="cardVariant"
          @total-updated="updateTotalItems"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  currentAssetType: string;
  searchQuery: string;
  cardVariant?: "default" | "square";
}>();

const emit = defineEmits<{
  (e: "update:totalItems", total: number): void;
  (e: "assetTypeChanged", assetType: string): void;
  (e: "filterChanged", filter: any): void;
}>();

const updateTotalItems = (total: number) => {
  emit("update:totalItems", total);
};

const handleAssetTypeChange = (assetType: string) => {
  emit("assetTypeChanged", assetType);
};

const handleFilterChange = (filter: any) => {
  emit("filterChanged", filter);
};
</script>
