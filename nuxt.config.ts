// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-11",
  srcDir: 'src/',
  devtools: { enabled: true },

  modules: [
    "shadcn-nuxt",
    '@vueuse/nuxt',
    "@nuxt/ui"
  ],

  shadcn: {
    prefix: '',
    componentDir: './src/components/ui'
  },

  colorMode: {
    fallback: 'dark',
    classSuffix: ''
  },

  ui: {
    icons: ['ph'],
  }
})