<template>
  <div class="asset-section">
    <h3 class="mb-6b">{{ title }}</h3>
    <div class="mb-6b" v-if="loading">
      <div :class="['row', gridClass, 'g-3b']">
        <div
          v-for="n in title === 'Icons' ? 30 : 15"
          :key="`skel-${title}-${n}`"
          class="col"
        >
          <SearchCard
            skeleton
            :variant="cardVariant"
            :lottiePlayerType="lottiePlayerType"
          />
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center p-3 border rounded bg-light">
      <p class="text-danger mb-2">Error loading {{ title }}: {{ error }}</p>
      <BButton variant="outline-primary" size="sm" @click="$emit('retry')">
        Retry
      </BButton>
    </div>

    <!-- No Results -->
    <div
      v-else-if="results.length === 0"
      class="text-center p-3 border rounded bg-light mb-6b"
    >
      <span>No {{ title }} found for this query.</span>
    </div>

    <div v-else :class="['row', gridClass, 'g-3b']">
      <div v-for="(asset, index) in results" :key="asset.uuid" class="col">
        <SearchCard
          :asset="asset"
          :variant="cardVariant"
          :lottiePlayerType="lottiePlayerType"
          :is-last-in-section="index === results.length - 1"
        />
      </div>

      <div class="py-3b"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Asset = {
  uuid: string;
};

defineProps<{
  title: string;
  results: Asset[];
  loading: boolean;
  error: string | null;
  gridClass: string;
  cardVariant: "default" | "square";
  lottiePlayerType: "dotlottie" | "lottiejson";
}>();

defineEmits<{
  (e: "retry"): void;
}>();
</script>

<style scoped>
.asset-section h3 {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>
