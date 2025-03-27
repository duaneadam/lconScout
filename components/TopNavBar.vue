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
      <NuxtLink to="/" class="me-7b">
        <img src="/images/iconscout-logo.svg" alt="IconScout" height="30" />
      </NuxtLink>

      <div class="navbar__search me-7b">
        <div class="input-group align-items-center">
          <BDropdown
            :text="displayAssetType"
            toggle-class="border-0 bg-transparent text-dark fw-bold d-flex align-items-center"
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

          <input
            type="search"
            class="form-control"
            placeholder="Search from 8 Million+ assets"
            aria-label="Search assets"
            v-model="searchInput"
            @keyup.enter="performSearch"
          />

          <button class="image-button" type="button" @click="triggerFileUpload">
            <Unicon name="image" />
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

      <div class="navbar__links d-flex align-items-center">
        <BNavItemDropdown
          id="my-nav-dropdown"
          text="Explore"
          toggle-class="nav-link-custom"
          right
        >
          <BDropdownItem>One</BDropdownItem>
          <BDropdownItem>Two</BDropdownItem>
          <BDropdownDivider />
          <BDropdownItem>Three</BDropdownItem>
        </BNavItemDropdown>

        <BNavItemDropdown
          id="my-nav-dropdown"
          text="Tools"
          toggle-class="nav-link-custom"
          right
        >
          <BDropdownItem>One</BDropdownItem>
          <BDropdownItem>Two</BDropdownItem>
          <BDropdownDivider />
          <BDropdownItem>Three</BDropdownItem>
        </BNavItemDropdown>

        <a href="#" class="nav-item">All Features</a>

        <a href="#" class="nav-item">Free Asset</a>
      </div>

      <div class="navbar__auth-buttons ms-auto">
        <BButton
          variant="outline-secondary"
          class="me-3b text-black auth-button"
          >Login</BButton
        >
        <BButton variant="primary" class="auth-button text-white"
          >Signup</BButton
        >
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

  &__search {
    border-radius: 12px;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    background-color: #ebedf5;
    width: 100%;
    max-width: 360px;
    height: 46px;

    input {
      background-color: #ebedf5;
      border: none;
      border-left: 1px solid #b4bad6;
      height: 1.5rem;
    }
  }

  &__links {
    .nav-item {
      color: black;
      text-decoration: none;
      margin-right: 1rem;
      list-style: none;
    }
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

button.image-button {
  border: none;
  outline: none;
  background-color: white;
  border: none;
  width: 36px;
  height: 36px;
  margin-right: 0.5rem;
  border-radius: 12px !important;
}

.auth-button {
  width: 5.75rem;
  height: 2.75rem;
  border: 1px solid #d8dbeb;
  border-radius: 2rem;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
}

.auth-button.btn-outline-secondary {
  &:hover {
    background-color: #d8dbeb;
  }
}
</style>
