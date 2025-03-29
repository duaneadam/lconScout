// SearchHeader.vue
<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <header class="text-start px-10b py-4">
    <h2 class="fw-bold text-capitalize">{{ title }}</h2>
    <p class="text-gray">{{ subtitle }}</p>
  </header>
</template>
