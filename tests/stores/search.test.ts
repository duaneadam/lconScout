import { setActivePinia, createPinia } from "pinia";

// Mock Nuxt's composables used in the store
vi.mock("#app", () => ({
  useRoute: () => ({
    fullPath: "/",
    params: {},
    path: "/",
    query: {},
  }),
  useRouter: () => ({
    replace: vi.fn(),
  }),
  useNuxtApp: () => ({
    $fetch: vi.fn(),
  }),
}));

// Mock utility functions if they exist and are used
vi.mock("@/utils/format", () => ({
  formatNumber: (num: number) => num.toString(),
  capitalizeWords: (str: string) => str,
}));

// Stub $fetch globally for convenience in tests
const mockFetch = vi.fn();
vi.stubGlobal("$fetch", mockFetch);

describe("useSearchStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset mocks and timers before each test
    vi.clearAllMocks();
    vi.useRealTimers();

    // Default mock for $fetch to prevent errors in unrelated tests
    mockFetch.mockResolvedValue({
      status: "success",
      response: { items: { data: [], total: 0 } },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to set up store with mock results
  async function setupStoreWithResults(
    store: ReturnType<typeof useSearchStore>,
    mockData: any[],
    mockTotal: number,
    query = "test" // Ensure query is set for fetch to run
  ) {
    store.query = query; // Set query before fetching
    mockFetch.mockResolvedValueOnce({
      status: "success",
      response: { items: { data: mockData, total: mockTotal } },
    });
    await store.fetchResults(true); // Use isNewSearch = true
  }

  it("initializes with correct default state", () => {
    const store = useSearchStore();
    expect(store.query).toBe("");
    expect(store.filters).toEqual({
      exclusive: false,
      price: "all",
      assetType: "all-assets",
      view: "item",
      sortBy: "featured",
    });
    expect(store.rawResults).toEqual([]); // Check rawResults
    expect(store.results).toEqual([]);
    expect(store.apiTotalItems).toBe(0); // Check apiTotalItems
    expect(store.totalItems).toBe(0);
    expect(store.exclusiveItemsCount).toBe(0);
    expect(store.isLoading).toBe(false);
    expect(store.humanizedAssetType).toBe("All Assets");
  });

  it("updateQuery updates the query state and triggers fetch", async () => {
    const store = useSearchStore();
    store.query = "initial"; // Set an initial query
    await store.updateQuery("test query");
    expect(store.query).toBe("test query");
    // updateQuery calls fetchResults(true) internally
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/search",
      expect.objectContaining({
        params: expect.objectContaining({ query: "test query" }),
      })
    );
  });

  // Removed the 'updateTotalItems' test as it's not a public action

  it("humanizedAssetType computes human-readable names", () => {
    const store = useSearchStore();
    expect(store.humanizedAssetType).toBe("All Assets");

    store.filters.assetType = "icons";
    expect(store.humanizedAssetType).toBe("Icons");

    store.filters.assetType = "3d-illustrations";
    expect(store.humanizedAssetType).toBe("3D Illustrations");

    store.filters.assetType = "lottie-animations";
    expect(store.humanizedAssetType).toBe("Lottie Animations");

    store.filters.assetType = "some-other-type";
    expect(store.humanizedAssetType).toBe("Some Other Type");
  });

  describe("computed properties after fetch", () => {
    it("results returns fetched data when exclusive is false", async () => {
      const store = useSearchStore();
      const mockResults = [{ id: 1 }, { id: 2 }];
      await setupStoreWithResults(store, mockResults, 10);

      store.filters.exclusive = false;
      // Ensure computed property recalculates if needed (though Pinia should handle this)
      await nextTick();
      expect(store.results).toEqual(mockResults);
      expect(store.rawResults).toEqual(mockResults); // Verify rawResults too
    });

    it("results returns only exclusive items when exclusive is true", async () => {
      const store = useSearchStore();
      const mockResults = [
        { id: 1, additional_informations: { iconscout_exclusive: true } },
        { id: 2, additional_informations: { iconscout_exclusive: false } },
        { id: 3, additional_informations: { iconscout_exclusive: true } },
        { id: 4 },
      ];
      await setupStoreWithResults(store, mockResults, 10);

      store.filters.exclusive = true;
      await nextTick();
      expect(store.results).toEqual([
        { id: 1, additional_informations: { iconscout_exclusive: true } },
        { id: 3, additional_informations: { iconscout_exclusive: true } },
      ]);
      expect(store.rawResults).toEqual(mockResults); // rawResults should be unchanged
    });

    it("totalItems returns apiTotalItems when exclusive is false", async () => {
      const store = useSearchStore();
      await setupStoreWithResults(store, [{ id: 1 }], 123);

      store.filters.exclusive = false;
      await nextTick();
      expect(store.totalItems).toBe(123);
      expect(store.apiTotalItems).toBe(123);
    });

    it("totalItems returns the length of filtered results when exclusive is true", async () => {
      const store = useSearchStore();
      const mockResults = [
        { id: 1, additional_informations: { iconscout_exclusive: true } },
        { id: 2, additional_informations: { iconscout_exclusive: false } },
        { id: 3, additional_informations: { iconscout_exclusive: true } },
      ];
      await setupStoreWithResults(store, mockResults, 500); // apiTotalItems is 500

      store.filters.exclusive = true;
      await nextTick();
      // totalItems should reflect the count of *loaded* exclusive items
      expect(store.totalItems).toBe(2);
      expect(store.apiTotalItems).toBe(500); // apiTotalItems remains the total from API
    });

    it("exclusiveItemsCount correctly counts items after fetch", async () => {
      const store = useSearchStore();
      const mockResults = [
        { id: 1, additional_informations: { iconscout_exclusive: true } },
        { id: 2, additional_informations: { iconscout_exclusive: false } },
        { id: 3, additional_informations: { iconscout_exclusive: true } },
        { id: 4 },
        { id: 5, additional_informations: { iconscout_exclusive: true } },
      ];
      await setupStoreWithResults(store, mockResults, 10);
      await nextTick();
      expect(store.exclusiveItemsCount).toBe(3);
    });
  });

  describe("fetchResults action", () => {
    it("sets isLoading, calls $fetch, updates state on success (page 1)", async () => {
      const store = useSearchStore();
      const mockData = [{ id: 1 }, { id: 2 }];
      const mockTotal = 10;
      mockFetch.mockResolvedValueOnce({
        status: "success",
        response: { items: { data: mockData, total: mockTotal } },
      });

      store.query = "search term";
      store.filters.assetType = "icons"; // Set assetType *before* calling fetch
      const promise = store.fetchResults(true); // isNewSearch = true

      expect(store.isLoading).toBe(true);
      await promise;
      expect(store.isLoading).toBe(false);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith("/api/search", {
        params: {
          query: "search term",
          assetType: "icons",
          page: 1,
          perPage: 60, // Corrected: icons use 60 perPage
          sort: "featured",
          price: "all",
          view: "item",
        },
      });

      expect(store.rawResults).toEqual(mockData); // Check rawResults
      expect(store.apiTotalItems).toBe(mockTotal); // Check apiTotalItems
      expect(store.error).toBeNull();
    });

    it("appends results when loading more (isNewSearch = false)", async () => {
      const store = useSearchStore();
      const initialData = [{ id: "a" }];
      const newData = [{ id: "b" }, { id: "c" }];
      const initialTotal = 10;
      const newTotal = 25; // API might return a different total on subsequent pages

      // Initial fetch (page 1)
      await setupStoreWithResults(
        store,
        initialData,
        initialTotal,
        "more test"
      );
      expect(store.rawResults).toEqual(initialData);
      expect(store.apiTotalItems).toBe(initialTotal);
      expect(store.currentPage).toBe(1);
      expect(mockFetch).toHaveBeenCalledTimes(1); // From setupStoreWithResults

      // Prepare mock for page 2
      mockFetch.mockResolvedValueOnce({
        status: "success",
        response: { items: { data: newData, total: newTotal } },
      });

      // Manually increment page and call fetchResults(false)
      store.currentPage = 2;
      const promise = store.fetchResults(false); // isNewSearch = false

      expect(store.isLoadingMore).toBe(true);
      await promise;
      expect(store.isLoadingMore).toBe(false);

      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + page 2
      expect(mockFetch).toHaveBeenLastCalledWith("/api/search", {
        params: expect.objectContaining({
          query: "more test",
          page: 2, // Should fetch page 2
        }),
      });

      expect(store.rawResults).toEqual([...initialData, ...newData]); // Results appended
      expect(store.apiTotalItems).toBe(newTotal); // Total updated
      expect(store.error).toBeNull();
    });

    it("handles API error response (status: 'error')", async () => {
      const store = useSearchStore();
      const errorMessage = "API failed";
      mockFetch.mockResolvedValueOnce({
        // Resolves, but with an error status
        status: "error",
        message: errorMessage,
        response: { items: { data: [], total: 0 } }, // Ensure response structure
      });

      store.query = "error test";
      await store.fetchResults(true); // Call the action

      // Check state after the action completes
      expect(store.isLoading).toBe(false);
      expect(store.rawResults).toEqual([]); // Results cleared on error for new search
      expect(store.apiTotalItems).toBe(0); // Total cleared
      expect(store.error).toBe(errorMessage); // Error state should be set
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("handles network/fetch error (rejected promise)", async () => {
      const store = useSearchStore();
      const networkError = new Error("Network failed");
      mockFetch.mockRejectedValueOnce(networkError); // $fetch promise rejects

      store.query = "network error test";
      await store.fetchResults(true); // Call the action

      // Check state after the action completes
      expect(store.isLoading).toBe(false);
      expect(store.rawResults).toEqual([]); // Results cleared on error for new search
      expect(store.apiTotalItems).toBe(0); // Total cleared
      expect(store.error).toBe("Network failed"); // Error state should be set
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateFilters action", () => {
    it("updates filter and triggers API call if needed", async () => {
      const store = useSearchStore();
      store.query = "filter test"; // Need query for fetch to trigger

      mockFetch.mockResolvedValueOnce({
        status: "success",
        response: { items: { data: [{ id: "test" }], total: 1 } },
      });

      // Update a filter that requires refetch (assetType)
      await store.updateFilters({ assetType: "illustrations" });

      expect(store.filters.assetType).toBe("illustrations");
      expect(mockFetch).toHaveBeenCalledTimes(1); // Fetch should be called
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/search",
        expect.objectContaining({
          params: expect.objectContaining({
            assetType: "illustrations",
            query: "filter test",
            page: 1, // Should reset to page 1
          }),
        })
      );

      // Update a filter that doesn't require refetch (exclusive)
      mockFetch.mockClear();
      await store.updateFilters({ exclusive: true });
      expect(store.filters.exclusive).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled(); // Fetch should NOT be called
    });
  });

  describe("resetFilters action", () => {
    it("resets filters to defaults and triggers API call", async () => {
      const store = useSearchStore();
      store.query = "reset test"; // Need query for fetch to trigger

      // Change some filters from default
      store.filters.exclusive = true;
      store.filters.assetType = "icons";
      store.filters.sortBy = "popular";

      mockFetch.mockResolvedValueOnce({
        status: "success",
        response: { items: { data: [], total: 0 } },
      });

      await store.resetFilters();

      // Check if filters are reset correctly
      expect(store.filters).toEqual({
        exclusive: false,
        price: "all",
        assetType: "all-assets",
        view: "item",
        sortBy: "featured", // Internal state uses sortBy
      });

      // Check if fetch was called with reset filters and correct param keys
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/search",
        expect.objectContaining({
          params: expect.objectContaining({
            assetType: "all-assets",
            page: 1,
            perPage: 30, // Default for 'all-assets'
            price: "all", // Default
            query: "reset test",
            sort: "featured", // API uses 'sort'
            view: "item", // Default
          }),
        })
      );
    });
  });

  // Add tests for loadMoreResults, initializeFromRoute, updateRoute if needed
  // Note: Testing initializeFromRoute and updateRoute requires more complex mocking
  // of the Nuxt router and route objects.
});
