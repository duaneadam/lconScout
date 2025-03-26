describe("useSearchTitle", () => {
  it("should compute with totalItems more than 3 digits", () => {
    const searchQuery = ref("");
    const totalItems = ref(1000);
    const totalExclusiveItems = ref(50);
    const assetType = ref("Icons");

    const { title } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );

    expect(title.value).toBe("1,000 Icons");
  });

  it("should compute title correctly with string assetType and no search query", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const totalExclusiveItems = ref(10);
    const assetType = ref("Icons");

    const { title } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );

    expect(title.value).toBe("100 Icons");
  });

  it("should compute title correctly with string assetType and search query", () => {
    const searchQuery = ref("arrow");
    const totalItems = ref(50);
    const totalExclusiveItems = ref(5);
    const assetType = ref("Icons");

    const { title } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );

    expect(title.value).toBe("50 arrow Icons");
  });

  it("should compute title correctly with Ref<string> assetType and no search query", () => {
    const searchQuery = ref("");
    const totalItems = ref(200);
    const totalExclusiveItems = ref(20);
    const assetType = ref("Illustrations");

    const { title } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );

    expect(title.value).toBe("200 Illustrations");
  });

  it("should compute title correctly with Ref<string> assetType and search query", () => {
    const searchQuery = ref("landscape");
    const totalItems = ref(25);
    const totalExclusiveItems = ref(3);
    const assetType = ref("Illustrations");

    const { title } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );

    expect(title.value).toBe("25 landscape Illustrations");
  });

  it("should compute subtitle correctly with string assetType", () => {
    const searchQuery = ref("");
    const totalItems = ref(150);
    const totalExclusiveItems = ref(30);
    const assetType = ref("Icons");

    const { subtitle } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );

    expect(subtitle.value).toBe(
      "30 Icons exclusively selected by our designer community."
    );
  });

  it("should compute subtitle correctly with Ref<string> assetType", () => {
    const searchQuery = ref("");
    const totalItems = ref(75);
    const totalExclusiveItems = ref(15);
    const assetType = ref("3D Illustrations");

    const { subtitle } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );

    expect(subtitle.value).toBe(
      "15 3D Illustrations exclusively selected by our designer community."
    );
  });

  it("should update title when searchQuery changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const totalExclusiveItems = ref(10);
    const assetType = ref("Icon");

    const { title } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );
    expect(title.value).toBe("100 Icon");

    searchQuery.value = "arrow";
    expect(title.value).toBe("100 arrow Icon");
  });

  it("should update title when totalItems changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const totalExclusiveItems = ref(10);
    const assetType = ref("Icons");

    const { title } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );
    expect(title.value).toBe("100 Icons");

    totalItems.value = 200;
    expect(title.value).toBe("200 Icons");
  });

  it("should update title when Ref<string> assetType changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const totalExclusiveItems = ref(10);
    const assetType = ref("Icons");

    const { title } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );
    expect(title.value).toBe("100 Icons");

    assetType.value = "Illustration";
    expect(title.value).toBe("100 Illustration");
  });

  it("should update subtitle when totalExclusiveItems changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const totalExclusiveItems = ref(10);
    const assetType = ref("Icons");

    const { subtitle } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );
    expect(subtitle.value).toBe(
      "10 Icons exclusively selected by our designer community."
    );

    totalExclusiveItems.value = 25;
    expect(subtitle.value).toBe(
      "25 Icons exclusively selected by our designer community."
    );
  });

  it("should update subtitle when Ref<string> assetType changes", () => {
    const searchQuery = ref("");
    const totalItems = ref(100);
    const totalExclusiveItems = ref(10);
    const assetType = ref("Icons");

    const { subtitle } = useSearchTitle(
      searchQuery,
      totalItems,
      totalExclusiveItems,
      assetType
    );
    expect(subtitle.value).toBe(
      "10 Icons exclusively selected by our designer community."
    );

    assetType.value = "Vectors";
    expect(subtitle.value).toBe(
      "10 Vectors exclusively selected by our designer community."
    );
  });
});
