// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    '@vueuse/nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './src/components/ui'
  },
  colorMode: {
    fallback: 'dark',
    classSuffix: ''
  }
})