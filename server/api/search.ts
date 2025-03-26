export default defineEventHandler(async (event) => {
  const {
    query,
    assetType,
    page,
    perPage,
    sort,
    color,
    style,
    license,
    format,
    category,
    subcategory,
    tag,
    price,
    view,
    exclude,
  } = getQuery(event);

  if (!assetType) {
    return {
      status: "error",
      message: "Asset type is required",
    };
  }

  // Add early return for blank query
  if (!query || query.toString().trim() === "") {
    return {
      status: "error",
      message: "Search query is required",
    };
  }

  let normalizedAssetType = assetType.toString();

  switch (normalizedAssetType) {
    case "icons":
      normalizedAssetType = "icon";
      break;
    case "3d-illustrations":
      normalizedAssetType = "3d";
      break;
    case "lottie-animations":
      normalizedAssetType = "lottie";
      break;
    case "illustrations":
      normalizedAssetType = "illustration";
      break;
    case "all-assets":
      normalizedAssetType = "icon";
      break;
  }

  const apiUrl = new URL("https://api.iconscout.com/v2/search");

  apiUrl.searchParams.append("query", query.toString().trim());

  // Required parameters
  apiUrl.searchParams.append("product_type", view || "item");
  apiUrl.searchParams.append("asset", normalizedAssetType.toString());
  apiUrl.searchParams.append("per_page", perPage?.toString() || "30");
  apiUrl.searchParams.append("page", page?.toString() || "1");
  apiUrl.searchParams.append("sort", sort?.toString() || "relevant");

  // Always set price=free for Lottie animations else there is no .json or .lottie
  if (normalizedAssetType === "lottie") {
    apiUrl.searchParams.append("price", "free");
  } else if (price && price.toString() !== "all") {
    apiUrl.searchParams.append("price", price.toString());
  }

  if (color) {
    apiUrl.searchParams.append("color", color.toString().replace("#", ""));
  }

  if (style) {
    apiUrl.searchParams.append("style", style.toString());
  }

  if (license) {
    apiUrl.searchParams.append("license", license.toString());
  }

  if (format) {
    apiUrl.searchParams.append("format", format.toString());
  }

  if (category) {
    apiUrl.searchParams.append("category", category.toString());
  }

  if (subcategory) {
    apiUrl.searchParams.append("subcategory", subcategory.toString());
  }

  if (tag) {
    apiUrl.searchParams.append("tag", tag.toString());
  }

  // Handle the exclude parameter (IconScout Exclusive)
  if (exclude && exclude.toString() === "true") {
    apiUrl.searchParams.append("iconscout_exclusive", "true");
  }

  try {
    const clientId = process.env.NUXT_PUBLIC_ICONSCOUT_CLIENT_ID;

    if (!clientId) {
      console.error(
        "NUXT_PUBLIC_ICONSCOUT_CLIENT_ID is not defined in environment variables"
      );
      return {
        status: "error",
        message: "Client ID not configured",
      };
    }

    apiUrl.searchParams.append("client_id", clientId);

    console.info("Making request to IconScout API:", apiUrl.toString());

    // Make request to IconScout API
    const response = await fetch(apiUrl.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching from IconScout API:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
});
