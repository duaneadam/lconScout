// composables/useUrlFilters.ts
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchStore, type SearchFilters } from "~/stores/search"; // Adjust path if needed

// This the mapping between store filter keys and URL param names
// Most are the same, except view and exclusive
const filterToParamMap: Record<keyof SearchFilters, string | null> = {
  price: "price",
  view: "product_type",
  sortBy: "sort",
  exclusive: "iconscout_exclusive",
  assetType: null, // Ensure assetType is explicitly mapped to null if not managed here
};

// Define default values that should NOT appear in the URL
// TODO: Find better way to set defaults in one place and have it reflect across store and here.
// Current implementation is very fragile and breaks easily
const defaultFilterValues: Partial<SearchFilters> = {
  price: "all",
  view: "item",
  sortBy: "featured",
  exclusive: false,
};

export function useUrlFilters() {
  const store = useSearchStore();
  const router = useRouter();
  const route = useRoute();

  // Function to update URL from store filters (Remains the same)
  const updateUrlFromFilters = (filters: SearchFilters) => {
    const currentQuery = { ...route.query };
    const newQuery: Record<string, string | undefined> = {};

    for (const key in filterToParamMap) {
      const filterKey = key as keyof SearchFilters;
      const paramName = filterToParamMap[filterKey];
      // Ensure default is looked up correctly
      const defaultValue = defaultFilterValues[filterKey];
      const currentValue = filters[filterKey];

      if (paramName) {
        if (filterKey === "exclusive") {
          newQuery[paramName] = currentValue ? "true" : undefined;
        } else if (currentValue !== defaultValue) {
          newQuery[paramName] = String(currentValue);
        } else {
          newQuery[paramName] = undefined;
        }
      }
    }

    const finalQuery = { ...currentQuery, ...newQuery };
    Object.keys(finalQuery).forEach(
      (key) => finalQuery[key] === undefined && delete finalQuery[key]
    );

    if (JSON.stringify(finalQuery) !== JSON.stringify(route.query)) {
      router.replace({ query: finalQuery });
    }
  };

  // --- MODIFIED Function ---
  // Function to update store filters based *only* on parameters PRESENT in the URL query
  const updateFiltersFromUrl = (query: typeof route.query) => {
    const currentFilters = store.filters; // Get current store state reference
    const updates: Partial<SearchFilters> = {}; // Object to collect changes based on URL params
    let hasUpdates = false; // Flag to check if any valid update is found

    for (const key in filterToParamMap) {
      const filterKey = key as keyof SearchFilters;
      const paramName = filterToParamMap[filterKey];

      // Skip filters that aren't mapped to URL parameters
      if (!paramName) continue;

      const valueFromQuery = query[paramName];
      const defaultValue = defaultFilterValues[filterKey]; // Needed for fallback/validation

      // Process only if the parameter exists in the current URL query
      if (valueFromQuery !== undefined) {
        let targetValue: any; // Variable to hold the validated value from the URL

        // Convert URL string value to the correct type and validate
        if (filterKey === "exclusive") {
          targetValue = valueFromQuery === "true";
        } else if (
          filterKey === "price" &&
          ["all", "free", "premium"].includes(valueFromQuery as string)
        ) {
          targetValue = valueFromQuery;
        } else if (
          filterKey === "view" &&
          ["item", "pack"].includes(valueFromQuery as string)
        ) {
          targetValue = valueFromQuery;
        } else if (
          filterKey === "sortBy" &&
          ["featured", "popular", "latest", "relevant"].includes(
            valueFromQuery as string
          )
        ) {
          // Note: Your original code didn't check 'featured'/'relevant' here, adding them for consistency
          targetValue = valueFromQuery;
        } else {
          // Invalid value found in the URL for this known parameter
          console.warn(
            `Invalid value "${valueFromQuery}" for URL parameter "${paramName}". Ignoring this parameter.`
          );
          // Skip to the next parameter, effectively ignoring the invalid one
          continue;
        }

        // If the validated value from the URL is different from the current store state,
        // stage this change in the 'updates' object.
        if (currentFilters[filterKey] !== targetValue) {
          updates[filterKey] = targetValue;
          hasUpdates = true; // Mark that we found at least one valid change
        }
      }
      // If valueFromQuery is undefined (parameter missing from URL), DO NOTHING
    }

    // If any valid updates were staged based on the URL parameters, apply them to the store.
    if (hasUpdates) {
      // Use $patch for efficient partial updates of the store state
      store.$patch({ filters: { ...currentFilters, ...updates } });
    }
  };

  // Watch store filters -> update URL
  watch(
    () => store.filters,
    (newFilters) => {
      updateUrlFromFilters(newFilters);
    },
    { deep: true }
  );

  // Watch route query -> update store filters
  watch(
    () => route.query,
    (newQuery) => {
      updateFiltersFromUrl(newQuery);
    },
    { immediate: true } // Important: Run immediately on component setup to initialize from URL
  );
}
