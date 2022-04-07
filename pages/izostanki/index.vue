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
            <v-alert type="info" text dismissible>Prikaz izostankov je v beta fazi. Če se vam pojavi kakšna težava obvestite skrbnika.</v-alert>
            <div v-if="loading">
              <v-skeleton-loader v-for="i in 10" :key="i" type="card-heading"></v-skeleton-loader>
            </div>
            <!-- Vse ocene  -->
            <div v-if="!loading">
              <v-card v-for="izostanek in izostanki" :key="izostanek[0]" outlined class="margin-card" :class="getSchoolColor()">
                <v-card-title class="card-text-title">
                  <span>{{ $moment(izostanek[0]).format('DD. MM. YYYY') }}</span>
                </v-card-title>
                <v-card-subtitle>
                  <table style="width: 100%">
                    <tr v-if="izostanek[1]['opravicene'].length !== 0">
                      <td style="width: 25%">Opravičen izostanek</td>
                      <td>
                        <span class="font-weight-bold" v-for="ura in izostanek[1]['opravicene']" :key="ura">{{ ura + ' ' }}</span>
                      </td>
                    </tr>

                    <tr v-if="izostanek[1]['neopravicene'].length !== 0">
                      <td style="width: 25%">Neopravičen izostanek</td>
                      <td>
                        <span class="font-weight-bold" v-for="ura in izostanek[1]['neopravicene']" :key="ura">{{ ura + ' ' }}</span>
                      </td>
                    </tr>

                    <tr v-if="izostanek[1]['vsoli'].length !== 0">
                      <td style="width: 25%">V šoli</td>
                      <td>
                        <span class="font-weight-bold" v-for="ura in izostanek[1]['vsoli']" :key="ura">{{ ura + ' ' }}</span>
                      </td>
                    </tr>

                    <tr v-if="izostanek[1]['neobdelane'].length !== 0">
                      <td style="width: 25%">Neobdelano</td>
                      <td>
                        <span class="font-weight-bold" v-for="ura in izostanek[1]['neobdelane']" :key="ura">{{ ura + ' ' }}</span>
                      </td>
                    </tr>
                  </table>
                </v-card-subtitle>
              </v-card>
            </div>
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
      izostanki: [],
      izostanki_count: 0,
      loading: true,
    }
  },

  created() {
    this.eviLoginWithCallback(this.getIzostanki)
  },

  methods: {
    getIzostanki() {
      this.$axios
        .post(
          `${this.config.url_backend_aplikacije}/eviweb/izostanki`,
          {
            username: this.eviweb_username,
            password: this.eviweb_password,
          },
          { validateStatus: false }
        )
        .then((response) => {
          this.izostanki = response.data.message.izostanki
          this.izostanki_count = response.data.message.count

          this.loading = false
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },
  },
}
</script>

<style scoped>
.margin-card {
  margin-top: 10px !important;
}
</style>
