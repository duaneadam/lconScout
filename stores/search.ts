interface SearchFilters {
  price: "free" | "premium" | "all";
  assetType:
    | "all-assets"
    | "icons"
    | "illustrations"
    | "3d-illustrations"
    | "lottie-animations";
  view: "item" | "pack";
  sortBy: "popular" | "latest" | "featured" | "relevant";
}

export const useSearchStore = defineStore("search", () => {
  const query = ref("");
  const filters = ref<SearchFilters>({
    price: "premium",
    assetType: "all-assets",
    view: "item",
    sortBy: "relevant",
  });
  const results = ref<any[]>([]);
  const totalItems = ref(0);

  function updateQuery(newQuery: string) {
    query.value = newQuery;
  }

  function updateAssetType(assetType: string) {
    filters.value.assetType = assetType;
    fetchResults(assetType);
  }

  function updateTotalItems(count: number) {
    totalItems.value = count;
  }

  async function fetchResults(
    assetType: string,
    options?: { page?: number; perPage?: number; sort?: string }
  ) {
    const response = await $fetch("/api/search", {
      params: {
        query: query.value,
        assetType,
        page: options?.page || 1,
        perPage: options?.perPage || 30,
        sort: options?.sort || filters.value.sortBy || "relevant",
        ...filters.value,
      },
    });

    if (options?.page && options.page > 1) {
      results.value = [...results.value, ...response.response.items.data];
    } else {
      results.value = response.response.items.data;
    }
    totalItems.value = response.response.items.total;
  }

  function resetFilters() {
    filters.value = {
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

  return {
    query,
    filters,
    totalItems,
    results,
    updateQuery,
    updateAssetType,
    updateTotalItems,
    resetFilters,
    humanizedAssetType,
    fetchResults,
  };
});
