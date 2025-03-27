<template>
  <div>
    <!-- Navbar placeholder to prevent layout jump when navbar becomes fixed -->
    <div
      v-if="isSticky"
      class="navbar-placeholder"
      :style="{ height: navbarHeight + 'px' }"
    ></div>

    <nav
      ref="navbarRef"
      class="navbar navbar-expand-lg navbar-light bg-white border-bottom px-6b"
      :class="{ 'is-sticky': isSticky }"
    >
      <NuxtLink to="/" class="navbar__brand">
        <img src="/images/iconscout-logo.svg" alt="IconScout" height="30" />
      </NuxtLink>

      <div class="navbar-collapse" id="navbarContent">
        <div class="navbar__search">
          <div class="input-group">
            <BDropdown
              :text="displayAssetType"
              class="border-0 fw-bold text-dark bg-transparent p-0"
              toggle-class="border-0 bg-transparent text-dark fw-bold"
            >
              <BDropdownItem @click="selectAssetType('all-assets')"
                >All</BDropdownItem
              >
              <BDropdownItem @click="selectAssetType('3d-illustrations')"
                >3D</BDropdownItem
              >
              <BDropdownItem @click="selectAssetType('lottie-animations')"
                >Animations</BDropdownItem
              >
              <BDropdownItem @click="selectAssetType('illustrations')"
                >Illustrations</BDropdownItem
              >
              <BDropdownItem @click="selectAssetType('icons')"
                >Icons</BDropdownItem
              >
            </BDropdown>

            <div class="my-2 mx-2"></div>

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
              @click="triggerFileUpload"
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
            <input
              ref="fileInput"
              type="file"
              class="d-none"
              accept="image/*"
              @change="handleFileSelected"
            />
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const searchInput = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

// Satet for navbar stickiness
const isSticky = ref(false);
const navbarRef = ref<HTMLElement | null>(null);
const navbarHeight = ref(0);
let navbarOffsetTop = 0;

const { filters, humanizedAssetType, query } = storeToRefs(useSearchStore());
const { updateQuery, updateAssetType } = useSearchStore();

// Local state for pending asset type selection (not applied until search)
const pendingAssetType = ref("");

const formatAssetTypeForDropdown = (assetType) => {
  switch (assetType) {
    case "all-assets":
      return "All";
    case "3d-illustrations":
      return "3D";
    case "lottie-animations":
      return "Animations";
    case "illustrations":
      return "Illustrations";
    case "icons":
      return "Icons";
    default:
      return "All";
  }
};

// Display text for dropdown - use pendingAssetType if set, otherwise use store value
const displayAssetType = computed(() => {
  if (pendingAssetType.value) {
    return formatAssetTypeForDropdown(pendingAssetType.value);
  }

  // Map the store's humanized asset type to our dropdown format
  if (humanizedAssetType.value === "All Assets") return "All";
  if (humanizedAssetType.value === "3D Illustrations") return "3D";
  if (humanizedAssetType.value === "Lottie Animations") return "Animations";
  if (humanizedAssetType.value === "Illustrations") return "Illustrations";
  if (humanizedAssetType.value === "Icons") return "Icons";

  return "All";
});

// Initialize from route and set up scroll observer
onMounted(() => {
  if (route.params.query) {
    const decodedQuery = decodeURIComponent(route.params.query as string);
    updateQuery(decodedQuery);
    searchInput.value = decodedQuery;
  }

  if (route.params.assetType) {
    updateAssetType(route.params.assetType as string);
  }

  // Set up sticky navbar
  if (navbarRef.value) {
    navbarHeight.value = navbarRef.value.offsetHeight;
    navbarOffsetTop = navbarRef.value.offsetTop;
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  // Make navbar sticky only after scrolling past its full height + offset
  if (window.scrollY > navbarOffsetTop + navbarHeight.value) {
    isSticky.value = true;
  } else {
    isSticky.value = false;
  }
};

// Watch for route changes to update the filter state
watch(
  () => route.params,
  (newParams) => {
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
      // Clear pending selection when route changes
      pendingAssetType.value = "";
    }
  },
  { deep: true }
);

const selectAssetType = (assetType: string) => {
  // Update the local pending asset type when dropdown selection changes
  pendingAssetType.value = assetType;
};

const performSearch = () => {
  const trimmedQuery = searchInput.value.trim();
  if (trimmedQuery) {
    // Use pending asset type if selected, otherwise use current filter value
    const assetType = pendingAssetType.value || filters.value.assetType;
    const path = `/${assetType}/${encodeURIComponent(trimmedQuery)}`;
    router.push(path);
    // Clear pending selection after navigation
    pendingAssetType.value = "";
  }
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (files && files.length > 0) {
    console.log("File selected:", files[0].name);
  }
};
</script>

<style scoped lang="scss">
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;

  &.is-sticky {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1030;
    width: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    animation: slideDown 0.4s forwards;
  }

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

.navbar-placeholder {
  width: 100%;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
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
</style>
