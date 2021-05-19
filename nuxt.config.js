export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'dnn',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/pwa',
  ],
  pwa: {
    icon: false, // disables the icon module,
    manifest: {
      name: 'My Awesome App',
      lang: 'fa',
      useWebmanifestExtension: false
    },
    meta: {
      /* meta options */
    },
    workbox: {
      dev: process.env.NODE_ENV !== 'production'
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa',
  ],
  bootstrapVue: {
    // Install the `IconsPlugin` plugin (in addition to `BootstrapVue` plugin)
    icons: true
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      compact: true
    },
    extend (config, { isDev, isClient }) {
      config.node = {
        fs: 'empty'
      }
    }
  },
  serverMiddleware:
    process.env.NODE_ENV === 'production' ? [] : ['~/api/hello.js'],
}
