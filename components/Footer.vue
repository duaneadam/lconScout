<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const countries = [
  "United States",
  "Canada",
  "Singapore",
  "South Korea",
  "United Kingdom",
  "China",
  "France",
  "Maldives",
  "Netherlands",
  "Kazakhstan",
  "Turkey",
  "Ukraine",
  "Vietnam",
  "India",
];

const currentCountry = ref(countries[0]);
let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  let index = 0;
  intervalId = setInterval(() => {
    index = (index + 1) % countries.length;
    currentCountry.value = countries[index];
  }, 2000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <footer class="footer">
    <div class="footer__content">
      <div class="container py-5">
        <div class="row">
          <div class="col-6 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Design Assets</h5>
            <ul class="footer__list list-unstyled">
              <li>
                <NuxtLink to="/3d-illustrations" class="footer__link"
                  >3D Illustrations</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/lottie-animations" class="footer__link"
                  >Lottie Animations</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/illustrations" class="footer__link"
                  >Illustrations</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/illustration-kit" class="footer__link"
                  >Illustration Kit</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/icons" class="footer__link">Icons</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/unicons" class="footer__link">Unicons</NuxtLink>
              </li>
            </ul>
          </div>

          <div class="col-6 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Tools</h5>
            <ul class="footer__list list-unstyled">
              <li>
                <NuxtLink to="/illustration-kit" class="footer__link"
                  >Illustration Kit</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/gltf-3d-editor" class="footer__link"
                  >GLTF 3D Editor</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/svg-editor" class="footer__link"
                  >SVG Editor</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/converter/svg-to-png" class="footer__link"
                  >SVG to PNG</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/ai/illustration-generator" class="footer__link"
                  >AI Illustration Generator</NuxtLink
                >
              </li>
              <li><NuxtLink to="/api" class="footer__link">API</NuxtLink></li>
            </ul>
          </div>

          <div class="col-6 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Plugins & Apps</h5>
            <ul class="footer__list list-unstyled">
              <li>
                <NuxtLink to="/plugins/for-figma" class="footer__link"
                  >Figma Plugin</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/plugins/iconscout-for-canva" class="footer__link"
                  >Canva Plugin</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/plugins/for-powerpoint" class="footer__link"
                  >PowerPoint Plugin</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/desktop-app/for-mac" class="footer__link"
                  >Mac App</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/desktop-app/for-windows" class="footer__link"
                  >Windows App</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div class="col-6 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Company</h5>
            <ul class="footer__list list-unstyled">
              <li><NuxtLink to="/blog" class="footer__link">Blog</NuxtLink></li>
              <li>
                <NuxtLink to="/become-contributor" class="footer__link"
                  >Sell on IconScout</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/legal/terms-of-use" class="footer__link"
                  >Terms of Use</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/legal/privacy-policy" class="footer__link"
                  >Privacy Policy</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/legal/contributor-terms" class="footer__link"
                  >Contributor Terms</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/licenses" class="footer__link"
                  >Licenses</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__copyright">
      <div class="container py-5-5">
        <div class="row no-gutters justify-content-between text-secondary">
          <div
            class="d-flex align-items-center overflow-hidden mb-2-5 col-12 col-sm-7 mb-sm-0"
          >
            <div>
              <div class="secondary-muted font-size-sm">
                © {{ new Date().getFullYear() }} Design Barn Inc. Made with
                <span slot="love" class="text-danger heartIcon_gdRFl"
                  ><svg
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="ui-svg-inline"
                  >
                    <path
                      d="M20.8,5.7c-2.1-2.8-6-3.4-8.8-1.3C9.5,2.5,6,2.8,3.8,5c-2.4,2.4-2.5,6.4,0,8.9l6.2,6.2c0.5,0.5,1.2,0.8,1.9,0.8c0.7,0,1.4-0.3,1.9-0.8l6.2-6.2C22.4,11.6,22.6,8.2,20.8,5.7z"
                    ></path></svg
                ></span>
                from
                <span class="country-rotator">
                  <transition name="fade" mode="out-in">
                    <span :key="currentCountry">{{ currentCountry }}</span>
                  </transition>
                </span>
              </div>
            </div>
          </div>
          <div
            class="d-flex align-items-center justify-content-start font-size-sm col-12 col-sm-5 justify-content-sm-end"
          >
            <span class="d-flex align-items-center"
              ><svg
                width="22"
                height="22"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="ui-svg-inline text-warning"
              >
                <path
                  d="M17,9V7c0-2.8-2.2-5-5-5S7,4.2,7,7v2c-1.7,0-3,1.3-3,3v7c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3v-7C20,10.3,18.7,9,17,9z M9,7c0-1.7,1.3-3,3-3s3,1.3,3,3v2H9V7z"
                ></path>
              </svg>
              <i class="ml-2 text-muted text-nowrap">Secure Payment</i>
              <img
                src="https://cdna.iconscout.com/img/stripe.4a3c31e.svg"
                alt="Stripe"
            /></span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background-color: #f5f6fa;

  &__content {
    border-bottom: 1px solid #ebedf5;
  }

  &__copyright {
    background-color: #ebedf5;
  }

  &__heading {
    color: var(--dark);
    font-weight: 600;
    font-size: 1rem;
  }

  &__list {
    margin: 0;
    padding: 0;
  }

  &__link {
    color: var(--secondary);
    text-decoration: none;
    display: inline-block;
    padding: 0.25rem 0;
    font-size: 0.875rem;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary);
      text-decoration: none;
    }
  }
}

.country-rotator {
  display: inline-block;
  min-width: 80px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
