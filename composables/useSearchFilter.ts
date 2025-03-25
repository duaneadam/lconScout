// composables/useAssetFilters.ts
import type Filters from "~/types/search/filters";
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

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

  const humanizedAssetType = computed(() => humanizeAssetType(currentAssetType.value));

  // Handle asset type changes from AssetTabs component
  const handleAssetTypeChange = async (assetType: string) => {
    const router = useRouter();
    const route = useRoute();

    currentAssetType.value = assetType;

    const searchQuery = route.params.query;
    const targetPath = searchQuery
      ? `/${assetType}/${searchQuery}`
      : `/${assetType}`;

    await router.push(targetPath);
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
    humanizedAssetType,
  };
};
