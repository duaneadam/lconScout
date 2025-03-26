// stores/search.ts
export const useSearchStore = defineStore("search", () => {
  const query = ref("");
  const filters = ref<SearchFilters>({
    exclusive: false,
    price: "premium",
    assetType: "all-assets",
    view: "item",
    sortBy: "relevant",
  });
  const rawResults = ref<any[]>([]); // Store original API results
  const isLoading = ref(false);
  const apiTotalItems = ref(0); // Total from API before client-side filtering

  // Computed property for filtered results based on exclusive flag
  const results = computed(() => {
    if (!filters.value.exclusive) {
      return rawResults.value;
    }

    // Filter items where iconscout_exclusive is true
    return rawResults.value.filter(
      (item) => item.additional_informations?.iconscout_exclusive === true
    );
  });

  // Computed property for total items count after filtering
  const totalItems = computed(() => {
    if (!filters.value.exclusive) {
      return apiTotalItems.value;
    }
    // For exclusive filter, we can only know the count of what we've loaded
    return results.value.length;
  });

  function updateQuery(newQuery: string) {
    query.value = newQuery;
  }

  function updateAssetType(assetType: string) {
    filters.value.assetType = assetType;
    fetchResults(assetType);
  }

  function updateTotalItems(count: number) {
    apiTotalItems.value = count;
  }

  async function fetchResults(
    assetType: string,
    options?: { page?: number; perPage?: number; sort?: string }
  ) {
    isLoading.value = true;

    try {
      const response = await $fetch("/api/search", {
        params: {
          query: query.value,
          assetType,
          page: options?.page || 1,
          perPage: options?.perPage || 30,
          sort: options?.sort || filters.value.sortBy || "relevant",
          price: filters.value.price,
          view: filters.value.view,
        },
      });

      if (response.status === "error") {
        throw new Error(
          response.message || "An error occurred while fetching results"
        );
      }

      // Handle append or replace based on page number
      if (options?.page && options.page > 1) {
        rawResults.value = [
          ...rawResults.value,
          ...response.response.items.data,
        ];
      } else {
        rawResults.value = response.response.items.data;
      }

      // Store the total from API
      apiTotalItems.value = response.response.items.total;

      return response;
    } catch (error) {
      console.error("Error fetching results:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function resetFilters() {
    filters.value = {
      exclusive: false,
      price: "premium",
      assetType: "all-assets",
      view: "item",
      sortBy: "relevant",
    };
    // Fetch results with reset filters
    fetchResults(filters.value.assetType);
  }

  // Convert kebab-case to human-readable format
  function humanizeAssetType(type: string): string {
    // Special case for 3D
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

  const exclusiveItemsCount = computed(
    () =>
      rawResults.value.filter(
        (item) => item.additional_informations?.iconscout_exclusive === true
      ).length
  );

  return {
    query,
    filters,
    totalItems,
    exclusiveItemsCount,
    results,
    isLoading,
    updateQuery,
    updateAssetType,
    updateTotalItems,
    resetFilters,
    humanizedAssetType,
    fetchResults,
  };
});
