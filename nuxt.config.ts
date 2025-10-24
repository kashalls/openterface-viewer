// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-11",
  modules: [
    "@nuxt/ui",
    '@vueuse/nuxt',
  ],

  css: ['@/assets/css/main.css'],

  colorMode: {
    fallback: 'dark',
    classSuffix: ''
  },

  runtimeConfig: {
    public: {
      SERVER: Boolean(process.env["VIEWER_SERVER"]),
      VERSION: process.env["VERSION"] ?? 'Dev',
      REVISION: process.env["REVISION"]
    }
  }
})