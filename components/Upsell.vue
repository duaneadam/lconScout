<template>
  <div class="upsell">
    <div class="col-md-8 col-lg-6">
      <h2 class="fw-bold mb-4 w-100">View all Limit 3D Illustrations</h2>

      <b-button class="btn-primary py-3 mb-3" size="lg">
        Get Started - It's Free
      </b-button>

      <p class="mt-3">
        Already have an account?
        <NuxtLink to="/login" class="text-decoration-none login-link"
          >Log In</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
.upsell {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 402px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.9) 21.98%,
    rgba(255, 255, 255, 0.99) 100%
  );
}
</style>
