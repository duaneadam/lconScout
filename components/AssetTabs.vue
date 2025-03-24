<template>
  <div class="asset-tabs">
    <b-nav tabs class="border-bottom mb-4">
      <b-nav-item
        :to="'/all-assets' + (searchQuery ? `/${searchQuery}` : '')"
        :active="currentPath.includes('/all-assets')"
      >
        All Assets
      </b-nav-item>
      <b-nav-item
        :to="'/3d-illustrations' + (searchQuery ? `/${searchQuery}` : '')"
        :active="currentPath.includes('/3d-illustrations')"
      >
        3D Illustrations
      </b-nav-item>
      <b-nav-item
        :to="'/lottie-animations' + (searchQuery ? `/${searchQuery}` : '')"
        :active="currentPath.includes('/lottie-animations')"
      >
        Lottie Animations
      </b-nav-item>
      <b-nav-item
        :to="'/illustrations' + (searchQuery ? `/${searchQuery}` : '')"
        :active="currentPath.includes('/illustrations')"
      >
        Illustrations
      </b-nav-item>
      <b-nav-item
        :to="'/icons' + (searchQuery ? `/${searchQuery}` : '')"
        :active="currentPath.includes('/icons')"
      >
        Icons
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const currentPath = computed(() => route.path);
const searchQuery = computed(() => {
  if (route.params.query) {
    return route.params.query as string;
  }
  return "";
});

const currentAssetType = computed(() => {
  if (currentPath.value.includes("/icons")) return "icons";
  if (currentPath.value.includes("/illustrations")) return "illustrations";
  if (currentPath.value.includes("/3d-illustrations"))
    return "3d-illustrations";
  if (currentPath.value.includes("/lottie-animations"))
    return "lottie-animations";
  if (currentPath.value.includes("/all-assets")) return "all-assets";
  return "all-assets";
});

const emit = defineEmits<{
  (e: "asset-type-changed", assetType: string): void;
}>();

onMounted(() => {
  emit("asset-type-changed", currentAssetType.value);
});

watch(currentAssetType, (newAssetType) => {
  emit("asset-type-changed", newAssetType);
});
</script>

<style scoped>
.asset-tabs {
  width: 100%;
}
</style>
