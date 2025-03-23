// composables/useAssetFilters.ts
import type Filters from "~/types/search/filters";

export const useSearchFilter = (initialAssetType: string) => {
  const currentAssetType = ref(initialAssetType);

  // Convert kebab-case to human-readable format
  const humanizeAssetType = (type: string): string => {
    // Special case for 3D
    if (type === "3d-illustrations") return "3D Illustrations";

    // General case: capitalize each word and replace hyphens with spaces
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle asset type changes from AssetTabs component
  const handleAssetTypeChange = (assetType: string) => {
    currentAssetType.value = assetType;
  };

  // Handle filter changes from SearchSidebar component
  const handleFilterChange = (filters: Filters) => {
    console.log("Filters changed:", filters);
  };

  return {
    currentAssetType,
    humanizeAssetType,
    handleAssetTypeChange,
    handleFilterChange,
  };
};
