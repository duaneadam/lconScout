// SearchLayout.vue
<template>
  <div class="w-100">
    <SearchHeader :title="searchTitle" :subtitle="searchSubtitle" />

    <div class="d-flex">
      <div class="sidebar-container" style="width: 280px">
        <SearchSidebar />
      </div>
      <div class="flex-grow-1">
        <AssetTabs />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { searchTitle, searchSubtitle } = storeToRefs(useSearchStore());

useUrlFilters();
</script>
