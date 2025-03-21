<template>
  <main class="error-page">
    <div class="container text-center">
      <h1 class="mb-3">Oops, Page not found!</h1>
      <p class="lead text-secondary mb-6">
        Nobody's here! Are you looking for me?
      </p>
      <p class="mb-0">
        Go to
        <NuxtLink to="/" class="text-decoration-none">Home Page</NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
defineProps({
  error: Object,
});

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
