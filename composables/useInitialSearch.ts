export const useInitialSearch = async (assetType: string) => {
  const route = useRoute();
  const totalItems = ref(0);

  // Fetch initial data during SSR
  // Important for SEO
  const { data: initialData } = await useFetch("/api/search", {
    params: {
      assetType,
      perPage: 30,
      page: 1,
      sort: "relevant",
      query: route.params.query || "",
    },
  });

  if (initialData.value?.response?.items?.total) {
    totalItems.value = initialData.value.response.items.total;
  }

  const updateTotalItems = (total: number) => {
    totalItems.value = total;
  };

  return {
    totalItems,
    updateTotalItems,
  };
};
