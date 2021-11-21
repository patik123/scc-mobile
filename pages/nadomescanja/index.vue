<template>
  <div class="">
    <v-app>
      <offline-alert v-if="$nuxt.isOffline"></offline-alert>
      <v-sheet class="no-radius" height="100%" width="100%">
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
          <MenuLinks :school-website="school_website()" :school="school" :show-nadomescanja="show_nadomescanja()" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <div v-if="!show_nadomescanja()" class="text-center">
              <h3>Ta stran ti ni namenjena. Nadomeščanja so na voljo pod obvestila.</h3>
              <img src="~/static/access_denied.svg" class="access-denied-img mt-2" alt="Ni dostopa" /><br />

              <v-btn class="mt-2" to="/" nuxt :color="getSchoolColor()">Nazaj na domačo stran</v-btn>
            </div>

            <div v-if="nadomescanja_pdf">
              <div v-if="seznam_nadomescanj_pdf_load" id="seznam_nadomescanj_pdf">
                <v-card v-for="nadomescanje in seznam_nadomescanj_pdf" :key="nadomescanje.i" outlined class="margin-card" :data-url="nadomescanje.link" :data-id="nadomescanje.i" @click="show_nadomescanja_pdf">
                  <v-card-title>
                    <v-card-title>
                      <span>{{ nadomescanje.date }}</span>
                    </v-card-title>
                  </v-card-title>
                </v-card>
              </div>

              <div v-if="show_nadomescanja_pdf_view" id="nadomescanje_pdf">
                <v-btn :color="getSchoolColor()" class="mb-4" @click="nadomescanja_back">Nazaj</v-btn>
                <vue-pdf-app v-if="show_nadomescanja_pdf_view" style="height: 100vh" :pdf="pdf" :config="pdf_viewer_config"></vue-pdf-app>
              </div>
            </div>
          </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'
import cherio from 'cherio'
import VuePdfApp from 'vue-pdf-app'
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'Nadomescanja',
  components: {
    VuePdfApp,
  },
  mixins: [basicFunctions, authMiddleware],

  data() {
    return {
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

  created() {
    if (this.nadomescanja_pdf() === true) {
      this.getPdfNadomescanja()
    }
  },

  methods: {
    getPdfNadomescanja() {
      const school = localStorage.getItem('school')
      if (this.config.default[school].type_of_nadomescanja === 'pdf') {
        axios.get(`https://api.allorigins.win/raw?url=${this.config.default[school].nadomescanja_url}`).then((response) => {
          const $ = cherio.load(response.data)
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
  },
}
</script>
<style scoped>
.margin-card {
  margin-top: 10px !important;
}
.access-denied-img {
  width: 30%;
  height: 30%;
}

@media screen and (max-width: 960px) {
  .access-denied-img {
    width: 50%;
    height: 50%;
  }
}
</style>
