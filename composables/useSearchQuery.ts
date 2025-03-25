export const useSearchQuery = (basePath: string) => {
  const route = useRoute();
  const router = useRouter();
  const searchQuery = ref("");

  // Function to sync from route params
  const syncFromRoute = () => {
    console.log("Route params:", route.params); // Debug
    if (route.params.query) {
      searchQuery.value = decodeURIComponent(route.params.query as string);
      console.log("Set search query to:", searchQuery.value); // Debug
    } else {
      searchQuery.value = "";
    }
  };

  // Initialize immediately (not waiting for onMounted)
  syncFromRoute();

  // Also initialize on mounted to be safe
  onMounted(() => {
    syncFromRoute();
  });

  // Watch for route parameter changes
  watch(
    () => route.params.query,
    (newQuery) => {
      console.log("Route param changed to:", newQuery); // Debug
      syncFromRoute();
    },
    { immediate: true } // This is important - run immediately
  );

  const performSearch = () => {
    const trimmedQuery = searchQuery.value.trim();
    console.log("Performing search with:", trimmedQuery); // Debug

    if (trimmedQuery) {
      router.push(`/${basePath}/${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push(`/${basePath}`);
    }
  };

  return {
    searchQuery,
    performSearch,
  };
};
