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
    return `${formatNumber(totalItems.value)} ${query}${resolvedAssetType.value}`;
  });

  const subtitle = computed(() => {
    return `${formatNumber(totalItems.value)} ${
      resolvedAssetType.value
    } exclusively selected by our designer community.`;
  });

  return {
    title,
    subtitle,
  };
};
