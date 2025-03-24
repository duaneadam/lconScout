<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
    <div class="container">
      <NuxtLink to="/" class="navbar-brand">
        <img src="/images/iconscout-logo.svg" alt="IconScout" height="30" />
      </NuxtLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <!-- Global Search -->
        <div class="container">
          <div class="search-container bg-light rounded p-2b">
            <div class="input-group">
              <!-- Dropdown button -->
              <div class="dropdown">
                <button
                  class="btn dropdown-toggle fw-bold text-dark border-0 bg-transparent"
                  type="button"
                  id="categoryDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  3D
                </button>
                <ul class="dropdown-menu" aria-labelledby="categoryDropdown">
                  <li><a class="dropdown-item" href="#">3D Models</a></li>
                  <li><a class="dropdown-item" href="#">2D Assets</a></li>
                  <li><a class="dropdown-item" href="#">Textures</a></li>
                  <li><a class="dropdown-item" href="#">Audio</a></li>
                </ul>
              </div>

              <!-- Divider -->
              <div class="vr my-2 mx-2"></div>

              <!-- Search input -->
              <input
                type="search"
                class="form-control border-0 bg-transparent shadow-none h-100"
                placeholder="Search from 8 Million+ assets"
                aria-label="Search assets"
              />

              <!-- Camera icon button -->
              <button
                class="btn btn-outline-secondary border-0 rounded-circle bg-white p-2 me-2"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-camera"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"
                  />
                  <path
                    d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const searchQuery = ref("");
const showAssetTypeDropdown = ref(false);

// Function to determine asset type from route path
const getAssetTypeFromRoute = (path: string): string => {
  if (path.includes("/icons")) return "icons";
  else if (path.includes("/illustrations")) return "illustrations";
  else if (path.includes("/3d-illustrations")) return "3d-illustrations";
  else if (path.includes("/lottie-animations")) return "lottie-animations";
  else return "all-assets";
};

// Use the search filter composable
const initialAssetType = getAssetTypeFromRoute(route.path);
const { currentAssetType, humanizeAssetType } =
  useSearchFilter(initialAssetType);

// Watch for route changes to update the asset type
watch(
  () => route.path,
  (newPath) => {
    currentAssetType.value = getAssetTypeFromRoute(newPath);
  }
);

// Function to select asset type from dropdown
const selectAssetType = (assetType: string) => {
  currentAssetType.value = assetType;
  // Navigate to the selected asset type page
  router.push(`/${assetType}`);
};

// Perform search based on the current asset type
const performSearch = () => {
  if (searchQuery.value.trim()) {
    const basePath = `/${currentAssetType.value}`;
    const query = encodeURIComponent(searchQuery.value.trim());
    router.push(`${basePath}/${query}`);
  }
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".asset-type-dropdown")) {
      showAssetTypeDropdown.value = false;
    }
  });
});
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-container {
  background-color: #f0f2f7 !important;
  max-width: 900px;
  height: 46px;
  margin: 0 auto;
}

.form-control:focus {
  box-shadow: none;
}

.dropdown-toggle::after {
  margin-left: 0.5em;
}

.dropdown-toggle {
  font-size: 1.1rem;
}

.vr {
  opacity: 0.2;
}
</style>
