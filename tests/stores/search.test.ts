import { setActivePinia, createPinia } from "pinia";

vi.stubGlobal("$fetch", vi.fn());

describe("useSearchStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();
    vi.useRealTimers();

    vi.mocked($fetch).mockResolvedValue({
      status: "success",
      response: { items: { data: [], total: 0 } },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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

    expect(store.results).toEqual([]);
    expect(store.totalItems).toBe(0);
    expect(store.exclusiveItemsCount).toBe(0);
    expect(store.isLoading).toBe(false);
    expect(store.humanizedAssetType).toBe("All Assets");
  });

  it("updateQuery updates the query state", () => {
    const store = useSearchStore();
    store.updateQuery("test query");
    expect(store.query).toBe("test query");
  });

  it("updateTotalItems updates the apiTotalItems reflected in totalItems (when not exclusive)", () => {
    const store = useSearchStore();
    store.filters.exclusive = false;
    store.updateTotalItems(150);
    expect(store.totalItems).toBe(150);
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

  async function setupStoreWithResults(
    store: ReturnType<typeof useSearchStore>,
    mockData: any[],
    mockTotal: number
  ) {
    vi.mocked($fetch).mockResolvedValueOnce({
      status: "success",
      response: { items: { data: mockData, total: mockTotal } },
    });
    await store.fetchResults("any");
  }

  describe("computed properties after fetch", () => {
    it("results returns fetched data when exclusive is false", async () => {
      const store = useSearchStore();
      const mockResults = [{ id: 1 }, { id: 2 }];
      await setupStoreWithResults(store, mockResults, 10);

      store.filters.exclusive = false;
      expect(store.results).toEqual(mockResults);
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
      expect(store.results).toEqual([
        { id: 1, additional_informations: { iconscout_exclusive: true } },
        { id: 3, additional_informations: { iconscout_exclusive: true } },
      ]);
    });

    it("totalItems returns apiTotalItems when exclusive is false", async () => {
      const store = useSearchStore();
      await setupStoreWithResults(store, [{ id: 1 }], 123);

      store.filters.exclusive = false;
      expect(store.totalItems).toBe(123);
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
      expect(store.totalItems).toBe(2);
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
      expect(store.exclusiveItemsCount).toBe(3);
    });
  });

  describe("fetchResults action", () => {
    it("sets isLoading, calls $fetch, updates state on success (page 1)", async () => {
      const store = useSearchStore();
      const mockData = [{ id: 1 }, { id: 2 }];
      const mockTotal = 10;
      vi.mocked($fetch).mockResolvedValueOnce({
        status: "success",
        response: { items: { data: mockData, total: mockTotal } },
      });

      store.query = "search term";
      const promise = store.fetchResults("icons");

      expect(store.isLoading).toBe(true);
      await promise;
      expect(store.isLoading).toBe(false);

      expect($fetch).toHaveBeenCalledTimes(1);
      expect($fetch).toHaveBeenCalledWith("/api/search", {
        params: {
          query: "search term",
          assetType: "icons",
          page: 1,
          perPage: 30,
          sort: "featured",
          price: "all",
          view: "item",
        },
      });

      expect(store.results).toEqual(mockData);

      expect(store.totalItems).toBe(mockTotal);
    });

    it("appends results when page > 1", async () => {
      const store = useSearchStore();
      const initialData = [{ id: "a" }];
      const newData = [{ id: "b" }, { id: "c" }];
      const initialTotal = 10;
      const newTotal = 25;

      await setupStoreWithResults(store, initialData, initialTotal);
      expect(store.results).toEqual(initialData);
      expect(store.totalItems).toBe(initialTotal);

      vi.mocked($fetch).mockResolvedValueOnce({
        status: "success",
        response: { items: { data: newData, total: newTotal } },
      });

      await store.fetchResults("icons", { page: 2 });

      expect($fetch).toHaveBeenCalledTimes(2);
      expect($fetch).toHaveBeenLastCalledWith("/api/search", {
        params: expect.objectContaining({ page: 2 }),
      });

      expect(store.results).toEqual([...initialData, ...newData]);
      expect(store.totalItems).toBe(newTotal);
      expect(store.isLoading).toBe(false);
    });

    it("handles API error response", async () => {
      const store = useSearchStore();
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const errorMessage = "API failed";
      vi.mocked($fetch).mockResolvedValueOnce({
        status: "error",
        message: errorMessage,
      });

      await expect(store.fetchResults("icons")).rejects.toThrow(errorMessage);

      expect(store.isLoading).toBe(false);
      expect(store.results).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it("handles network/fetch error", async () => {
      const store = useSearchStore();
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const error = new Error("Network failed");
      vi.mocked($fetch).mockRejectedValueOnce(error);

      await expect(store.fetchResults("icons")).rejects.toThrow(
        "Network failed"
      );

      expect(store.isLoading).toBe(false);
      expect(store.results).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching results:",
        error
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("updateAssetType action", () => {
    it("updates filter and triggers API call with correct params", async () => {
      const store = useSearchStore();

      vi.mocked($fetch).mockResolvedValueOnce({
        status: "success",
        response: { items: { data: [{ id: "test" }], total: 1 } },
      });

      await store.updateAssetType("illustrations");

      expect(store.filters.assetType).toBe("illustrations");

      expect($fetch).toHaveBeenCalledTimes(1);
      expect($fetch).toHaveBeenCalledWith("/api/search", {
        params: expect.objectContaining({
          assetType: "illustrations",
        }),
      });
    });
  });

  describe("resetFilters action", () => {
    it("resets filters to defaults and triggers API call", async () => {
      const store = useSearchStore();

      store.filters.exclusive = true;
      store.filters.assetType = "icons";
      store.filters.sortBy = "popular";

      vi.mocked($fetch).mockResolvedValueOnce({
        status: "success",
        response: { items: { data: [], total: 0 } },
      });

      await store.resetFilters();

      expect(store.filters).toEqual({
        exclusive: false,
        price: "all",
        assetType: "all-assets",
        view: "item",
        sortBy: "relevant",
      });

      expect($fetch).toHaveBeenCalledTimes(1);
      expect($fetch).toHaveBeenCalledWith("/api/search", {
        params: expect.objectContaining({
          assetType: "all-assets",
        }),
      });
    });
  });
});
