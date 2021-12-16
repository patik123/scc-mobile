export default {
  target: 'static',
  ssr: false,
  head: {
    title: 'ŠCC Mobile',
    htmlAttrs: {
      lang: 'si',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Mobilna aplikacija Šolskega centra Celja' },
      { name: 'author', content: 'Patrick Košir' },
      { name: 'google', content: 'notranslate' }, // Disable Google Translate
      { name: 'robots', content: 'noindex, nofollow' }, // V produkciji se mora spremeniti na index, follow
      { name: 'googlebot', content: 'noindex, nofollow' }, // V produkciji se mora spremeniti na index, follow
      // Default Open Graph
      { property: 'og:title', content: 'ŠCC Mobile' },
      { property: 'og:description', content: 'Mobilna aplikacija Šolskega centra Celja' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://scc-mobile.pages.dev' }, // V produkciji se mora spremeniti na URL strani
      { property: 'og:image', content: 'https://scc-mobile.pages.dev/icon.png' }, // V produkciji spremeni na URL strani
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['@/assets/scss/main.scss', 'vue-pdf-app/dist/icons/main.css'],

  plugins: ['~/plugins/barcode.client.js', { src: '~/plugins/vue-matomo.js', ssr: false }],

  components: true,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/pwa', '@nuxtjs/style-resources', '@nuxtjs/vuetify', '@nuxtjs/moment'],

  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', '@nuxtjs/auth-next', 'nuxt-polyfill', '@nuxtjs/universal-storage', 'nuxt-route-meta'],

  moment: {
    defaultLocale: 'si',
  },

  pwa: {
    manifest: {
      name: 'ŠCC Mobile',
      author: 'Patrick Košir',
      short_name: 'ŠCC Mobile',
      lang: 'si',
      description: 'ŠCC Mobile',
      background_color: '#ffffff',
      theme_color: '#002f5f',
      orientation: 'portrait',
      display: 'standalone',
      start_url: '/?source=pwa',
      shortcuts: [
        {
          name: 'Urnik',
          short_name: 'Urnik',
          description: 'Odpre urnik',
          url: '/urnik',
          icons: [
            {
              sizes: '512x512',
              src: '/timetable_icon.png',
            },
          ],
        },
        {
          name: 'Nov dogodek',
          short_name: 'Nov dogodek',
          description: 'Ustvari nov dogodek v koledarju',
          url: '/koledar/?action=new-event',
          icons: [
            {
              sizes: '512x512',
              src: '/new_event_icon.png',
            },
          ],
        },
        {
          name: 'Novo opravilo',
          short_name: 'Novo opravilo',
          description: 'Ustvari novo opravilo v seznamu opravil',
          url: '/opravila?action=new-task',
          icons: [
            {
              sizes: '512x512',
              src: '/new_task_icon.png',
            },
          ],
        },
      ],
    },
    /* workbox: {
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
          authorization: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
          token: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
          userInfo: '',
          logout: '/logout',
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
        clientId: '4d004a0f-f841-4bfd-bc00-0ab1ee7e5bf4',
        codeChallengeMethod: 'S256',
        scope: ['openid', 'profile', 'Calendars.ReadWrite', 'Tasks.ReadWrite', 'User.ReadWrite'],
        autoLogout: false,
      },
    },
  },

  router: {},

  build: {
    sass: {
      implementation: require('sass'),
    },
    scss: {
      implementation: require('sass'),
    },
  },

  vuetify: {
    optionsPath: './vuetify.options.js',
    defaultAssets: {
      font: {
        family: 'Nunito',
      },
      icons: 'md',
    },
    customVariables: ['~/assets/scss/variables.scss'],
  },

  // Configure polyfills:
  polyfill: {
    features: [],
  },

  // Configure loading indicator
  loading: {
    color: '#002f5f',
    height: '5px',
    continuous: true,
    failedColor: '#ff5252',
  },
}
