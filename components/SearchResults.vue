<script setup lang="ts">
const props = defineProps<{
  cardVariant?: "default" | "square";
}>();

const { playerType } = useLottieFeatureFlag();
const lottiePlayerType = computed(
  () => playerType.value as "dotlottie" | "lottiejson"
);

const searchStore = useSearchStore();
const {
  results,
  isLoading,
  isLoadingMore,
  error,
  hasMorePages,
  currentPage,
  perPage,
  filters,
} = storeToRefs(searchStore);
const { loadMoreResults, fetchResults } = searchStore;

const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const gridClass = computed(() => {
  return filters.value.assetType === "icons"
    ? "row-cols-2 row-cols-md-4 row-cols-lg-8 row-cols-xl-10"
    : "row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5";
});

const setupObserver = () => {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      const shouldLoadMore =
        entry?.isIntersecting &&
        !isLoadingMore.value &&
        hasMorePages.value &&
        results.value.length < perPage.value * 2 &&
        !filters.value.exclusive;

      if (shouldLoadMore) {
        loadMoreResults();
      }
    },
    { threshold: 0.5 }
  );

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
};

const retryFetch = () => {
  fetchResults(true);
};

watch(loadMoreTrigger, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    setupObserver();
  } else if (!newVal && observer) {
    observer.disconnect();
    observer = null;
  }
});

watch(
  () => results.value,
  () => {
    nextTick(() => {
      if (loadMoreTrigger.value) {
        setupObserver();
      }
    });
  },
  { deep: false }
);

watch(
  () => filters.value.exclusive,
  () => {
    if (loadMoreTrigger.value) {
      nextTick(setupObserver);
    }
  }
);

onMounted(() => {
  if (loadMoreTrigger.value) {
    setupObserver();
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<template>
  <div class="search-results position-relative px-10b">
    <!-- Loading state for initial load -->
    <div v-if="isLoading && currentPage === 1">
      <div :class="['row', gridClass, 'g-3b']">
        <div v-for="n in perPage" :key="`skel-${n}`" class="col">
          <SearchCard
            skeleton
            :variant="props.cardVariant || 'default'"
            :lottiePlayerType="lottiePlayerType"
          />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error && results.length === 0" class="text-center p-5">
      <p class="text-danger">{{ error }}</p>
      <BButton variant="primary" @click="retryFetch">Try Again</BButton>
    </div>

    <!-- Results display -->
    <div v-else>
      <!-- No results found -->
      <div v-if="results.length === 0 && !isLoading" class="text-center p-5">
        <p>No results found.</p>
      </div>

      <!-- Grid of results -->
      <div v-else :class="['row', gridClass, 'g-3b']">
        <div v-for="asset in results" :key="asset.uuid" class="col">
          <SearchCard
            :asset="asset"
            :variant="props.cardVariant || 'default'"
            :lottiePlayerType="lottiePlayerType"
          />
        </div>
      </div>

      <!-- Loading more indicator -->
      <div v-if="isLoadingMore && !filters.exclusive" class="text-center my-4">
        <b-spinner small label="Loading..."></b-spinner>
        <p class="mt-2">Loading more results...</p>
      </div>

      <!-- Error loading more -->
      <div v-if="error && results.length > 0" class="text-center my-4">
        <p class="text-danger">{{ error }}</p>
        <b-button
          v-if="!filters.exclusive"
          variant="outline-primary"
          size="sm"
          @click="loadMoreResults"
        >
          Try Loading More
        </b-button>
      </div>

      <!-- Intersection observer trigger -->
      <!-- TODO: Buggy when scroll to ofast -->
      <div
        v-show="!filters.exclusive"
        ref="loadMoreTrigger"
        class="my-4 py-2"
      ></div>

      <!-- Upsell component -->
      <div v-if="results.length >= perPage * 2" class="text-center my-4">
        <Upsell />
      </div>
    </div>
  </div>
</template>
