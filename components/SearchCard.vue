<template>
  <article
    class="search-card"
    :class="{
      'search-card--square': variant === 'square',
      'search-card--skeleton': skeleton,
      'search-card--withOverlay': withOverlay,
    }"
  >
    <div class="search-card__overlay">
      <span class="search-card__overlay-text">View more</span>
    </div>

    <div v-if="!skeleton" class="search-card__thumbnail">
      <div class="search-card__image-wrapper">
        <template v-if="asset?.asset === 'lottie'">
          <!-- DotLottieVue player -->
          <DotLottieVue
            v-if="lottiePlayerType === 'dotlottie'"
            ref="dotLottiePlayer"
            :src="lottieUrl"
            :autoplay="true"
            :loop="true"
            :playOnHover="false"
            class="search-card__lottie"
          />
          <!-- end DotLottieVue player -->

          <!-- LottiePlayer component -->
          <lottie-player
            v-else
            ref="lottieFilesPlayer"
            :src="lottieUrl"
            background="transparent"
            speed="1"
            style="width: 100%; height: 100%"
            loop
            autoplay
            class="search-card__lottie"
          ></lottie-player>
        </template>

        <!-- For other asset types or fallback -->
        <img
          v-else
          :src="imageUrl"
          :alt="asset?.name"
          class="search-card__image"
        />
      </div>
    </div>

    <div
      v-else
      class="search-card__thumbnail search-card__thumbnail--skeleton"
    ></div>
  </article>
</template>

<script setup lang="ts">
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const props = defineProps<{
  asset?: {
    id: number;
    uuid: string;
    asset: string;
    name: string;
    slug: string;
    identifier: string;
    price: number;
    urls: {
      thumb?: string;
      png_64?: string;
      png_128?: string;
      png_256?: string;
      preview_image?: string;
      lottie?: string;
      original?: string;
      json?: string;
    };
    color_codes: Array<{
      decimal_color: number;
      color_id: number;
    }>;
    is_premium: boolean;
    payable_price: number;
    formats: Array<{
      id: number;
      name: string;
      mime_type: string;
    }>;
    additional_informations?: {
      preview_frame?: number;
      frame_rate?: number;
      total_frames?: number;
    };
  };
  variant?: "default" | "square";
  skeleton?: boolean;
  withOverlay?: boolean;
  lottiePlayerType: "dotlottie" | "lottiefiles";
}>();

const dotLottiePlayer = ref<InstanceType<typeof DotLottieVue> | null>(null);
const lottieFilesPlayer = ref<any>(null);

// Register the lottie-player web component on client-side only
onMounted(() => {
  if (typeof window !== "undefined" && !customElements.get("lottie-player")) {
    import("@lottiefiles/lottie-player");
  }
});

// Check if asset has Lottie format
const hasLottieFormat = (asset: typeof props.asset) => {
  return asset?.formats?.some(
    (format) => format.name === "lottie" || format.name === "json"
  );
};

// Get the image URL based on asset type
const imageUrl = computed(() => {
  if (!props.asset) return "";

  // For Lottie animations that can't be played
  if (props.asset.asset === "lottie" && props.asset.urls.preview_image) {
    return props.asset.urls.preview_image;
  }

  // For 3D assets
  if (props.asset.urls.thumb) {
    return props.asset.urls.thumb;
  }

  // For icons, use the largest available preview
  return (
    props.asset.urls.png_256 ||
    props.asset.urls.png_128 ||
    props.asset.urls.png_64 ||
    ""
  );
});

// Get the Lottie URL
const lottieUrl = computed(() => {
  if (!props.asset || props.asset.asset !== "lottie") return "";

  // For LottieFiles player, always use JSON format
  if (props.lottiePlayerType === "lottiefiles") {
    return props.asset.urls.original || "";
  }

  // For DotLottie player, prefer .lottie format but fallback to JSON if needed
  return props.asset.urls.lottie || props.asset.urls.original || "";
});
</script>

<style scoped lang="scss">
.search-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 100%;
  aspect-ratio: 4/3;
  background-color: #f8f9fa;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;

  &--withOverlay {
    .search-card__overlay {
      opacity: 1;
    }
  }

  &--square {
    aspect-ratio: 1/1;
  }

  &--skeleton {
    background: linear-gradient(90deg, #f8f9fa 25%, #e9ecef 37%, #f8f9fa 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
  }

  &--square.search-card--skeleton {
    aspect-ratio: 1/1;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 2;
  }

  &__overlay-text {
    color: white;
    font-size: 14px;
    font-weight: 500;
  }

  &__thumbnail {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  &__lottie {
    width: 100%;
    height: 100%;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
