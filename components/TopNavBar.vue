<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-6b">
    <NuxtLink to="/" class="navbar__brand">
      <img src="/images/iconscout-logo.svg" alt="IconScout" height="30" />
    </NuxtLink>

    <div class="navbar-collapse" id="navbarContent">
      <div class="navbar__search">
        <div class="input-group">
          <div class="dropdown">
            <button
              class="btn dropdown-toggle fw-bold text-dark border-0 bg-transparent"
              type="button"
              id="categoryDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ humanizedAssetType }}
            </button>
            <ul class="dropdown-menu" aria-labelledby="categoryDropdown">
              <li>
                <a class="dropdown-item" @click.prevent="selectAssetType('all-assets')">All Assets</a>
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="selectAssetType('3d-illustrations')">3D Models</a>
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="selectAssetType('illustrations')">2D Assets</a>
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="selectAssetType('icons')">Icons</a>
              </li>
            </ul>
          </div>

          <div class="vr my-2 mx-2"></div>

          <input
            type="search"
            class="form-control"
            placeholder="Search from 8 Million+ assets"
            aria-label="Search assets"
            v-model="searchInput"
            @keyup.enter="performSearch"
          />

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
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const searchInput = ref("");

const { filters, humanizedAssetType, query } = storeToRefs(useSearchStore());
const { updateQuery, updateAssetType } = useSearchStore();

// Initialize from route
onMounted(() => {
  if (route.params.query) {
    const decodedQuery = decodeURIComponent(route.params.query as string);
    updateQuery(decodedQuery);
    searchInput.value = decodedQuery;
  }
  
  if (route.params.assetType) {
    updateAssetType(route.params.assetType as string);
  }
});

// Watch for route changes
watch(() => route.params, (newParams) => {
  if (newParams.query) {
    const decodedQuery = decodeURIComponent(newParams.query as string);
    updateQuery(decodedQuery);
    searchInput.value = decodedQuery;
  } else {
    updateQuery("");
    searchInput.value = "";
  }
  
  if (newParams.assetType) {
    updateAssetType(newParams.assetType as string);
  }
}, { deep: true });

const selectAssetType = (assetType: string) => {
  const path = query.value ? `/${assetType}/${encodeURIComponent(query.value)}` : `/${assetType}`;
  router.push(path);
};

const performSearch = () => {
  const trimmedQuery = searchInput.value.trim();
  if (trimmedQuery) {
    const path = `/${filters.value.assetType}/${encodeURIComponent(trimmedQuery)}`;
    router.push(path);
  }
};
</script>

<style scoped lang="scss">
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;

  &__brand {
    margin-right: 1.75rem;
  }

  &__search {
    font-size: 0.875rem;
    background-color: #ebedf5;
    width: 100%;
    max-width: 360px;
    height: 46px;
  }

  &__search-button {
    width: 46px;
    height: 46px;
  }
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
