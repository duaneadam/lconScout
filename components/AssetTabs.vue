// AssetTabs.vue
<template>
  <div class="asset-tabs">
    <b-nav tabs class="border-bottom mb-4">
      <!-- Use :to for navigation, router/store watcher handles state update -->
      <b-nav-item
        :to="getTabPath('all-assets')"
        :active="filters.assetType === 'all-assets'"
      >
        All Assets
      </b-nav-item>
      <b-nav-item
        :to="getTabPath('3d-illustrations')"
        :active="filters.assetType === '3d-illustrations'"
      >
        3D Illustrations
      </b-nav-item>
      <b-nav-item
        :to="getTabPath('lottie-animations')"
        :active="filters.assetType === 'lottie-animations'"
      >
        Lottie Animations
      </b-nav-item>
      <b-nav-item
        :to="getTabPath('illustrations')"
        :active="filters.assetType === 'illustrations'"
      >
        Illustrations
      </b-nav-item>
      <b-nav-item
        :to="getTabPath('icons')"
        :active="filters.assetType === 'icons'"
      >
        Icons
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "~/stores/search";

const { filters, query } = storeToRefs(useSearchStore());

// Gnerate the correct path for each tab wjile preserving the query
function getTabPath(assetType: string): string {
  return `/${assetType}${
    query.value ? `/${encodeURIComponent(query.value)}` : ""
  }`;
}
</script>

<style scoped>
.asset-tabs {
  width: 100%;
}
</style>
