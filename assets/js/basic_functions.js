// Basic functions for other pages

import axios from 'axios'
import * as configData from '~/static/config.json'

export default {
  data() {
    return {
      jwt_decoded: null,
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
      eviweb_password: '',
      eviweb_username: '',
      eviweb_available: localStorage.getItem('eviweb_available') ? localStorage.getItem('eviweb_available') : false,
    }
  },
  watch: {
    darkmode(oldval, newval) {
      this.handledarkmode()
    },
  },

  created() {
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
          window.localStorage.setItem('school', this.user.positions['0'].detail.company.department.split('(D)')[0]) // da dobimo samo celo ime šole (ta kratko)
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

    checkEviLogin() {
      this.restartErrorRequestNotification()

      this.$axios.get('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-eviweb', { validateStatus: false }).then((response) => {
        if (response.status === 404) {
          this.eviweb_check = true
          this.eviweb_available = false
        } else {
          const eviweb_data = response.data
          this.eviweb_connected_at = eviweb_data.last_update

          this.$axios
            .post(
              `${this.config.url_backend_aplikacije}/eviweb/available`,
              {
                username: eviweb_data.username,
                password: eviweb_data.password,
              },
              { validateStatus: false }
            )
            .then((response) => {
              if (response.data === 1) {
                this.eviweb_available = true
                this.user_data = Object.assign({ eviweb_available: true }, this.user_data)
                localStorage.setItem('user_data', JSON.stringify(this.user_data))
                localStorage.setItem('eviweb_available', this.eviweb_available)
                this.eviweb_username = eviweb_data.username
                this.eviweb_password = eviweb_data.password
                this.eviweb_check = true

                this.$axios.post(`${this.config.url_backend_aplikacije}/user`, {
                  id: this.user_data.id,
                  school: this.school,
                  class: this.user_class,
                  email: this.user_data.email,
                  type: this.user_data.type,
                  first_name: this.user_data.first_name,
                  last_name: this.user_data.last_name,
                  eviweb_available: 1,
                }).then((response) => {
                  console.log(response)
                })
              } else {
                this.eviweb_available = false
                this.user_data = Object.assign({ eviweb_available: false }, this.user_data)
                localStorage.setItem('user_data', JSON.stringify(this.user_data))
                localStorage.setItem('eviweb_available', this.eviweb_available)
                this.eviweb_check = true
                this.$axios.post(`${this.config.url_backend_aplikacije}/user`, {
                  id: this.user_data.id,
                  school: this.school,
                  class: this.user_class,
                  email: this.user_data.email,
                  type: this.user_data.type,
                  first_name: this.user_data.first_name,
                  last_name: this.user_data.last_name,
                  eviweb_available: 0,
                }).then((response) => {
                  console.log(response)
                })
              }
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log(error)
              this.setRequestError()
            })
        }
        this.eviweb_login_dialog = false
      })
    },

    eviLoginWithCallback(callback) {
      const evi_available = localStorage.getItem('eviweb_available')
      if (evi_available === 'true') {
        this.$axios
          .get('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-eviweb', { validateStatus: false })
          .then((response) => {
            const eviweb_data = response.data
            this.eviweb_username = eviweb_data.username
            this.eviweb_password = eviweb_data.password
            callback()
          })

          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error)
            this.setRequestError()
          })
      }
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
      this.restartErrorRequestNotification()
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
                this.setRequestError()
              })
          } else {
            this.$axios
              .patch('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-theme', {
                theme: this.darkmode ? 'dark' : 'light',
                last_modified: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error)
                this.setRequestError()
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

    // Odjava iz aplikacije
    logout() {
      this.$auth.logout()
      this.$router.push('/')
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
