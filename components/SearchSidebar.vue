<template>
  <div class="search-sidebar">
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

    <div class="p-3 border-bottom">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span>IconScout Exclusive</span>
        <b-form-checkbox v-model="filters.isExclusive" switch></b-form-checkbox>
      </div>
    </div>

    <div class="p-3 border-bottom">
      <div
        class="d-flex justify-content-between align-items-center mb-3"
        @click="toggleSection('asset')"
      >
        <span class="fw-bold">Asset</span>
        <b-icon
          :icon="expandedSections.asset ? 'chevron-up' : 'chevron-down'"
        ></b-icon>
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
        <b-icon
          :icon="expandedSections.price ? 'chevron-up' : 'chevron-down'"
        ></b-icon>
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
        <b-icon
          :icon="expandedSections.view ? 'chevron-up' : 'chevron-down'"
        ></b-icon>
      </div>
      <div v-if="expandedSections.view">
        <b-form-radio-group v-model="filters.productType" stacked>
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
        <b-icon
          :icon="expandedSections.sortBy ? 'chevron-up' : 'chevron-down'"
        ></b-icon>
      </div>
      <div v-if="expandedSections.sortBy">
        <b-form-radio-group v-model="filters.sortBy" stacked>
          <b-form-radio value="popular">Popular</b-form-radio>
          <b-form-radio value="latest">Latest</b-form-radio>
          <b-form-radio value="featured">Featured</b-form-radio>
        </b-form-radio-group>
      </div>
    </div>

    <div class="p-3 border-bottom">
      <div
        class="d-flex justify-content-between align-items-center mb-3"
        @click="toggleSection('categories')"
      >
        <span class="fw-bold">Categories</span>
        <b-icon
          :icon="expandedSections.categories ? 'chevron-up' : 'chevron-down'"
        ></b-icon>
      </div>
      <div v-if="expandedSections.categories">
        <!-- Categories content would go here -->
        <p class="text-muted">Categories will be populated dynamically</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

// Get the current route to determine initial asset type
const route = useRoute();
const router = useRouter();

// Determine initial asset type based on the current route
const getInitialAssetType = (): string => {
  const path = route.path;
  if (path.includes("/icons")) return "icons";
  if (path.includes("/illustrations")) return "illustrations";
  if (path.includes("/3d-illustrations")) return "3d-illustrations";
  if (path.includes("/lottie-animations")) return "lottie-animations";
  if (path.includes("/all-assets")) return "all-assets";
  return "all-assets";
};

// Get initial price from URL query parameters
const getInitialPrice = (): string => {
  const priceParam = route.query.price as string;
  if (priceParam === "free" || priceParam === "premium") {
    return priceParam;
  }
  return "all";
};

// Get initial sort from URL query parameters
const getInitialSort = (): string => {
  const sortParam = route.query.sort as string;
  if (
    sortParam === "featured" ||
    sortParam === "latest" ||
    sortParam === "popular"
  ) {
    return sortParam;
  }
  return "featured";
};

// Get initial product type from URL query parameters
const getInitialProductType = (): string => {
  const productTypeParam = route.query.product_type as string;
  if (productTypeParam === "pack") {
    return productTypeParam;
  }
  return "item"; // Default is 'item'
};

// Define the filter state with the initial asset type, price, sort, and product type
const filters = reactive({
  isExclusive: false,
  assetType: getInitialAssetType(),
  price: getInitialPrice(),
  productType: getInitialProductType(),
  sortBy: getInitialSort(),
  categories: [] as string[],
});

// Track which sections are expanded
const expandedSections = reactive({
  asset: true,
  price: true,
  view: true,
  sortBy: true,
  categories: false,
});

// Toggle section visibility
const toggleSection = (section: keyof typeof expandedSections) => {
  expandedSections[section] = !expandedSections[section];
};

// Reset all filters to default values
const resetFilters = () => {
  filters.isExclusive = false;
  filters.assetType = "all-assets";
  filters.price = "all";
  filters.productType = "item";
  filters.sortBy = "popular";
  filters.categories = [];
};

// Define filter interface
interface FilterOptions {
  isExclusive: boolean;
  assetType: string;
  price: string;
  productType: string;
  sortBy: string;
  categories: string[];
}

// Emit filter changes to parent components
const emit = defineEmits<{
  (e: "filter-changed", filters: FilterOptions): void;
}>();

// Define props to receive asset type changes from AssetTabs
const props = defineProps<{
  externalAssetType?: string;
}>();

// Watch for external asset type changes from AssetTabs
watch(
  () => props.externalAssetType,
  (newAssetType) => {
    if (newAssetType && newAssetType !== filters.assetType) {
      filters.assetType = newAssetType;
    }
  },
  { immediate: true }
);

// Helper function to build query string from filters
const buildQueryString = () => {
  const queryParams = new URLSearchParams();

  // Add price parameter if not 'all'
  if (filters.price !== "all") {
    queryParams.append("price", filters.price);
  }

  // Add sort parameter if not empty
  if (filters.sortBy) {
    queryParams.append("sort", filters.sortBy);
  }

  // Always include product_type parameter when selected manually
  if (filters.productType) {
    queryParams.append("product_type", filters.productType);
  }

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Watch for changes in asset type to navigate
watch(
  () => filters.assetType,
  (newAssetType) => {
    // Only navigate if the asset type has changed and doesn't match the current route
    const currentPath = route.path;
    const basePath = `/${newAssetType}`;
    const searchParam = route.params.query ? `/${route.params.query}` : "";

    // Build query string with all active filters
    const queryString = buildQueryString();
    const targetPath = basePath + searchParam + queryString;

    // Check if we need to navigate (avoid unnecessary navigation)
    if (!currentPath.startsWith(basePath)) {
      router.push(targetPath);
    }
  }
);

// Watch for changes in price to update the URL
watch(
  () => filters.price,
  () => {
    // Get the path without query params
    const currentPath = route.path.split("?")[0];

    // Build query string with all active filters
    const queryString = buildQueryString();
    const targetPath = currentPath + queryString;

    // Update the URL with the new parameters
    router.replace(targetPath);
  }
);

// Watch for changes in sort to update the URL
watch(
  () => filters.sortBy,
  () => {
    // Get the path without query params
    const currentPath = route.path.split("?")[0];

    // Build query string with all active filters
    const queryString = buildQueryString();
    const targetPath = currentPath + queryString;

    // Update the URL with the new parameters
    router.replace(targetPath);
  }
);

// Watch for changes in product type to update the URL
watch(
  () => filters.productType,
  () => {
    // Get the path without query params
    const currentPath = route.path.split("?")[0];

    // Build query string with all active filters
    const queryString = buildQueryString();
    const targetPath = currentPath + queryString;

    // Update the URL with the new parameters
    router.replace(targetPath);
  }
);

// Watch for changes and emit events
watch(
  filters,
  (newFilters) => {
    emit("filter-changed", newFilters);
  },
  { deep: true }
);
</script>

<style scoped>
.search-sidebar {
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  width: 260px;
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
</style>
