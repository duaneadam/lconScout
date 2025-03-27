<template>
  <div class="search-sidebar d-none d-md-block">
    <div
      class="d-flex justify-content-between align-items-center p-3 border-bottom"
    >
      <div class="d-flex align-items-center">
        <b-icon icon="funnel" class="me-2"></b-icon>
        <span class="fw-bold">Filters</span>
      </div>
      <b-button variant="link" class="p-0" @click="resetFilters">
        <b-icon icon="x-lg"></b-icon>
      </b-button>
    </div>

    <!-- Exclusive Filter -->
    <div class="p-3 border-bottom">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <span>IconScout Exclusive</span>
          <small v-if="localFilters.exclusive" class="d-block text-muted">
            Showing {{ exclusiveItemsCount }} exclusive items
          </small>
        </div>
        <!-- Use local ref for immediate UI update, watcher updates store -->
        <b-form-checkbox
          v-model="localFilters.exclusive"
          switch
        ></b-form-checkbox>
      </div>
    </div>

    <!-- Asset Filter -->
    <div class="p-3 border-bottom">
      <div
        class="d-flex justify-content-between align-items-center mb-3"
        @click="toggleSection('asset')"
      >
        <span class="fw-bold">Asset</span>
        <client-only>
          <unicon
            :name="expandedSections.asset ? 'angle-up' : 'angle-down'"
          ></unicon>
        </client-only>
      </div>
      <b-collapse v-model="expandedSections.asset">
        <!-- Use local ref for immediate UI update, watcher updates store -->
        <b-form-radio-group v-model="localFilters.assetType" stacked>
          <b-form-radio value="all-assets">All assets</b-form-radio>
          <b-form-radio value="3d-illustrations">3D Illustrations</b-form-radio>
          <b-form-radio value="lottie-animations"
            >Lottie Animations</b-form-radio
          >
          <b-form-radio value="illustrations">Illustrations</b-form-radio>
          <b-form-radio value="icons">Icons</b-form-radio>
        </b-form-radio-group>
      </b-collapse>
    </div>

    <!-- Price Filter -->
    <div class="p-3 border-bottom">
      <div
        class="d-flex justify-content-between align-items-center mb-3"
        @click="toggleSection('price')"
      >
        <span class="fw-bold">Price</span>
        <client-only>
          <unicon
            :name="expandedSections.price ? 'angle-up' : 'angle-down'"
          ></unicon>
        </client-only>
      </div>
      <b-collapse v-model="expandedSections.price">
        <!-- Use local ref for immediate UI update, watcher updates store -->
        <b-form-radio-group v-model="localFilters.price" stacked>
          <b-form-radio value="free">Free</b-form-radio>
          <b-form-radio value="premium">Premium</b-form-radio>
          <b-form-radio value="all">All</b-form-radio>
        </b-form-radio-group>
      </b-collapse>
    </div>

    <div class="p-3 border-bottom">
      <div
        class="d-flex justify-content-between align-items-center mb-3"
        @click="toggleSection('view')"
      >
        <span class="fw-bold">View</span>
        <client-only>
          <unicon
            :name="expandedSections.view ? 'angle-up' : 'angle-down'"
          ></unicon>
        </client-only>
      </div>
      <b-collapse v-model="expandedSections.view">
        <!-- Use local ref for immediate UI update, watcher updates store -->
        <b-form-radio-group v-model="localFilters.view" stacked>
          <b-form-radio value="pack">Pack</b-form-radio>
          <b-form-radio value="item">Individual</b-form-radio>
        </b-form-radio-group>
      </b-collapse>
    </div>

    <!-- Sort By Filter -->
    <div class="p-3 border-bottom">
      <div
        class="d-flex justify-content-between align-items-center mb-3"
        @click="toggleSection('sortBy')"
      >
        <span class="fw-bold">Sort by</span>
        <client-only>
          <unicon
            :name="expandedSections.sortBy ? 'angle-up' : 'angle-down'"
          ></unicon>
        </client-only>
      </div>
      <b-collapse v-model="expandedSections.sortBy">
        <!-- Use local ref for immediate UI update, watcher updates store -->
        <b-form-radio-group v-model="localFilters.sortBy" stacked>
          <b-form-radio value="popular">Popular</b-form-radio>
          <b-form-radio value="latest">Latest</b-form-radio>
          <b-form-radio value="featured">Featured</b-form-radio>
        </b-form-radio-group>
      </b-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use reactive local state mirroring store filters for responsive UI binding
// Initialize with store values
const searchStore = useSearchStore();
const { filters: storeFilters, exclusiveItemsCount } = storeToRefs(searchStore);

// Use reactive for local copy to ensure watchers trigger correctly
const localFilters = reactive<SearchFilters>({ ...storeFilters.value });

// Watch for changes coming FROM the store (e.g., route change, reste)
watch(
  storeFilters,
  (newStoreFilters) => {
    // Update local state only if different to prevent infinite loops
    // This has resulted multiple API calls when filters changes
    Object.assign(localFilters, newStoreFilters);
  },
  { deep: true }
);

// Watch for changes made locally IN the sidebar
watch(
  localFilters,
  (newLocalFilters) => {
    // Update the store which triggers fetches and route updates
    searchStore.updateFilters({ ...newLocalFilters });
  },
  { deep: true }
);

const expandedSections = ref({
  asset: true,
  price: true,
  view: true,
  sortBy: true,
});

function resetFilters() {
  searchStore.resetFilters();
}

function toggleSection(section: keyof typeof expandedSections.value) {
  expandedSections.value[section] = !expandedSections.value[section];
}
</script>

<style scoped>
.search-sidebar {
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  width: 260px;
  margin-left: 10px;
  position: relative;
  max-height: calc(100vh - 60px - 20px - 20px);
  overflow-y: auto;
}

.border-bottom {
  border-bottom: 1px solid #dee2e6;
}

[role="radiogroup"] {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fw-bold {
  font-weight: 500;
}

[class*="justify-content-between"][class*="mb-3"] {
  cursor: pointer;
}

.text-muted {
  color: #6c757d !important;
  font-size: 0.75rem;
}
</style>
