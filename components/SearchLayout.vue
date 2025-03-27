<template>
  <div class="w-100">
    <SearchHeader :title="searchTitle" :subtitle="searchSubtitle" />

    <div class="d-flex">
      <div class="sidebar-container" style="width: 280px">
        <SearchSidebar />
      </div>
      <div class="flex-grow-1">
        <AssetTabs />
        <SearchResults :card-variant="cardVariant" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "~/stores/search";

defineProps<{
  cardVariant?: "default" | "square";
}>();

const { searchTitle, searchSubtitle } = storeToRefs(useSearchStore());
</script>
