interface SearchFilters {
  exclude: boolean;
  price: "free" | "premium";
  assetType:
    | "all-assets"
    | "icons"
    | "illustrations"
    | "3d-illustrations"
    | "lottie-animations";
  view: "item" | "pack";
}

export const useSearchStore = defineStore("search", () => {
  const query = ref("");
  const filters = ref<SearchFilters>({
    exclude: false,
    price: "premium",
    assetType: "all-assets",
    view: "item",
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

  async function fetchResults(assetType: string) {
    const response = await $fetch("/api/search", {
      params: {
        q: query.value,
        assetType,
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
    fetchResults,
    results,
    humanizedAssetType,
  };
});
