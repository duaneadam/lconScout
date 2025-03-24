import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const { query, assetType, page, perPage, sort } = getQuery(event);

  if (!assetType) {
    return {
      status: "error",
      message: "Asset type is required",
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

  const apiUrl = new URL("https://api.iconscout.com/v3/search");

  console.log("Raw query parameter:", query);
  console.log("Asset type parameter:", assetType);

  // Handle query parameter - avoid using asset type as query (NOT SUPPORTED BY API)
  if (query !== undefined && query !== null && query.toString().trim() !== "") {
    // If query exists, use it
    apiUrl.searchParams.append("query", query.toString().trim());
    console.log("Using search query:", query.toString().trim());
  } else {
    apiUrl.searchParams.append("query", "");
    console.error("No query provided");
  }
  apiUrl.searchParams.append("product_type", "item");
  apiUrl.searchParams.append("asset", normalizedAssetType.toString());
  apiUrl.searchParams.append("per_page", perPage?.toString() || "30");
  apiUrl.searchParams.append("page", page?.toString() || "1");
  apiUrl.searchParams.append("sort", sort?.toString() || "relevant");

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

    console.log("Making request to IconScout API:", apiUrl.toString());

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
