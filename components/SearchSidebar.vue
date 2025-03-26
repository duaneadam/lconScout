<template>
  <div class="search-sidebar">
    <div
      class="d-flex justify-content-between align-items-center p-3 border-bottom"
    >
      <div class="d-flex align-items-center">
        <b-icon icon="funnel" class="me-2"></b-icon>
        <span class="fw-bold">Filters</span>
      </div>
      <b-button
        variant="link"
        class="p-0"
        @click="resetFilters"
        :disabled="isLoading"
      >
        <b-icon icon="x-lg"></b-icon>
      </b-button>
    </div>

    <div class="p-3 border-bottom">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <span>IconScout Exclusive</span>
          <small v-if="filters.exclusive" class="d-block text-muted">
            Showing {{ totalItems }} exclusive items
          </small>
        </div>
        <b-form-checkbox v-model="filters.exclusive" switch></b-form-checkbox>
      </div>
    </div>

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
      <div v-if="expandedSections.asset">
        <b-form-radio-group v-model="filters.assetType" stacked>
          <b-form-radio value="all-assets">All assets</b-form-radio>
          <b-form-radio value="3d-illustrations">3D Illustrations</b-form-radio>
          <b-form-radio value="lottie-animations"
            >Lottie Animations</b-form-radio
          >
          <b-form-radio value="illustrations">Illustrations</b-form-radio>
          <b-form-radio value="icons">Icons</b-form-radio>
        </b-form-radio-group>
      </div>
    </div>

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
      <div v-if="expandedSections.price">
        <b-form-radio-group v-model="filters.price" stacked>
          <b-form-radio value="free">Free</b-form-radio>
          <b-form-radio value="premium">Premium</b-form-radio>
          <b-form-radio value="all">All</b-form-radio>
        </b-form-radio-group>
      </div>
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
      <div v-if="expandedSections.view">
        <b-form-radio-group v-model="filters.view" stacked>
          <b-form-radio value="pack">Pack</b-form-radio>
          <b-form-radio value="item">Individual</b-form-radio>
        </b-form-radio-group>
      </div>
    </div>

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
      <div v-if="expandedSections.sortBy">
        <b-form-radio-group v-model="filters.sortBy" stacked>
          <b-form-radio value="popular">Popular</b-form-radio>
          <b-form-radio value="latest">Latest</b-form-radio>
          <b-form-radio value="featured">Featured</b-form-radio>
          <b-form-radio value="relevant">Relevant</b-form-radio>
        </b-form-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSearchStore } from "~/stores/search";

const expandedSections = ref({
  asset: true,
  price: true,
  view: true,
  sortBy: true,
});

const searchStore = useSearchStore();
const { filters, isLoading, totalItems } = storeToRefs(searchStore);

// Debounce timer for API calls
const debounceTimer = ref(null);

// Watch for non-exclusive filter changes that need API calls
watch(
  () => ({
    assetType: filters.value.assetType,
    price: filters.value.price,
    view: filters.value.view,
    sortBy: filters.value.sortBy,
  }),
  (newFilters) => {
    // Clear previous timer
    if (debounceTimer.value) clearTimeout(debounceTimer.value);

    // Set new timer
    debounceTimer.value = setTimeout(() => {
      searchStore.fetchResults(newFilters.assetType, {
        page: 1,
        perPage: newFilters.assetType === "icons" ? 60 : 30,
        sort: newFilters.sortBy || "relevant",
      });
    }, 300); // 300ms debounce
  },
  { deep: true }
);

// Don't need API calls for exclusive filter toggle (client-side filtering)
// But we might want to show a brief loading state for better UX
watch(
  () => filters.value.exclusive,
  () => {
    // For large result sets, briefly show loading state for better UX
    if (totalItems.value > 100) {
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
      }, 200);
    }
  }
);

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
  position: relative;
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

/* Make section headers clickable */
[class*="justify-content-between"] {
  cursor: pointer;
}

.text-muted {
  color: #6c757d !important;
  font-size: 0.75rem;
}
</style>
