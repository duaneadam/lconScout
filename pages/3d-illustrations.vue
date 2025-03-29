// 3d-illustrations.vue
<template>
  <SearchLayout>
    <SearchResults :card-variant="cardVariant" />
  </SearchLayout>
</template>

<script setup lang="ts">
const searchStore = useSearchStore();
const { query, apiTotalItems, filters, humanizedAssetType } =
  storeToRefs(searchStore);

const cardVariant = computed(() =>
  filters.value.assetType === "icons" ? "square" : "default"
);

await useAsyncData("search-init", () => searchStore.initializeFromRoute());

// SEO Meta Tags - Use computed refs from the store
useHead({
  title: computed(
    () =>
      `${formatNumber(apiTotalItems.value)} ${
        query.value ? capitalizeWords(query.value) + " " : ""
      }${
        humanizedAssetType.value
      } - Free Download in PNG, BLEND, glTF | IconScout`
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `Free Download ${formatNumber(apiTotalItems.value)} ${
            query.value ? capitalizeWords(query.value) + " " : ""
          }${
            humanizedAssetType.value
          }  for your 3D projects & designs in Blender, Unreal Engine, Unity, Cinema 4D & more. Available in PNG, BLEND, glTF, C4D, OBJ, PSD or FBX formats for commercial and personal use..`
      ),
    },
    {
      name: "og:description",
      content: computed(
        () =>
          `Free Download ${formatNumber(apiTotalItems.value)} ${
            query.value ? capitalizeWords(query.value) + " " : ""
          }${
            humanizedAssetType.value
          }  for your 3D projects & designs in Blender, Unreal Engine, Unity, Cinema 4D & more. Available in PNG, BLEND, glTF, C4D, OBJ, PSD or FBX formats for commercial and personal use..`
      ),
    },
    {
      name: "twitter:description",
      content: computed(
        () =>
          `Free Download ${formatNumber(apiTotalItems.value)} ${
            query.value ? capitalizeWords(query.value) + " " : ""
          }${
            humanizedAssetType.value
          }  for your 3D projects & designs in Blender, Unreal Engine, Unity, Cinema 4D & more. Available in PNG, BLEND, glTF, C4D, OBJ, PSD or FBX formats for commercial and personal use..`
      ),
    },
  ],
});
</script>
