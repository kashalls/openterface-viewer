// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-11",
  srcDir: 'src/',
  modules: [
    "@nuxt/ui",
    '@vueuse/nuxt',
  ],

  ui: {
    icons: ['ph', 'heroicons']
  },

  colorMode: {
    fallback: 'dark',
    classSuffix: ''
  }
})