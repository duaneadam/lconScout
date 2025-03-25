<template>
  <div class="search-results position-relative px-3">
    <div v-if="loading && !loadingMore">
      <div
        :class="[
          'row',
          props.assetType === 'icons'
            ? 'row-cols-2 row-cols-md-4 row-cols-lg-8 row-cols-xl-10'
            : 'row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5',
          'g-3b',
        ]"
      >
        <div v-for="n in perPage" :key="n" class="col">
          <SearchCard skeleton :variant="props.cardVariant || 'default'" />
        </div>
      </div>
    </div>

    <div v-else-if="error && assets.length === 0" class="text-center p-5">
      <p class="text-danger">{{ error }}</p>
      <BButton variant="primary" @click="fetchAssets(true)">Try Again</BButton>
    </div>

    <div v-else>
      <div v-if="assets.length === 0" class="text-center p-5">
        <p>No results found. Try a different search term.</p>
      </div>

      <div
        v-else
        :class="[
          'row',
          props.assetType === 'icons'
            ? 'row-cols-2 row-cols-md-4 row-cols-lg-8 row-cols-xl-10'
            : 'row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5',
          'g-3b',
        ]"
      >
        <div v-for="asset in assets" :key="asset.id" class="col">
          <SearchCard
            :asset="asset"
            :variant="props.cardVariant || 'default'"
          />
        </div>
      </div>

      <div v-if="loadingMore" class="text-center my-4">
        <b-spinner small label="Loading..."></b-spinner>
        <p class="mt-2">Loading more results...</p>
      </div>

      <div v-if="error && assets.length > 0" class="text-center my-4">
        <p class="text-danger">{{ error }}</p>
        <b-button variant="outline-primary" size="sm" @click="loadNextPage">
          Try Loading More
        </b-button>
      </div>

      <div ref="loadMoreTrigger" class="my-4 py-2"></div>

      <div v-if="!hasMorePages && assets.length > 0" class="text-center my-4">
        <Upsell v-if="!isUserLoggedIn && assets.length >= perPage * 2" />
        <p v-else-if="!isUserLoggedIn && currentPage >= 2" class="text-muted">
          Loading page 2...
        </p>
        <p v-else class="text-muted">End of results</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from "vue";
import type { Ref } from "vue";

// Types for the API response
type Asset = {
  id: number;
  uuid: string;
  asset: string;
  name: string;
  slug: string;
  identifier: string;
  price: number;
  urls: {
    thumb?: string;
    png_64?: string;
    png_128?: string;
    png_256?: string;
    preview_image?: string;
    original?: string;
    png?: string;
    lottie?: string;
    json?: string;
  };
  color_codes: Array<{
    decimal_color: number;
    color_id: number;
  }>;
  is_premium: boolean;
  payable_price: number;
  formats: Array<{
    id: number;
    name: string;
    mime_type: string;
  }>;
  additional_informations?: {
    stroked?: boolean;
    background_type?: string;
    iconscout_exclusive?: boolean;
    nsfw?: boolean;
    gltf_info?: {
      is_verified: boolean;
      has_glass_effect: boolean;
      has_material_issue: boolean;
    };
    preview_frame?: number;
    frame_rate?: number;
    total_frames?: number;
    is_canva_supported?: boolean;
    is_thorvg_supported?: boolean;
    is_creator_supported?: boolean;
    version?: string;
    generator?: string;
    no_of_layers?: number;
  };
  contributor?: {
    id: number;
    name: string;
    username: string;
    urls: {
      small: string;
      normal: string;
      large: string;
    };
  };
};

type APIResponse = {
  status: string;
  response: {
    items: {
      current_page: number;
      data: Asset[];
      total: number;
      per_page: number;
      last_page: number;
    };
  };
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
const loadingMore = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const perPage = computed(() => (props.assetType === "icons" ? 60 : 30));
const totalItems = ref(0);
const loadMoreTrigger = ref<HTMLElement | null>(null);
const isUserLoggedIn = ref(false);

// Compute if there are more pages
const hasMorePages = computed(() => {
  if (!isUserLoggedIn.value && currentPage.value >= 2) {
    return false;
  }
  return assets.value.length < totalItems.value;
});

// Emits
const emit = defineEmits(["total-updated"]);

// Intersection Observer
let observer: IntersectionObserver | null = null;

// Watch for changes in search query or asset type
watch(
  [() => props.searchQuery, () => props.assetType],
  async (newValues, oldValues) => {
    const [newQuery, newAssetType] = newValues;
    const [oldQuery, oldAssetType] = oldValues;

    if (oldQuery === undefined && oldAssetType === undefined) {
      return;
    }

    currentPage.value = 1;
    assets.value = [];
    await nextTick();
    await fetchAssets(true);
  }
);

// Fetch assets from the API
const fetchAssets = async (isNewSearch = false) => {
  if (isNewSearch) {
    loading.value = true;
    loadingMore.value = false;
  } else {
    loadingMore.value = true;
  }

  error.value = null;

  try {
    let apiUrl = `/api/search?assetType=${props.assetType}&perPage=${perPage.value}&page=${currentPage.value}&sort=relevant`;

    // Add price=free parameter for Lottie assets
    if (props.assetType === "lottie") {
      apiUrl += "&price=free";
    }

    if (props.searchQuery && props.searchQuery.trim() !== "") {
      apiUrl += `&query=${encodeURIComponent(props.searchQuery.trim())}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as APIResponse;

    if (data.status === "success" && data.response?.items) {
      if (isNewSearch) {
        assets.value = data.response.items.data;
      } else {
        assets.value = [...assets.value, ...data.response.items.data];
      }

      totalItems.value = data.response.items.total;
      emit("total-updated", totalItems.value);
    } else {
      throw new Error("Invalid API response format");
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : "An unknown error occurred";
    if (isNewSearch) {
      assets.value = [];
    }
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// Load next page of results
const loadNextPage = async () => {
  if (loadingMore.value || !hasMorePages.value) return;
  currentPage.value++;
  await fetchAssets();
};

// Setup and cleanup
onMounted(async () => {
  await fetchAssets(true);
  nextTick(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          loadNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreTrigger.value) {
      observer.observe(loadMoreTrigger.value);
    }
  });
});

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value);
    observer.disconnect();
  }
});
</script>

<style scoped>
/* Optional: Make the load more trigger invisible but take up space */
.load-more-trigger {
  height: 10px;
  opacity: 0;
}
</style>
