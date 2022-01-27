// Basic functions for other pages

import axios from 'axios'
import * as configData from '~/static/config.json'

export default {
  data() {
    return {
      jwt_decoded: null,
      jwt_token: null,
      user: localStorage.getItem('user') ? localStorage.getItem('user') : '',
      school: localStorage.getItem('school') ? localStorage.getItem('school') : '',
      user_class: localStorage.getItem('class') ? localStorage.getItem('class') : '',
      config: configData.default,
      drawer: false,
      group: null,
      darkmode: false,
      user_type: localStorage.getItem('user_type') ? localStorage.getItem('user_type') : '',
      dark_light_icon: 'dark_mode',
      request_error: false,
      user_data: localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')) : '',
      theme: '',
    }
  },
  watch: {
    darkmode(oldval, newval) {
      this.handledarkmode()
    },
  },

  created() {
    this.jwt_token = this.$auth.$storage.getUniversal('_token.aad')
    this.getThemeOnline()
    this.config = configData.default
    if (this.$auth.loggedIn && !localStorage.getItem('user')) {
      this.getUserData()
    }
    // DARK MODE DETECT - Switch to dark mode if user has dark mode enabled
    if (localStorage.getItem('dark')) {
      if (localStorage.getItem('dark') === 'true') {
        this.darkmode = true
        this.handledarkmode()
      } else if (localStorage.getItem('dark') === 'false') {
        this.darkmode = false
        this.handledarkmode()
      }
    } else {
      localStorage.setItem('dark', false)
      this.darkmode = false
      this.handledarkmode()
    }
    this.request_error = false
  },

  methods: {
    // Get user data from Microsoft Graph API and store in local storage
    getUserData() {
      axios({
        method: 'GET',
        url: 'https://graph.microsoft.com/beta/me/profile',
        headers: {
          Authorization: this.$auth.$storage.getUniversal('_token.aad'),
        },
      })
        .then((response) => {
          window.localStorage.setItem('user', JSON.stringify(response.data))
          this.user = response.data
          window.localStorage.setItem('school', this.user.positions['0'].detail.company.department.split('(D)')[0])
          window.localStorage.setItem('class', this.user.positions['0'].detail.jobTitle)
          this.school = window.localStorage.getItem('school')
          this.user_class = window.localStorage.getItem('class')
          this.$router.go() // refresh page zaradi napake pri pridobivanju podatkov - le začasna rešitev
        })

        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },

    restartErrorRequestNotification() {
      this.request_error = false
    },

    setRequestError() {
      this.request_error = true
    },

    darkMode() {
      this.darkmode = !this.darkmode
    },

    // Spreminja med temnim in svetlim načinom
    handledarkmode() {
      if (this.darkmode === true) {
        this.$vuetify.theme.dark = true
        localStorage.setItem('dark', true)
        this.dark_light_icon = 'light_mode'
        this.theme = 'dark'
        this.saveThemeOnline()
      } else if (this.darkmode === false) {
        this.$vuetify.theme.dark = false
        localStorage.setItem('dark', false)
        this.dark_light_icon = 'dark_mode'
        this.theme = 'light'
        this.saveThemeOnline()
      }
    },

    // Save user theme
    saveThemeOnline() {
      if (this.$auth.loggedIn) {
        this.$axios.get('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-theme', { validateStatus: false }).then((response) => {
          if (response.status === 404) {
            this.$axios
              .post('https://graph.microsoft.com/v1.0/me/extensions', {
                '@odata.type': 'microsoft.graph.openTypeExtension',
                extensionName: 'com.scc-mobile-theme',
                theme: this.darkmode ? 'dark' : 'light',
                last_modified: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
              })
              .then((response) => {
                // eslint-disable-next-line no-console
                console.log(response)
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error)
              })
          } else {
            this.$axios
              .patch('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-theme', {
                theme: this.darkmode ? 'dark' : 'light',
                last_modified: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
              })
              .then((response) => {
                // eslint-disable-next-line no-console
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error)
              })
          }
        })
      }
    },

    // Get user theme
    getThemeOnline() {
      if (this.$auth.loggedIn) {
        this.$axios.get('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-theme', { validateStatus: false }).then((response) => {
          if (response.status === 404) {
            this.darkmode = false
          } else {
            this.darkmode = response.data.theme === 'dark' ? true : false
          }
        })
      }
    },

    // Odjava iz aplikacije
    logout() {
      this.$auth.logout()
      this.$router.push('/')
    },

    // Vrne CSS razred katere barve je šola
    getSchoolColor() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return `${school}-color`
      }
      return null
    },

    /* ERROR OB USMERITVI NA STRAN SE POJAVI UNTABLE ERROR */
    // Vrne ime šole
    full_school_name() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config[school].full_school_name
      }
      return ''
    },

    // Prijava v aplikacijo
    login() {
      this.$auth.login('aad')
    },

    // Vrne spletno stran šole
    school_website() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config[school].website
      }
      return ''
    },

    // Vrne background-color šole
    schoolBGColor() {
      const school = this.school
      return `${school}-background`
    },

    // Generate start url
    startUrl() {
      if (this.$route.query.source === 'pwa') {
        return '/?source=pwa'
      } else return '/'
    },
  },
}
