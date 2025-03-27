export const useSearchTitle = (
  searchQuery: Ref<string>,
  totalItems: Ref<number>,
  totalExclusiveItems: Ref<number>,
  assetType: Ref<string>,
  isLoading: Ref<boolean>
) => {
  const title = computed(() => {
    if (isLoading.value) {
      return `Searching for ${
        searchQuery.value ? searchQuery.value + " " : ""
      }${assetType.value}...`;
    }
    const query = searchQuery.value ? `${searchQuery.value} ` : "";
    return `${formatNumber(totalItems.value)} ${query}${assetType.value}`;
  });

  const subtitle = computed(() => {
    return `${formatNumber(totalExclusiveItems.value)} ${
      assetType.value
    } exclusively selected by our designer community.`;
  });

  return {
    title,
    subtitle,
  };
};
