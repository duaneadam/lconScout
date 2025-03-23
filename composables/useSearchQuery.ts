export const useSearchQuery = (basePath: string) => {
  const route = useRoute();
  const router = useRouter();
  const searchQuery = ref("");

  // Initialize from route params
  onMounted(() => {
    if (route.params.query) {
      searchQuery.value = decodeURIComponent(route.params.query as string);
    }
  });

  // Watch for route parameter changes
  watch(
    () => route.params.query,
    (newQuery) => {
      if (newQuery) {
        searchQuery.value = decodeURIComponent(newQuery as string);
      } else {
        searchQuery.value = "";
      }
    }
  );

  const performSearch = () => {
    if (searchQuery.value.trim()) {
      router.push(
        `/${basePath}/${encodeURIComponent(searchQuery.value.trim())}`
      );
    } else {
      router.push(`/${basePath}`);
    }
  };

  return {
    searchQuery,
    performSearch,
  };
};
