// AssetSection.vue
<template>
  <div class="asset-section py-3b">
    <h3 class="mb-6b">{{ title }}</h3>
    <!-- Loading State -->
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

    <!-- Error State -->
    <div v-else-if="error" class="text-center p-3 border rounded bg-light">
      <p class="text-danger mb-2">Error loading {{ title }}: {{ error }}</p>
      <BButton variant="outline-primary" size="sm" @click="$emit('retry')">
        Retry
      </BButton>
    </div>

    <!-- No Results (Check filtered results) -->
    <div
      v-else-if="filteredResults.length === 0"
      class="text-center p-3 border rounded bg-light mb-6b"
    >
      <span
        >No {{ isExclusive ? "exclusive " : "" }}{{ title.toLowerCase() }} found
        for this query.</span
      >
    </div>

    <!-- Results Grid (Use filtered results) -->
    <div v-else :class="['row', gridClass, 'g-3b']">
      <div
        v-for="(asset, index) in filteredResults"
        :key="asset.uuid"
        class="col"
      >
        <SearchCard
          :asset="asset"
          :variant="cardVariant"
          :lottiePlayerType="lottiePlayerType"
          :is-last-in-section="index === filteredResults.length - 1"
          :link-to="
            index === filteredResults.length - 1 ? viewAllLink : undefined
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Asset = {
  uuid: string;
  additional_informations?: {
    iconscout_exclusive?: boolean;
  };
};

const props = defineProps<{
  title: string;
  results: Asset[];
  loading: boolean;
  error: string | null;
  gridClass: string;
  cardVariant: "default" | "square";
  lottiePlayerType: "dotlottie" | "lottiejson";
  isExclusive: boolean;
  viewAllLink: string;
}>();

defineEmits<{
  (e: "retry"): void;
}>();

const filteredResults = computed(() => {
  if (!props.isExclusive) {
    return props.results;
  }

  return props.results.filter(
    (item) => item.additional_informations?.iconscout_exclusive === true
  );
});
</script>

<style scoped>
.asset-section h3 {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>
