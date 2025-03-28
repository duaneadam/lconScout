export interface SearchFilters {
  exclusive: boolean;
  price: "all" | "free" | "premium";
  assetType:
    | "all-assets"
    | "3d-illustrations"
    | "lottie-animations"
    | "illustrations"
    | "icons";
  view: "item" | "pack";
  sortBy: "featured" | "popular" | "latest" | "relevant";
}

// TODO: fix later, this was quickly gen by AI. Map actual API response.
interface AssetItem {
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
  color_codes: Array<{ decimal_color: number; color_id: number }>;
  is_premium: boolean;
  payable_price: number;
  formats: Array<{ id: number; name: string; mime_type: string }>;
  additional_informations?: {
    iconscout_exclusive?: boolean;
  };
}

interface ApiResponse {
  status: string;
  message?: string;
  response: {
    items: {
      current_page: number;
      data: AssetItem[];
      total: number;
    };
  };
}

export const useSearchStore = defineStore("search", () => {
  const router = useRouter();
  const route = useRoute();

  const query = ref("");
  const filters = ref<SearchFilters>({
    exclusive: false,
    price: "all",
    assetType: "all-assets",
    view: "item",
    sortBy: "featured",
  });
  const rawResults = ref<AssetItem[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const error = ref<string | null>(null);
  const apiTotalItems = ref(0);
  const currentPage = ref(1);

  const perPage = computed(() =>
    filters.value.assetType === "icons" ? 60 : 30
  );

  const results = computed(() => {
    if (!filters.value.exclusive) {
      return rawResults.value;
    }
    return rawResults.value.filter(
      (item) => item.additional_informations?.iconscout_exclusive === true
    );
  });

  const totalItems = computed(() => {
    // If exclusive is checked, we only know the count of loaded exclusive items
    // There is no way to use API to get exclusive items count
    if (filters.value.exclusive) {
      return results.value.length; // Count of client-side filtered items
    }
    // Otherwise, return the total count from the API
    return apiTotalItems.value;
  });

  const exclusiveItemsCount = computed(
    () =>
      rawResults.value.filter(
        (item) => item.additional_informations?.iconscout_exclusive === true
      ).length
  );

  const hasMorePages = computed(() => {
    // TODO: The requirement mentions show 2 pages only, this needs to be linked to
    // auth state. Eg: isLoggedIn.
    return rawResults.value.length < apiTotalItems.value;
  });

  function humanizeAssetType(type: string): string {
    if (type === "3d-illustrations") return "3D Illustrations";
    if (type === "lottie-animations") return "Lottie Animations";
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const humanizedAssetType = computed(() =>
    humanizeAssetType(filters.value.assetType)
  );

  const searchTitle = computed(() => {
    const assetDisplayName =
      filters.value.assetType === "all-assets"
        ? "Design Assets" // Use 'Design Assets' for 'all-assets' type
        : humanizedAssetType.value;

    if (isLoading.value && currentPage.value === 1) {
      return `Searching for ${
        query.value ? query.value + " " : ""
      }${assetDisplayName}...`;
    }
    const queryText = query.value ? `${capitalizeWords(query.value)} ` : "";
    // Use apiTotalItems for title consistency, even when exclusive is checked
    return `${formatNumber(
      apiTotalItems.value
    )} ${queryText}${assetDisplayName}`;
  });

  const searchSubtitle = computed(() => {
    // Use the count of *loaded* exclusive items for the subtitle
    // reminder: API doesn't provide this count
    return `${formatNumber(exclusiveItemsCount.value)} ${
      humanizedAssetType.value
    } exclusively selected by our designer community.`;
  });

  async function fetchResults(isNewSearch = false) {
    if (!query.value || query.value.trim() === "") {
      rawResults.value = [];
      apiTotalItems.value = 0;
      isLoading.value = false;
      isLoadingMore.value = false;
      error.value = null;
      return;
    }

    if (isNewSearch) {
      isLoading.value = true;
      isLoadingMore.value = false;
      error.value = null;
      currentPage.value = 1; // Reset page for new searches/filter changes
    } else {
      isLoadingMore.value = true;
    }

    try {
      const response: ApiResponse = await $fetch("/api/search", {
        params: {
          query: query.value.trim(),
          assetType: filters.value.assetType,
          page: currentPage.value,
          perPage: perPage.value,
          sort: filters.value.sortBy,
          price: filters.value.price,
          view: filters.value.view,
        },
      });

      if (response.status === "error") {
        throw new Error(
          response.message || "An error occurred while fetching results"
        );
      }

      const newItems = response.response.items.data || [];
      if (isNewSearch || currentPage.value === 1) {
        rawResults.value = newItems;
      } else {
        rawResults.value = [...rawResults.value, ...newItems];
      }

      apiTotalItems.value = response.response.items.total || 0;
      error.value = null; // Clear error on success, else it will appear on page/UI
    } catch (err) {
      console.error("Error fetching results:", err);
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
      // Keep existing results on error when loading more
      if (isNewSearch) {
        rawResults.value = [];
        apiTotalItems.value = 0;
      }
    } finally {
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  }

  async function loadMoreResults() {
    if (isLoading.value || isLoadingMore.value || !hasMorePages.value) return;
    currentPage.value++;
    await fetchResults(false);
  }

  function updateQuery(newQuery: string) {
    const trimmedQuery = newQuery.trim();
    if (query.value !== trimmedQuery) {
      query.value = trimmedQuery;
      updateRoute(); // Update URL. TODO: fix URL params bug
      fetchResults(true); // Trigger new search
    }
  }

  function updateFilters(newFilters: Partial<SearchFilters>) {
    let needsRefetch = false;
    for (const key in newFilters) {
      if (
        Object.prototype.hasOwnProperty.call(newFilters, key) &&
        filters.value[key as keyof SearchFilters] !==
          newFilters[key as keyof SearchFilters]
      ) {
        // Update filter value
        (filters.value as any)[key] = newFilters[key as keyof SearchFilters];

        // Check if this filter change requires an API call (exclusive doesn't, we use loaded locl state)
        if (key !== "exclusive") {
          needsRefetch = true;
        }

        // If assetType changed, update URL and trigger refetch
        if (key === "assetType") {
          updateRoute();
          needsRefetch = true; // Ensure refetch happens even if it was the only change
        }
      }
    }

    if (needsRefetch) {
      fetchResults(true);
    }
  }

  function resetFilters() {
    filters.value = {
      exclusive: false,
      price: "all",
      assetType: "all-assets",
      view: "item",
      sortBy: "featured",
    };

    updateRoute();
    fetchResults(true);
  }

  // Initialize store state based on route parameters
  async function initializeFromRoute() {
    const routeQuery = (route.params.query as string) || "";
    const routeAssetType = route.path.split("/")[1] || "all-assets"; // Extract from path

    const validAssetTypes = [
      "all-assets",
      "icons",
      "illustrations",
      "3d-illustrations",
      "lottie-animations",
    ];
    const currentAssetType = validAssetTypes.includes(routeAssetType)
      ? routeAssetType
      : "all-assets";

    let needsFetch = false;

    if (query.value !== routeQuery) {
      query.value = routeQuery;
      needsFetch = true;
    }
    if (filters.value.assetType !== currentAssetType) {
      filters.value.assetType = currentAssetType;
      needsFetch = true;
    }

    if (needsFetch) {
      // This fetch will reset currentPage and rawResults
      await fetchResults(true);
    } else if (rawResults.value.length === 0 && query.value) {
      // If state is somehow lost but route is correct, fetch initial data
      await fetchResults(true);
    }
  }

  // Update the URL based on store state
  function updateRoute() {
    const newPath = `/${filters.value.assetType}${
      query.value ? `/${encodeURIComponent(query.value)}` : ""
    }`;
    // Use replace to avoid polluting history for filter/tab changes
    if (route.fullPath !== newPath) {
      router.replace(newPath);
    }
  }

  // Watch route changes to re-initialize store state
  watch(
    () => route.fullPath,
    async (newFullPath, oldFullPath) => {
      // Avoid re-initializing if only hash changed, or if it's the initial load (handled by page)
      if (newFullPath !== oldFullPath && oldFullPath !== "/") {
        await initializeFromRoute();
      }
    }
  );

  return {
    query,
    filters,
    results, // Filtered results (respects 'exclusive')
    rawResults, // Raw results from API
    totalItems, // Total count (respects 'exclusive')
    apiTotalItems, // Total count from API
    exclusiveItemsCount, // Count of loaded exclusive items
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    perPage,
    hasMorePages,
    humanizedAssetType,
    searchTitle,
    searchSubtitle,

    // Actions
    fetchResults,
    loadMoreResults,
    updateQuery,
    updateFilters,
    resetFilters,
    initializeFromRoute,
    updateRoute,
  };
});
