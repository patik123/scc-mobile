<template>
  <div class="">
    <v-app>
      <v-card class="no-radius" height="100%" width="100%">
        <v-app-bar color="">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title>Šolski center Celje</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon class="mr-2" @click="darkMode()">{{ dark_light_icon }}</v-icon>
          <v-icon @click="$auth.logout('aad')">logout</v-icon>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary>
          <v-list>
            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="text-h6"> {{ jwt_decoded.given_name + ' ' + jwt_decoded.family_name }} </v-list-item-title>
                <v-list-item-subtitle>{{ user_class }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
          <v-list nav dense>
            <v-list-item-group v-model="group" active-class="">
              <v-list-item class="rounded-r-xl" to="/" nuxt>
                <v-list-item-title><v-icon>home</v-icon> Domov</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/urnik" nuxt>
                <v-list-item-title><v-icon>schedule</v-icon> Urnik</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/obvestila" nuxt>
                <v-list-item-title><v-icon>notifications</v-icon> Obvestila</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="show_nadomescanja()" class="rounded-r-xl" to="/nadomescanja" nuxt>
                <v-list-item-title><v-icon>shuffle</v-icon> Nadomeščanja</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/jedilnik" nuxt>
                <v-list-item-title><v-icon>restaurant_menu</v-icon> Jedilnik</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/izkaznica" nuxt>
                <v-list-item-title><v-icon>badge</v-icon> E-izkaznica</v-list-item-title>
              </v-list-item>

              <v-divider class="mb-1"></v-divider>
              <v-list-item class="rounded-r-xl" target="_blank" :href="config.default.eucilnica_site">
                <v-list-item-title><v-icon>school</v-icon> Spletna učilnica</v-list-item-title>
              </v-list-item>
              <v-list-item class="rounded-r-xl" target="_blank" :href="school_website()">
                <v-list-item-title><v-icon>language</v-icon> Šolska spletna stran</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/about" nuxt>
                <v-list-item-title><v-icon>info</v-icon> O aplikaciji</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <div v-if="nadomescanja_pdf">
              <div v-if="seznam_nadomescanj_pdf_load" id="seznam_nadomescanj_pdf">
                <v-card
                  v-for="nadomescanje in seznam_nadomescanj_pdf"
                  :key="nadomescanje.i"
                  outlined
                  class="margin-card"
                  :data-url="nadomescanje.link"
                  :data-id="nadomescanje.i"
                  @click="show_nadomescanja_pdf"
                >
                  <v-card-title>
                    <v-card-title>
                      <span>{{ nadomescanje.date }}</span>
                    </v-card-title>
                  </v-card-title>
                </v-card>
              </div>

              <div v-if="show_nadomescanja_pdf_view" id="nadomescanje_pdf">
                <v-btn color="primary" class="mb-4" @click="nadomescanja_back">Nazaj</v-btn>
                <vue-pdf-app v-if="show_nadomescanja_pdf_view" style="height: 100vh" :pdf="pdf" :config="pdf_viewer_config" fileName="Seznam nadomeščanj"></vue-pdf-app>
              </div>
            </div>
          </v-container>
        </v-main>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'
import cherio from 'cherio'
import VuePdfApp from 'vue-pdf-app'
import * as configData from '~/static/config.json'

export default {
  components: {
    VuePdfApp,
  },

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
      pdf: '',
      seznam_nadomescanj_pdf: [],
      seznam_nadomescanj_pdf_load: true,
      show_nadomescanja_pdf_view: false,
      pdf_viewer_config: {
        sidebar: false,
        secondaryToolbar: false,
        toolbar: {
          toolbarViewerLeft: {
            findbar: false,
            previous: true,
            next: true,
            pageNumber: true,
          },
          toolbarViewerRight: false,
          toolbarViewerMiddle: {
            zoomOut: true,
            zoomIn: true,
            scaleSelectContainer: false,
          },
        },
        errorWrapper: true,
      },
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
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

      if (this.nadomescanja_pdf() === true) {
        this.getPdfNadomescanja()
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

    getPdfNadomescanja() {
      const school = localStorage.getItem('school')
      if (this.config.default[school].type_of_nadomescanja === 'pdf') {
        axios.get(`https://api.allorigins.win/get?url=${this.config.default[school].nadomescanja_url}`).then((response) => {
          const $ = cherio.load(response.data.contents)
          const vsebina = $('.content')
          $(vsebina)
            .find('a')
            .each((i, el) => {
              const href = $(el).attr('href')
              const text = $(el).text()
              this.seznam_nadomescanj_pdf.push({
                id: i,
                link: href,
                date: text,
              })
            })
        })
        this.seznam_nadomescanj_pdf_load = true
      }
    },

    nadomescanja_pdf() {
      const school = localStorage.getItem('school')
      if (this.config.default[school].type_of_nadomescanja === 'pdf') {
        return true
      }
      return false
    },

    nadomescanja_back() {
      this.pdf = ''
      this.seznam_nadomescanj_pdf_load = true
      this.show_nadomescanja_pdf_view = false
    },

    show_nadomescanja_pdf(e) {
      this.seznam_nadomescanj_pdf_load = false
      const url = e.currentTarget.dataset.url
      this.pdf = `https://api.allorigins.win/raw?url=${url}`
      this.show_nadomescanja_pdf_view = true
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
</script>
<style scoped>
.margin-card {
  margin-top: 10px !important;
}
</style>
