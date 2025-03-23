describe("useSearchTitle", () => {
  // Test with string assetType
  it("should compute title correctly with string assetType and no search query", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const assetType = "Icon";

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("100 Icon");
  });

  it("should compute title correctly with string assetType and search query", () => {
    const searchQuery = ref("arrow");
    const totalItems = ref(50);
    const assetType = "Icon";

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("50 arrow Icon");
  });

  it("should compute title correctly with Ref<string> assetType and no search query", () => {
    const searchQuery = ref("");
    const totalItems = ref(200);
    const assetType = ref("Illustration");

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("200 Illustration");
  });

  it("should compute title correctly with Ref<string> assetType and search query", () => {
    const searchQuery = ref("landscape");
    const totalItems = ref(25);
    const assetType = ref("Illustration");

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("25 landscape Illustration");
  });

  // Test subtitle computation
  it("should compute subtitle correctly with string assetType", () => {
    const searchQuery = ref("");
    const totalItems = ref(150);
    const assetType = "Icon";

    const { subtitle } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(subtitle.value).toBe(
      "150 Icons exclusively selected by our designer community."
    );
  });

  it("should compute subtitle correctly with Ref<string> assetType", () => {
    const searchQuery = ref("");
    const totalItems = ref(75);
    const assetType = ref("3D Illustration");

    const { subtitle } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(subtitle.value).toBe(
      "75 3D Illustrations exclusively selected by our designer community."
    );
  });

  // Test reactivity
  it("should update title when searchQuery changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const assetType = "Icon";

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);
    expect(title.value).toBe("100 Icon");

    searchQuery.value = "arrow";
    expect(title.value).toBe("100 arrow Icon");
  });

  it("should update title when totalItems changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const assetType = "Icon";

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);
    expect(title.value).toBe("100 Icon");

    totalItems.value = 200;
    expect(title.value).toBe("200 Icon");
  });

  it("should update title when Ref<string> assetType changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const assetType = ref("Icon");

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);
    expect(title.value).toBe("100 Icon");

    assetType.value = "Illustration";
    expect(title.value).toBe("100 Illustration");
  });
});
