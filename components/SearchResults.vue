<template>
  <div class="search-results position-relative px-10b">
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
          <SearchCard
            skeleton
            :variant="props.cardVariant || 'default'"
            :lottiePlayerType="lottiePlayerType"
          />
        </div>
      </div>
    </div>

    <div
      v-else-if="error && assets.length === 0 && shouldShowError"
      class="text-center p-5"
    >
      <p class="text-danger">{{ error }}</p>
      <BButton variant="primary" @click="fetchAssets(true)">Try Again</BButton>
    </div>

    <div v-else>
      <div v-if="assets.length === 0" class="text-center p-5">
        <p>No results found.</p>
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
            :lottiePlayerType="lottiePlayerType"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const props = defineProps<{
  assetType: string;
  searchQuery: string;
  cardVariant?: "default" | "square";
}>();

const { playerType } = useLottieFeatureFlag();
const lottiePlayerType = computed(
  () => playerType.value as "dotlottie" | "lottiefiles"
);

const loading = ref(true);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const perPage = computed(() => (props.assetType === "icons" ? 60 : 30));
const loadMoreTrigger = ref<HTMLElement | null>(null);
const isUserLoggedIn = ref(false);
const shouldShowError = ref(false);

const { totalItems, results: assets, filters } = storeToRefs(useSearchStore());
const { fetchResults, updateQuery } = useSearchStore();

const hasMorePages = computed(() => {
  if (!isUserLoggedIn.value && currentPage.value >= 2) {
    return false;
  }
  return assets.value.length < totalItems.value;
});

let observer: IntersectionObserver | null = null;

const fetchAssets = async (isNewSearch = false) => {
  if (isNewSearch) {
    loading.value = true;
    loadingMore.value = false;
  } else {
    loadingMore.value = true;
  }

  error.value = null;

  if (!props.searchQuery || props.searchQuery.trim() === "") {
    loading.value = false;
    loadingMore.value = false;
    return;
  }

  try {
    updateQuery(props.searchQuery);

    await fetchResults(props.assetType, {
      perPage: perPage.value,
      page: currentPage.value,
      sort: "relevant",
    });

    shouldShowError.value = true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "An unknown error occurred";
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadNextPage = async () => {
  if (loadingMore.value || !hasMorePages.value) return;
  currentPage.value++;
  await fetchAssets();
};

const setupObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

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
};

watch(
  [() => props.searchQuery, () => props.assetType],
  ([newQuery, newAssetType], [oldQuery, oldAssetType]) => {
    if (newQuery !== oldQuery || newAssetType !== oldAssetType) {
      currentPage.value = 1;
      shouldShowError.value = !!newQuery;

      if (newQuery && newQuery.trim() !== "") {
        fetchAssets(true).then(() => {
          nextTick(() => {
            setupObserver();
          });
        });
      } else {
        loading.value = false;
      }
    }
  },
  { immediate: true }
);

watch(loadMoreTrigger, (newVal) => {
  if (newVal) {
    setupObserver();
  }
});

onMounted(async () => {
  if (props.searchQuery && props.searchQuery.trim() !== "") {
    await fetchAssets(true);
  } else {
    loading.value = false;
  }

  nextTick(() => {
    setupObserver();
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>
