<template>
  <div class="upsell">
    <div class="col-md-8 col-lg-6">
      <h3 class="fw-bold mb-4 w-100">
        View all {{ query ? capitalizeWords(query) : "" }}
        {{ humanizedAssetType }}
      </h3>

      <BButton
        variant="primary"
        class="text-white px-10b py-3b"
        to="/get-started"
        router-component-name="NuxtLink"
      >
        Get Started - It's Free
      </BButton>

      <p class="mt-3">
        Already have an account?
        <NuxtLink to="/login" class="text-decoration-none text-primary"
          >Log In</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSearchStore } from "~/stores/search";
import { capitalizeWords } from "~/utils/string";

const { query, humanizedAssetType } = storeToRefs(useSearchStore());
</script>

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
  z-index: 30;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.9) 21.98%,
    rgba(255, 255, 255, 0.99) 100%
  );
}
</style>
