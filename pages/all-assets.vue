<template>
  <SearchLayout card-variant="default" />
</template>

<script setup lang="ts">
const searchStore = useSearchStore();
const { query, apiTotalItems } = storeToRefs(searchStore);

await useAsyncData("search-init", () => searchStore.initializeFromRoute());

// SEO Meta Tags - Use computed refs from the store
// TODO: Learn how to test this, this broke multiple times when we changed totalItems
useHead({
  title: computed(
    () =>
      `${formatNumber(apiTotalItems.value)} ${
        query.value ? capitalizeWords(query.value) + " " : ""
      }Design Assets - Icons, Illustrations, 3D & Lottie | IconScout`
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `Download ${formatNumber(apiTotalItems.value)} ${
            query.value ? capitalizeWords(query.value) + " " : ""
          }premium & free Assets for commercial and personal use. Available as Icons, Illustrations, 3D Illustrations, and Lottie Animations.` // More generic description
      ),
    },
  ],
});
</script>
