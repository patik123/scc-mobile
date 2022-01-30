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
            <v-alert type="info" text dismissible>Prikaz seznama profesorjev je v beta fazi. Če se vam pojavi kakšna težava obvestite skrbnika.</v-alert>
            <div v-if="loading">
              <v-skeleton-loader v-for="i in 10" :key="i" type="card-heading"></v-skeleton-loader>
            </div>
            <!-- Vse ocene  -->
            <div v-if="!loading">
              <v-card v-for="ucitelj in ucitelji" :key="ucitelj[0]" :data-id="ucitelj[0]" outlined class="margin-card" :class="getSchoolColor()" @click="getUciteljData">
                <v-card-title class="card-text-title">
                  <span>{{ ucitelj[3] + ' ' + ucitelj[2] }}</span>
                </v-card-title>
                <v-card-subtitle>
                  <span><v-icon>email</v-icon> {{ ucitelj[5] }}</span>
                  <span><v-icon>meeting_room</v-icon> {{ ucitelj[6] }}</span>
                </v-card-subtitle>
              </v-card>
            </div>
          </v-container>
        </v-main>
        <!-- New task dialog -->
        <v-dialog v-model="ucitelj_data_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="hideUciteljData">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Podatki o učitelju</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="mt-3">
              <!-- Podaatki o ucitelju -->
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">person</v-icon>
                    <span class="mr-3">{{ ucitelj_data[3] + ' ' + ucitelj_data[2] }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">email</v-icon>
                    <span class="mr-3"
                      ><a :href="`mailto:${ucitelj_data[5]}`">{{ ucitelj_data[5] }}</a></span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">phone</v-icon>
                    <span class="mr-3">{{ config.telefonska_stevilka_scc.replace('00', ucitelj_data[7]) }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">room</v-icon>
                    <span class="mr-3">{{ ucitelj_data[6] }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">schedule</v-icon>
                    <span class="mr-3">Dopoldanska govorilna ura: {{ ucitelj_data[8] }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">schedule</v-icon>
                    <span class="mr-3">Popoldnaska govorilna ura: {{ ucitelj_data[9] }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
        </v-dialog>
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
      ucitelji: [],
      loading: true,
      ucitelj_data_dialog: false,
      ucitelj_data: {},
    }
  },

  created() {
    this.eviLoginWithCallback(this.getUcitelji)
  },

  methods: {
    getUcitelji() {
      this.$axios
        .post(
          `${this.config.url_backend_aplikacije}/eviweb/ucitelji`,
          {
            username: this.eviweb_username,
            password: this.eviweb_password,
          },
          { validateStatus: false }
        )
        .then((response) => {
          this.ucitelji = response.data.message
          this.loading = false
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          this.setRequestError()
        })
    },
    getUciteljData(e) {
      const ucitelj_id = e.currentTarget.dataset.id
      this.ucitelj_data = this.ucitelji[ucitelj_id - 1]
      this.ucitelj_data_dialog = true
    },
    hideUciteljData() {
      this.ucitelj_data_dialog = false
      this.ucitelj_data = {}
    },
  },
}
</script>

<style scoped>
.margin-card {
  margin-top: 10px !important;
}
</style>
