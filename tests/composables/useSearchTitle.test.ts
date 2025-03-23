describe("useSearchTitle", () => {
  it("should compute with totalItems more than 3 digits", () => {
    const searchQuery = ref("");
    const totalItems = ref(1000);
    const assetType = "Icons";

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("1,000 Icons");
  });

  it("should compute title correctly with string assetType and no search query", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const assetType = "Icons";

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("100 Icons");
  });

  it("should compute title correctly with string assetType and search query", () => {
    const searchQuery = ref("arrow");
    const totalItems = ref(50);
    const assetType = "Icons";

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("50 arrow Icons");
  });

  it("should compute title correctly with Ref<string> assetType and no search query", () => {
    const searchQuery = ref("");
    const totalItems = ref(200);
    const assetType = ref("Illustrations");

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("200 Illustrations");
  });

  it("should compute title correctly with Ref<string> assetType and search query", () => {
    const searchQuery = ref("landscape");
    const totalItems = ref(25);
    const assetType = ref("Illustrations");

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(title.value).toBe("25 landscape Illustrations");
  });

  // Test subtitle computation
  it("should compute subtitle correctly with string assetType", () => {
    const searchQuery = ref("");
    const totalItems = ref(150);
    const assetType = "Icons";

    const { subtitle } = useSearchTitle(searchQuery, totalItems, assetType);

    expect(subtitle.value).toBe(
      "150 Icons exclusively selected by our designer community."
    );
  });

  it("should compute subtitle correctly with Ref<string> assetType", () => {
    const searchQuery = ref("");
    const totalItems = ref(75);
    const assetType = ref("3D Illustrations");

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
    const assetType = "Icons";

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);
    expect(title.value).toBe("100 Icons");

    totalItems.value = 200;
    expect(title.value).toBe("200 Icons");
  });

  it("should update title when Ref<string> assetType changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const assetType = ref("Icons");

    const { title } = useSearchTitle(searchQuery, totalItems, assetType);
    expect(title.value).toBe("100 Icons");

    assetType.value = "Illustration";
    expect(title.value).toBe("100 Illustration");
  });

  // TODO: Might need to add test for single result for an asset type,
  // unlikely to happen though. This is because we pass plural asset type.
});
