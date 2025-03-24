<template>
  <div class="search-results">
    <div v-if="loading" class="text-center p-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
      <p class="mt-2">Loading results...</p>
    </div>

    <div v-else-if="error" class="text-center p-5">
      <p class="text-danger">{{ error }}</p>
      <b-button variant="outline-primary" @click="fetchAssets"
        >Try Again</b-button
      >
    </div>

    <div v-else>
      <div v-if="assets.length === 0" class="text-center p-5">
        <p>No results found. Try a different search term.</p>
      </div>

      <div
        v-else
        class="row row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5 g-3b"
      >
        <div v-for="asset in assets" :key="asset.id" class="col">
          <SearchCard :icon="asset" :variant="props.cardVariant || 'default'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { Ref } from "vue";

// Types for the API response
type Asset = {
  id: number;
  uuid: string;
  asset: string;
  name: string;
  slug: string;
  price: number;
  urls: {
    png_64: string;
    png_128: string;
    png_256: string;
  };
  color_codes: Array<{
    decimal_color: number;
    color_id: number;
  }>;
};

// Props
const props = defineProps<{
  assetType: string;
  searchQuery: string;
  cardVariant?: "default" | "square";
}>();

// Component state
const assets: Ref<Asset[]> = ref([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const perPage = ref(30);
const totalItems = ref(0);

// Emits
const emit = defineEmits(["total-updated"]);

// Watch for changes in props or current page
watch(
  [() => props.searchQuery, () => props.assetType, currentPage],
  async (newValues, oldValues) => {
    const [newQuery, newAssetType] = newValues;
    const [oldQuery, oldAssetType] = oldValues;

    // Skip the initial fetch if asset type is changing
    if (oldAssetType && newAssetType !== oldAssetType) {
      return; // Let the route change handle the fetch
    }

    // Wait for next tick to ensure component is ready
    await nextTick();
    await fetchAssets();
  },
  { immediate: true }
);

// Fetch assets from the API using our server endpoint
const fetchAssets = async () => {
  loading.value = true;
  error.value = null;

  try {
    // More explicit query handling to prevent using asset type as fallback inappropriately
    // Only pass query parameter if it's not empty, let server handle fallback logic
    let apiUrl = `/api/search?assetType=${props.assetType}&perPage=${perPage.value}&page=${currentPage.value}&sort=relevant`;

    if (props.searchQuery && props.searchQuery.trim() !== "") {
      apiUrl += `&query=${encodeURIComponent(props.searchQuery.trim())}`;
      console.log("Using search query:", props.searchQuery);
    } else {
      console.log("No search query provided");
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success" && data.response && data.response.items) {
      assets.value = data.response.items.data;
      totalItems.value = data.response.items.total;

      // Emit the total items count to update the title
      emit("total-updated", totalItems.value);
    } else if (data.status === "error") {
      throw new Error(data.message || "API returned an error");
    } else {
      throw new Error("Invalid API response format");
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "An unknown error occurred";
    assets.value = [];
  } finally {
    loading.value = false;
  }
};

// Handle page change
const handlePageChange = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Fetch assets on component mount
onMounted(() => {
  fetchAssets();
});
</script>
