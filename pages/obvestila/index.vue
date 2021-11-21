<template>
  <div>
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

        <v-main class="mt-2">
          <v-container fluid>
            <div v-if="loading">
              <v-skeleton-loader v-for="i in 10" :key="i" type="card-heading"></v-skeleton-loader>
            </div>
            <!-- Vsa obvestila dialog -->
            <div v-if="show_all_notifications">
              <v-card v-for="obvestilo in obvestila" :key="obvestilo.i" outlined class="margin-card" :data-url="obvestilo.link" :data-id="obvestilo.i" :class="getSchoolColor()" @click="show_obvestilo_func">
                <v-card-title>
                  <v-card-title class="card-text-title">
                    <span>{{ obvestilo.title }}</span>
                  </v-card-title>
                </v-card-title>
              </v-card>
            </div>

            <!-- Dialog za prikaz enega obvestila -->

            <div v-if="show_notification">
              <div>
                <v-btn :color="getSchoolColor()" class="mb-4" @click="back_to_obvestila">Nazaj</v-btn>
              </div>

              <div v-if="loading_obvestilo">
                <v-skeleton-loader class="mb-2" type="heading"></v-skeleton-loader>
                <v-skeleton-loader class="mb-2" type="chip"></v-skeleton-loader>
                <v-skeleton-loader type="paragraph,paragraph,paragraph,paragraph,paragraph,paragraph,paragraph"></v-skeleton-loader>
              </div>

              <div class="d-inline">
                <h1>{{ vsebina_obvestila_title }}</h1>
                <v-chip v-if="!vsebina_obvestila_date == ''">{{ vsebina_obvestila_date }}</v-chip>
              </div>

              <div class="mt-5 responsive-area">
                <!-- eslint-disable-next-line no-console -->
                <span v-html="vsebina_obvestila_body"></span>
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
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'Obvestila',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      obvestila: [],
      show_all_notifications: true,
      show_notification: false,
      vsebina_obvestila_title: '',
      vsebina_obvestila_body: '',
      vsebina_obvestila_date: '',
      loading: true,
      loading_obvestilo: true,
    }
  },

  created() {
    if (!this.$auth.loggedIn) {
      this.$router.push('/')
    } else {
      this.getObvestila()
    }
  },

  methods: {
    show_obvestilo_func(e) {
      this.loading_obvestilo = true
      // eslint-disable-next-line no-console
      const url = e.currentTarget.dataset.url

      axios.get(`https://api.allorigins.win/raw?url=${url}`).then((response) => {
        const $ = cherio.load(response.data)
        this.vsebina_obvestila_title = $('.post-title').text()
        this.vsebina_obvestila_body = $('.entry-inner').html()
        this.vsebina_obvestila_date = $('.post-byline').text()
        this.loading_obvestilo = false
      })
      this.show_notification = true
      this.show_all_notifications = false
    },

    back_to_obvestila() {
      this.vsebina_obvestila_title = ''
      this.vsebina_obvestila_body = ''
      this.vsebina_obvestila_date = ''
      this.show_notification = false
      this.show_all_notifications = true
      this.loading_obvestilo = false
    },
    getObvestila() {
      axios.get(`https://api.allorigins.win/raw?url=${this.school_website()}`).then((response) => {
        const $ = cherio.load(response.data)
        $('#my_custom_widget-2 a').each((i, el) => {
          if ($(el).text() !== '(novo)') {
            this.obvestila.push({
              id: i,
              title: $(el).text(),
              link: $(el).attr('href'),
            })
          }
        })
        this.loading = false
      })
    },
  },
}
</script>

<style scoped>
.margin-card {
  margin-top: 10px !important;
}
.card-text-title {
  word-break: normal !important;
}

.responsive-area {
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
}
</style>
