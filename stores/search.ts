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
  const results = ref([]);
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

    // General case: capitalize each word and replace hyphens with spaces
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Computed property for humanized asset type
  const humanizedAssetType = computed(() =>
    humanizeAssetType(filters.value.assetType)
  );

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

    results.value = response.response.items.data;
    totalItems.value = response.response.items.total;
  }

  return {
    query,
    filters,
    totalItems,
    updateQuery,
    updateAssetType,
    updateTotalItems,
    fetchResults,
    results,
    humanizedAssetType,
    resetFilters,
  };
});
