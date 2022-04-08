<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title>{{ $t('scc') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="logout()"><v-icon>logout</v-icon></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary app>
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
            <v-alert type="info" text dismissible>Prikaz ocenjevanj je v beta fazi. Če se vam pojavi kakšna težava obvestite skrbnika.</v-alert>
            <div v-if="loading">
              <v-skeleton-loader v-for="i in 10" :key="i" type="card-heading"></v-skeleton-loader>
            </div>

            <div v-if="!loading">
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.prev()"
                ><v-icon>navigate_before</v-icon><span class="d-none d-sm-flex">{{ $t('koledar.nazaj') }}</span></v-btn
              >
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.next()"
                ><span class="d-none d-sm-flex">{{ $t('koledar.naprej') }}</span
                ><v-icon>navigate_next</v-icon></v-btn
              >
              <v-calendar ref="calendar" v-model="calendar" type="month" :weekdays="[1, 2, 3, 4, 5]" :event-color="schoolBGColor()" :events="pisni_preizkusi_array" @click:event="event_click"></v-calendar>
            </div>

            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title>
                  <span>{{ data_about_test.name }}</span>
                </v-card-title>

                <v-card-text>
                  <div>
                    <v-icon class="mr-2">schedule</v-icon>
                    <span>{{ $moment(data_about_test.start, 'YYYY-MM-DD').format('DD. MM. YYYY') }}</span>
                  </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="getSchoolColor()"
                    text
                    @click="
                      dialog = false
                      data_about_test = {}
                    "
                  >
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'Ocene',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      pisni_preizkusi: [],
      calendar: null,
      pisni_preizkusi_array: [],
      loading: true,
      dialog: false,
      data_about_test: {},
    }
  },

  created() {
    this.eviLoginWithCallback(this.getPreizkusi)
    this.$vuetify.lang.current = 'sl'
  },

  methods: {
    getPreizkusi() {
      this.$axios
        .post(
          `${this.config.url_backend_aplikacije}/eviweb/testi`,
          {
            username: this.eviweb_username,
            password: this.eviweb_password,
          },
          { validateStatus: false }
        )
        .then((response) => {
          this.pisni_preizkusi = response.data.message
          this.pisni_preizkusi_array = []
          this.pisni_preizkusi.forEach((test) => {
            this.pisni_preizkusi_array.push({
              id: test[0],
              name: 'Pisni preizkus znanja ' + test[1],
              start: this.$moment(test[2]).format('YYYY-MM-DD'),
              end: this.$moment(test[2]).format('YYYY-MM-DD'),
              timed: true,
            })
          })
          this.loading = false
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },
    event_click(event) {
      this.data_about_test = event.event
      this.dialog = true
    },
  },
}
</script>

<style scoped>
.margin-card {
  margin-top: 10px !important;
}
</style>
