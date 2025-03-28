// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  ssr: true,

  modules: [
    "@nuxt/test-utils",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/scripts",
    "@bootstrap-vue-next/nuxt",
    "nuxt-icon",
    "@pinia/nuxt",
  ],

  css: ["@/assets/scss/main.scss"],

  plugins: ["@/plugins/unicons.client.js"],
});
