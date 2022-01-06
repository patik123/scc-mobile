<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title>Šolski center Celje</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn href="/Navodila.pdf" icon target="_blank" class="d-none d-sm-flex"><v-icon>help_outline</v-icon></v-btn>
          <v-btn icon @click="darkMode()">
            <v-icon>{{ dark_light_icon }}</v-icon></v-btn
          >
          <v-btn icon @click="logout()"><v-icon>logout</v-icon></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary>
          <v-list>
            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="text-h6"> {{ user_data.first_name + ' ' + user_data.last_name }} </v-list-item-title>
                <v-list-item-subtitle>{{ user_class }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
          <MenuLinks :school-website="school_website()" :school="school" />
        </v-navigation-drawer>

        <v-main class="mt-2">
          <v-container fluid>
            <div v-if="loading">
              <v-skeleton-loader v-for="i in 10" :key="i" type="card-heading"></v-skeleton-loader>
            </div>
            <!-- Vsa obvestila dialog -->
            <div v-if="show_all_notifications">
              <div v-if="no_notifications === true">
                <v-alert color="blue" type="info" text>Ni obvestil.</v-alert>
              </div>

              <v-card v-for="obvestilo in obvestila" :key="obvestilo.i" outlined class="margin-card" :data-url="obvestilo.link" :data-id="obvestilo.i" :class="getSchoolColor()" @click="show_obvestilo_func">
                <v-card-title class="card-text-title">
                  <span>{{ obvestilo.title }}</span>
                </v-card-title>

                <v-card-subtitle>
                  <span>{{ obvestilo.date }}</span>
                </v-card-subtitle>
              </v-card>
            </div>

            <!-- Dialog za prikaz enega obvestila -->

            <div v-if="show_notification">
              <div>
                <v-btn :color="getSchoolColor()" class="mb-4" @click="back_to_obvestila">Nazaj</v-btn>
              </div>

              <div v-if="loading_obvestilo">
                <v-skeleton-loader class="mb-2" type="heading"></v-skeleton-loader>
                <v-skeleton-loader type="paragraph,paragraph,paragraph,paragraph,paragraph,paragraph,paragraph"></v-skeleton-loader>
              </div>

              <div class="d-inline">
                <h1>{{ vsebina_obvestila_title }}</h1>
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
      loading: true,
      no_notifications: false,
      loading_obvestilo: true,
    }
  },

  created() {
    this.getObvestila()
  },

  methods: {
    show_obvestilo_func(e) {
      this.restartErrorRequestNotification()
      this.loading_obvestilo = true
      // eslint-disable-next-line no-console
      const url = e.currentTarget.dataset.url

      this.$axios
        .get(`${this.config.url_backend_aplikacije}/sites/url_proxy?url=${url}`)
        .then((response) => {
          const $ = cherio.load(response.data)

          const title = $('.ed-header-title').text().trim()
          const content = $('.entry-content').html()

          this.vsebina_obvestila_title = title
          this.vsebina_obvestila_body = content
          this.loading_obvestilo = false
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error)
          this.setRequestError()
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
      this.restartErrorRequestNotification()
      this.$axios
        .get(`${this.config.url_backend_aplikacije}/sites/url_proxy?url=${this.school_website()}`)
        .then((response) => {
          const $ = cherio.load(response.data)
          const obvestila = $('#wpsp-142').text().trim()
          if (obvestila === 'Trenutno ni aktualnih obvestil.') {
            this.no_notifications = true
          } else {
            $('#wpsp-142 article').each((i, el) => {
              const title = $(el).find('.wp-show-posts-entry-title').text()
              const link = $(el).find('.wp-show-posts-entry-title a').attr('href')
              const date = $(el).find('.wp-show-posts-entry-date').text()
              this.obvestila.push({
                id: i,
                title: title,
                link: link,
                date: date,
              })
            })
          }

          this.loading = false
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error)
          this.setRequestError()
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
