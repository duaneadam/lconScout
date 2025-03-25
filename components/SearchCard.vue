<template>
  <article
    class="search-card"
    :class="{
      'search-card--square': variant === 'square',
      'search-card--skeleton': skeleton,
    }"
  >
    <div v-if="!skeleton" class="search-card__thumbnail">
      <div class="search-card__image-wrapper">
        <img
          :src="getImageUrl()"
          :alt="icon?.name"
          class="search-card__image"
        />
      </div>
    </div>
    <!-- Add this placeholder div when in skeleton state -->
    <div
      v-else
      class="search-card__thumbnail search-card__thumbnail--skeleton"
    ></div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: {
    id: number;
    uuid: string;
    asset: string;
    name: string;
    slug: string;
    price: number;
    urls: {
      png_64: string;
      png_128: string;
      png_256: string;
      thumb?: string;
    };
    color_codes: Array<{
      decimal_color: number;
      color_id: number;
    }>;
  };
  variant?: "default" | "square";
  skeleton?: boolean;
}>();

// Set default variant if not provided
const variant = props.variant || "default";

// Get the appropriate image URL based on asset type
const getImageUrl = () => {
  if (!props.icon) return "";

  // Handle 3D assets which use the 'thumb' property
  if (props.icon.asset === "3d" && props.icon.urls.thumb) {
    return props.icon.urls.thumb;
  }

  // Handle regular icons which use png_128
  if (props.icon.urls.png_128) {
    return props.icon.urls.png_128;
  }

  // Fallback to any available image URL
  return (
    props.icon.urls.thumb || props.icon.urls.png_64 || props.icon.urls.png_256
  );
};
</script>

<style scoped lang="scss">
.search-card {
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

  &__thumbnail {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &--skeleton {
      /* Additional styles for skeleton thumbnail if needed */
    }
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
