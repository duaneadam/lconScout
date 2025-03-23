export const useSearchTitle = (
  searchQuery: Ref<string>,
  totalItems: Ref<number>,
  assetType: string | Ref<string>
) => {
  // Handle both string and ref inputs for assetType
  const resolvedAssetType = computed(() => {
    return typeof assetType === "string" ? assetType : assetType.value;
  });

  // Computed properties for SearchHeader
  const title = computed(() => {
    const query = searchQuery.value ? `${searchQuery.value} ` : "";
    return `${totalItems.value} ${query}${resolvedAssetType.value}`;
  });

  const subtitle = computed(() => {
    return `${totalItems.value} ${resolvedAssetType.value}s exclusively selected by our designer community.`;
  });

  return {
    title,
    subtitle,
  };
};
