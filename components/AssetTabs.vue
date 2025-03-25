<template>
  <div class="asset-tabs">
    <b-nav tabs class="border-bottom mb-4">
      <b-nav-item
        :to="'/all-assets' + (searchQuery ? `/${searchQuery}` : '')"
        :active="filters.assetType === 'all-assets'"
        @click="handleNavClick('all-assets')"
      >
        All Assets
      </b-nav-item>
      <b-nav-item
        :to="'/3d-illustrations' + (searchQuery ? `/${searchQuery}` : '')"
        :active="filters.assetType === '3d-illustrations'"
        @click="handleNavClick('3d-illustrations')"
      >
        3D Illustrations
      </b-nav-item>
      <b-nav-item
        :to="'/lottie-animations' + (searchQuery ? `/${searchQuery}` : '')"
        :active="filters.assetType === 'lottie-animations'"
        @click="handleNavClick('lottie-animations')"
      >
        Lottie Animations
      </b-nav-item>
      <b-nav-item
        :to="'/illustrations' + (searchQuery ? `/${searchQuery}` : '')"
        :active="filters.assetType === 'illustrations'"
        @click="handleNavClick('illustrations')"
      >
        Illustrations
      </b-nav-item>
      <b-nav-item
        :to="'/icons' + (searchQuery ? `/${searchQuery}` : '')"
        :active="filters.assetType === 'icons'"
        @click="handleNavClick('icons')"
      >
        Icons
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { filters } = storeToRefs(useSearchStore());
const { fetchResults, updateAssetType } = useSearchStore();

const searchQuery = computed(() => {
  if (route.params.query) {
    return route.params.query as string;
  }
  return "";
});

function handleNavClick(assetType: string) {
  updateAssetType(assetType);
  fetchResults(assetType);
}
</script>

<style scoped>
.asset-tabs {
  width: 100%;
}
</style>
