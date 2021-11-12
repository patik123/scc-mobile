// Basic functions for other pages

import axios from 'axios'
import * as configData from '~/static/config.json'

export default {
  data() {
    return {
      jwt_decoded: null,
      jwt_token: null,
      user: localStorage.getItem('user'),
      school: localStorage.getItem('school'),
      user_class: localStorage.getItem('class'),
      config: configData,
      drawer: false,
      group: null,
      darkmode: false,
      dark_light_icon: 'dark_mode',
    }
  },
  watch: {
    darkmode(oldval, newval) {
      this.handledarkmode()
    },
  },

  created() {
    if (!this.$auth.loggedIn) {
      this.$router.push('/')
    } else {
      this.jwt_decoded = this.$auth.$storage.getUniversal('jwt_decoded')
      this.jwt_token = this.$auth.$storage.getUniversal('_token.aad')
      this.config = configData
      if (this.$auth.loggedIn && !localStorage.getItem('user')) {
        this.getUserData()
      }
      if (localStorage.getItem('DarkMode')) {
        if (localStorage.getItem('DarkMode') === 'true') {
          this.darkmode = true
        } else {
          this.handledarkmode()
        }
      }
    }
  },

  methods: {
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

    darkMode() {
      this.darkmode = !this.darkmode
      localStorage.setItem('DarkMode', this.darkmode)
    },
    show_nadomescanja() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config.default[school].show_nadomescanja
      }
      return null
    },
    handledarkmode() {
      if (this.darkmode === true) {
        this.$vuetify.theme.dark = true
        localStorage.setItem('DarkMode', true)
        this.dark_light_icon = 'dark_mode'
      } else if (this.darkmode === false) {
        this.$vuetify.theme.dark = false
        localStorage.setItem('DarkMode', false)
        this.dark_light_icon = 'light_mode'
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
    full_school_name() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config.default[school].full_school_name
      }
      return null
    },

    school_website() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config.default[school].website
      }
      return null
    },
  },
}
