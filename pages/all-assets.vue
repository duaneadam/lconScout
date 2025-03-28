<template>
  <SearchLayout>
    <div class="all-assets-container px-10b">
      <div v-if="!searchQuery" class="text-center p-5">
        <p>Please enter a search term to see assets.</p>
      </div>

      <template v-else>
        <AssetSection
          title="3D Illustrations"
          :results="results3d"
          :loading="loading3d"
          :error="error3d"
          :grid-class="defaultGridClass"
          :card-variant="'default'"
          :lottie-player-type="lottiePlayerType"
          @retry="fetchSpecificAsset('3d-illustrations')"
        />
        <AssetSection
          title="Lottie Animations"
          :results="resultsLottie"
          :loading="loadingLottie"
          :error="errorLottie"
          :grid-class="defaultGridClass"
          :card-variant="'default'"
          :lottie-player-type="lottiePlayerType"
          @retry="fetchSpecificAsset('lottie-animations')"
        />
        <AssetSection
          title="Illustrations"
          :results="resultsIllustrations"
          :loading="loadingIllustrations"
          :error="errorIllustrations"
          :grid-class="defaultGridClass"
          :card-variant="'default'"
          :lottie-player-type="lottiePlayerType"
          @retry="fetchSpecificAsset('illustrations')"
        />
        <AssetSection
          title="Icons"
          :results="resultsIcons"
          :loading="loadingIcons"
          :error="errorIcons"
          :grid-class="iconsGridClass"
          :card-variant="'square'"
          :lottie-player-type="lottiePlayerType"
          @retry="fetchSpecificAsset('icons')"
        />
      </template>
    </div>
  </SearchLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const searchStore = useSearchStore();
const { query: searchQuery } = storeToRefs(searchStore);
const { playerType } = useLottieFeatureFlag();
const lottiePlayerType = computed(() => playerType.value);

const results3d = ref([]);
const loading3d = ref(false);
const error3d = ref<string | null>(null);

const resultsLottie = ref([]);
const loadingLottie = ref(false);
const errorLottie = ref<string | null>(null);

const resultsIllustrations = ref([]);
const loadingIllustrations = ref(false);
const errorIllustrations = ref<string | null>(null);

const resultsIcons = ref([]);
const loadingIcons = ref(false);
const errorIcons = ref<string | null>(null);

const defaultGridClass = "row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5";
const iconsGridClass = "row-cols-2 row-cols-md-4 row-cols-lg-8 row-cols-xl-10";

// Fetching config
const assetConfigs = {
  "3d-illustrations": {
    perPage: 15,
    resultsRef: results3d,
    loadingRef: loading3d,
    errorRef: error3d,
  },
  "lottie-animations": {
    perPage: 15,
    resultsRef: resultsLottie,
    loadingRef: loadingLottie,
    errorRef: errorLottie,
  },
  illustrations: {
    perPage: 15,
    resultsRef: resultsIllustrations,
    loadingRef: loadingIllustrations,
    errorRef: errorIllustrations,
  },
  icons: {
    perPage: 30,
    resultsRef: resultsIcons,
    loadingRef: loadingIcons,
    errorRef: errorIcons,
  },
};

async function fetchSpecificAsset(assetType: keyof typeof assetConfigs) {
  const config = assetConfigs[assetType];
  if (!searchQuery.value || !config) return;

  config.loadingRef.value = true;
  config.errorRef.value = null;
  config.resultsRef.value = [];

  try {
    const response = await $fetch("/api/search", {
      params: {
        query: searchQuery.value.trim(),
        assetType: assetType,
        page: 1, // Always page 1, no infinite scroll here
        perPage: config.perPage,
        sort: "featured",
        price: searchStore.filters.price,
        view: searchStore.filters.view,
      },
    });

    if (response.status === "error") {
      throw new Error(response.message || `Failed to fetch ${assetType}`);
    }
    config.resultsRef.value = response.response.items.data || [];
  } catch (err) {
    console.error(`Error fetching ${assetType}:`, err);
    config.errorRef.value =
      err instanceof Error
        ? err.message
        : `An unknown error occurred fetching ${assetType}`;
  } finally {
    config.loadingRef.value = false;
  }
}

async function fetchAllAssets() {
  const routeQueryParam = decodeURIComponent(
    (route.params.query as string) || ""
  );

  if (searchStore.query !== routeQueryParam) {
    searchStore.query = routeQueryParam;
  }

  if (!searchQuery.value) {
    // Clear all results if query is empty
    Object.values(assetConfigs).forEach((config) => {
      config.resultsRef.value = [];
      config.errorRef.value = null;
      config.loadingRef.value = false;
    });
    return;
  }

  await Promise.allSettled(
    Object.keys(assetConfigs).map((assetType) =>
      fetchSpecificAsset(assetType as keyof typeof assetConfigs)
    )
  );
}

await useAsyncData("all-assets-fetch", fetchAllAssets);

watch(searchQuery, fetchAllAssets);

// SEO Meta Tags - Use computed refs from the store
useHead({
  title: computed(
    () =>
      `Search Results for ${
        searchQuery.value ? capitalizeWords(searchQuery.value) : "Design Assets"
      } - Icons, Illustrations, 3D & Lottie | IconScout`
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `Download premium & free design assets for ${
            searchQuery.value ? capitalizeWords(searchQuery.value) : ""
          }. Available as Icons, Illustrations, 3D Illustrations, and Lottie Animations.`
      ),
    },
  ],
});
</script>
