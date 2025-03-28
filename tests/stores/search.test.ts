import { setActivePinia, createPinia } from "pinia";

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

vi.mock("@/utils/format", () => ({
  formatNumber: (num: number) => num.toString(),
  capitalizeWords: (str: string) => str,
}));

const mockFetch = vi.fn();
vi.stubGlobal("$fetch", mockFetch);

describe("useSearchStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();
    vi.useRealTimers();

    mockFetch.mockResolvedValue({
      status: "success",
      response: { items: { data: [], total: 0 } },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  async function setupStoreWithResults(
    store: ReturnType<typeof useSearchStore>,
    mockData: any[],
    mockTotal: number,
    query = "test"
  ) {
    store.query = query;
    mockFetch.mockResolvedValueOnce({
      status: "success",
      response: { items: { data: mockData, total: mockTotal } },
    });
    await store.fetchResults(true);
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
    expect(store.rawResults).toEqual([]);
    expect(store.results).toEqual([]);
    expect(store.apiTotalItems).toBe(0);
    expect(store.totalItems).toBe(0);
    expect(store.exclusiveItemsCount).toBe(0);
    expect(store.isLoading).toBe(false);
    expect(store.humanizedAssetType).toBe("All Assets");
  });

  it("updateQuery updates the query state and triggers fetch", async () => {
    const store = useSearchStore();
    store.query = "initial";
    await store.updateQuery("test query");
    expect(store.query).toBe("test query");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/search",
      expect.objectContaining({
        params: expect.objectContaining({ query: "test query" }),
      })
    );
  });

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

      await nextTick();
      expect(store.results).toEqual(mockResults);
      expect(store.rawResults).toEqual(mockResults);
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
      expect(store.rawResults).toEqual(mockResults);
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
      await setupStoreWithResults(store, mockResults, 500);

      store.filters.exclusive = true;
      await nextTick();

      expect(store.totalItems).toBe(2);
      expect(store.apiTotalItems).toBe(500);
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
      store.filters.assetType = "icons";
      const promise = store.fetchResults(true);

      expect(store.isLoading).toBe(true);
      await promise;
      expect(store.isLoading).toBe(false);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith("/api/search", {
        params: {
          query: "search term",
          assetType: "icons",
          page: 1,
          perPage: 60,
          sort: "featured",
          price: "all",
          view: "item",
        },
      });

      expect(store.rawResults).toEqual(mockData);
      expect(store.apiTotalItems).toBe(mockTotal);
      expect(store.error).toBeNull();
    });

    it("appends results when loading more (isNewSearch = false)", async () => {
      const store = useSearchStore();
      const initialData = [{ id: "a" }];
      const newData = [{ id: "b" }, { id: "c" }];
      const initialTotal = 10;
      const newTotal = 25;

      await setupStoreWithResults(
        store,
        initialData,
        initialTotal,
        "more test"
      );
      expect(store.rawResults).toEqual(initialData);
      expect(store.apiTotalItems).toBe(initialTotal);
      expect(store.currentPage).toBe(1);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      mockFetch.mockResolvedValueOnce({
        status: "success",
        response: { items: { data: newData, total: newTotal } },
      });

      store.currentPage = 2;
      const promise = store.fetchResults(false);

      expect(store.isLoadingMore).toBe(true);
      await promise;
      expect(store.isLoadingMore).toBe(false);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith("/api/search", {
        params: expect.objectContaining({
          query: "more test",
          page: 2,
        }),
      });

      expect(store.rawResults).toEqual([...initialData, ...newData]);
      expect(store.apiTotalItems).toBe(newTotal);
      expect(store.error).toBeNull();
    });

    it("handles API error response (status: 'error')", async () => {
      const store = useSearchStore();
      const errorMessage = "API failed";
      mockFetch.mockResolvedValueOnce({
        status: "error",
        message: errorMessage,
        response: { items: { data: [], total: 0 } },
      });

      store.query = "error test";
      await store.fetchResults(true);

      expect(store.isLoading).toBe(false);
      expect(store.rawResults).toEqual([]);
      expect(store.apiTotalItems).toBe(0);
      expect(store.error).toBe(errorMessage);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("handles network/fetch error (rejected promise)", async () => {
      const store = useSearchStore();
      const networkError = new Error("Network failed");
      mockFetch.mockRejectedValueOnce(networkError);

      store.query = "network error test";
      await store.fetchResults(true);

      expect(store.isLoading).toBe(false);
      expect(store.rawResults).toEqual([]);
      expect(store.apiTotalItems).toBe(0);
      expect(store.error).toBe("Network failed");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateFilters action", () => {
    it("updates filter and triggers API call if needed", async () => {
      const store = useSearchStore();
      store.query = "filter test";

      mockFetch.mockResolvedValueOnce({
        status: "success",
        response: { items: { data: [{ id: "test" }], total: 1 } },
      });

      await store.updateFilters({ assetType: "illustrations" });

      expect(store.filters.assetType).toBe("illustrations");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/search",
        expect.objectContaining({
          params: expect.objectContaining({
            assetType: "illustrations",
            query: "filter test",
            page: 1,
          }),
        })
      );

      mockFetch.mockClear();
      await store.updateFilters({ exclusive: true });
      expect(store.filters.exclusive).toBe(true);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("resetFilters action", () => {
    it("resets filters to defaults and triggers API call", async () => {
      const store = useSearchStore();
      store.query = "reset test";

      store.filters.exclusive = true;
      store.filters.assetType = "icons";
      store.filters.sortBy = "popular";

      mockFetch.mockResolvedValueOnce({
        status: "success",
        response: { items: { data: [], total: 0 } },
      });

      await store.resetFilters();

      expect(store.filters).toEqual({
        exclusive: false,
        price: "all",
        assetType: "all-assets",
        view: "item",
        sortBy: "featured",
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/search",
        expect.objectContaining({
          params: expect.objectContaining({
            assetType: "all-assets",
            page: 1,
            perPage: 30,
            price: "all",
            query: "reset test",
            sort: "featured",
            view: "item",
          }),
        })
      );
    });
  });
});
