export const useSearchTitle = (
  searchQuery: Ref<string>,
  totalItems: Ref<number>,
  assetType: Ref<string>
) => {
  // Computed properties for SearchHeader
  const title = computed(() => {
    const query = searchQuery.value ? `${searchQuery.value} ` : "";
    return `${formatNumber(totalItems.value)} ${query}${assetType.value}`;
  });

  const subtitle = computed(() => {
    return `${formatNumber(totalItems.value)} ${
      assetType.value
    } exclusively selected by our designer community.`;
  });

  return {
    title,
    subtitle,
  };
};
