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
  <footer class="footer fs-sm">
    <header class="footer__header">
      <div class="container-lg px-10b px-lg-0 py-6b d-flex align-items-center">
        <NuxtImg
          src="/images/iconscout-logo.svg"
          alt="IconScout"
          class="footer__logo me-6b"
        />
        <span>Design Resource Marketplace</span>

        <div class="ms-auto">
          <span class="text-darkblue">5,663,871</span> graphic resources &
          counting
        </div>
      </div>

      <div class="container-lg px-10b px-lg-0">
        <div class="footer__header-line"></div>
      </div>
    </header>

    <div class="footer__content">
      <div class="container-lg px-10b px-lg-0 py-5">
        <div class="row row-cols-xl-5">
          <div class="col col-6 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Graphic Resources</h5>
            <ul class="footer__list list-unstyled">
              <li>
                <NuxtLink to="/free-icons" class="footer__link"
                  >Free Icons</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/free-emoji-icons" class="footer__link"
                  >Free Emoji Icons</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/free-logo-icons" class="footer__link"
                  >Free Logo Icons</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/ios-icons" class="footer__link"
                  >iOS Icons</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/sticker-icons" class="footer__link"
                  >Sticker Icons</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/gradient-icons" class="footer__link"
                  >Gradient Icons</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/curated-bundle" class="footer__link"
                  >Curated Bundle</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/calendar-of-festival" class="footer__link"
                  >Calendar of Festival</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/free-assets-of-the-day" class="footer__link"
                  >Free Assets of the day</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/explore-design-assets" class="footer__link"
                  >Explore Design Assets</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div class="col col-6 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Products</h5>
            <ul class="footer__list list-unstyled">
              <li>
                <NuxtLink to="/unicon-icon-font" class="footer__link"
                  >Unicon Icon Font</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/color-editor" class="footer__link"
                  >Color editor</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/apps-and-plugins" class="footer__link"
                  >Apps & Plugins</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/hire-designers" class="footer__link"
                  >Hire designers</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/api" class="footer__link"
                  >IconScout API</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/top-illustrations" class="footer__link"
                  >Top Illustrations</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/top-3d-assets" class="footer__link"
                  >Top 3D Assets</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/reverse-image-search" class="footer__link"
                  >Reverse Image Search</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/unicon-plugin-for-figma" class="footer__link"
                  >Unicon Plugin for Figma</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div class="col col-6 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Company</h5>
            <ul class="footer__list list-unstyled">
              <li>
                <NuxtLink to="/blog" class="footer__link">Blog</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/about" class="footer__link">About</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/access-features" class="footer__link"
                  >Access features</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/sell-on-iconscout" class="footer__link"
                  >Sell on IconScout</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/startup-program" class="footer__link"
                  >Startup program</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/were-hiring" class="footer__link"
                  >We're hiring</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div class="col col-6 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Legal</h5>
            <ul class="footer__list list-unstyled">
              <li>
                <NuxtLink to="/terms-of-use" class="footer__link"
                  >Terms of use</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/privacy-policy" class="footer__link"
                  >Privacy policy</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/license-agreement" class="footer__link"
                  >License agreement</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/contributor-terms" class="footer__link"
                  >Contributor terms</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/support-center" class="footer__link"
                  >Support center</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/join-discord-community" class="footer__link"
                  >Join discord community</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div class="col col-12 col-md-3 mb-4">
            <h5 class="footer__heading mb-3">Get IconScout for desktop</h5>
            <div class="footer__social-links mb-6b">
              <NuxtLink to="/download/mac">
                <client-only>
                  <unicon name="apple" class="me-1"></unicon>
                </client-only>
              </NuxtLink>
              <NuxtLink to="/download/windows">
                <client-only>
                  <unicon name="windows" class="me-1"></unicon>
                </client-only>
              </NuxtLink>
            </div>

            <h5 class="footer__heading mb-3">Get LottieFiles mobile app</h5>

            <div class="d-flex mb-6b">
              <NuxtImg
                class="footer__marketplace-image me-4b"
                src="/images/apple-app-store.svg"
              />
              <NuxtImg
                class="footer__marketplace-image"
                src="/images/google-play-store.svg"
              />
            </div>

            <h5 class="footer__heading mb-3">Follow Us</h5>

            <div class="footer__social-links mb-6b">
              <NuxtLink to="/download/mac">
                <client-only>
                  <unicon name="facebook" class="me-1"></unicon>
                </client-only>
              </NuxtLink>

              <NuxtLink to="/download/windows">
                <client-only>
                  <unicon name="instagram" class="me-1"></unicon>
                </client-only>
              </NuxtLink>

              <NuxtLink to="/download/windows">
                <client-only>
                  <unicon name="twitter" class="me-1"></unicon>
                </client-only>
              </NuxtLink>

              <NuxtLink to="https://linkedin.com/iconscout">
                <client-only>
                  <unicon name="linkedin" class="me-1"></unicon>
                </client-only>
              </NuxtLink>

              <NuxtLink to="https://dribbble.com/iconscout">
                <client-only>
                  <unicon name="dribbble" class="me-1"></unicon>
                </client-only>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__copyright">
      <div class="container-lg px-10b px-lg-0 h-100">
        <div
          class="row no-gutters justify-content-between text-secondary h-100"
        >
          <div
            class="d-flex align-items-center overflow-hidden col-10 col-sm-7 font-karla h-100"
          >
            {{ new Date().getFullYear() }} Design Barn Inc. Made with
            <Icon name="mdi:heart" size="16" class="text-danger mx-1" />
            from
            <span class="country-rotator ms-1">
              <transition name="fade" mode="out-in">
                <span :key="currentCountry">{{ currentCountry }}</span>
              </transition>
            </span>
          </div>

          <div
            class="h-100 d-flex align-items-center justify-content-start col-12 col-sm-5 justify-content-sm-end"
          >
            <span class="d-flex align-items-center">
              <Icon name="uis:lock" size="22" class="me-1 text-warning" />
              <i class="me-4 text-gray fw-thin font-karla">Secure Payments</i>
              <NuxtImg src="/images/stripe-logo.svg" alt="Stripe" height="40"
            /></span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@import "/assets/scss/variables";

.footer {
  background-color: #f5f6fa;

  &__logo {
    height: 40px;
  }

  &__header-line {
    margin: -1px 0.125rem 0;
    border: 1px solid #d8dbeb;
  }

  &__content {
    border-bottom: 1px solid #ebedf5;
  }

  &__copyright {
    height: 88px;
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
    color: $gray;
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

  &__marketplace-image {
    // Hack because the SVG from Figma has different heights
    &:first-child {
      width: 48%;
    }
    &:last-child {
      width: 52%;
    }
  }

  &__social-links {
    display: flex;

    a {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 2.5rem;
      border: 1px solid #d9dbeb;
      border-right: none;
    }

    a:last-child {
      border-right: 1px solid #d9dbeb;
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

<!-- Can't use scoped here, client side changes -->
<style lang="scss">
@import "/assets/scss/variables";
.unicon {
  svg {
    color: $gray;
    fill: $gray;
    height: 1rem;
  }
}
</style>
