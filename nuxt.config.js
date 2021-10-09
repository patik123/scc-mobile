export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Šolski center Celje Mobile',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    'bootstrap-vue/nuxt',
  ],

  axios: {},

  pwa: {
    manifest: {
      name: 'Šolski center Celje Mobile',
      short_name: 'Šolski center Celje Mobile',
      lang: 'en',
      description: 'Šolski center Celje Mobile',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
    },
    /*   workbox: {
      dev: process.env.NODE_ENV !== 'production'
    } */
  },

  auth: {
    cookie: false,
    redirect: {
      login: '/',
      callback: '/auth',
    },
    strategies: {
      aad: {
        scheme: 'oauth2',
        endpoints: {
          authorization:
            'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
          token:
            'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
          userInfo: '',
          logout: '/',
          refresh: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800,
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30,
        },
        responseType: 'code',
        grantType: 'authorization_code',
        accessType: 'offline',
        clientId: 'ed033b99-1ce6-49c4-a297-5e9bdc24dc5f',
        codeChallengeMethod: 'S256',
        scope: ['openid', 'profile'],
        autoLogout: true,
      },
    },
  },

  router: {
    middleware: ['auth'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
