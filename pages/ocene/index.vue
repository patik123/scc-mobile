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
            <v-alert type="info" text dismissible>Prikaz ocen je v beta fazi. Če se vam pojavi kakšna težava obvestite skrbnika.</v-alert>
            <div v-if="loading">
              <v-skeleton-loader v-for="i in 10" :key="i" type="card-heading"></v-skeleton-loader>
            </div>
            <!-- Vse ocene  -->
            <div v-if="!loading">
              <v-card v-for="ocena in ocene_array" :key="ocena['id']" :data-id="ocena['id']" outlined class="margin-card" :class="getSchoolColor()">
                <v-card-title class="card-text-title">
                  <span>{{ ocena.predmet }}</span>
                </v-card-title>
                <v-card-subtitle>
                  {{ ocena.ocena }}
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
      ocene: [],
      ocene_count: 0,
      predmeti: [],
      loading: true,
      ocene_array: [], // namenjen prilagoditvi ocen za prikaz
    }
  },

  created() {
    this.eviLoginWithCallback(this.getPredmeti)
  },

  methods: {
    getOcene() {
      this.$axios
        .post(
          `${this.config.url_backend_aplikacije}/eviweb/redovalnica`,
          {
            username: this.eviweb_username,
            password: this.eviweb_password,
          },
          { validateStatus: false }
        )
        .then((response) => {
          this.ocene = response.data.message
          this.ocene_count = this.ocene.length

          this.ocene_array = []

          this.ocene.forEach((ocena) => {
            let predmet = this.predmeti.find((predmet) => {
              return predmet[1] === ocena[4]
            })
            this.ocene_array.push({
              id: ocena[1],
              ocena: ocena[6],
              cas_vpisa: ocena[9],
              predmet: predmet[2],
              tip_ocene: ocena[8],
            })
          })
          this.loading = false
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },

    getPredmeti() {
      this.$axios
        .post(
          `${this.config.url_backend_aplikacije}/eviweb/predmeti`,
          {
            username: this.eviweb_username,
            password: this.eviweb_password,
          },
          { validateStatus: false }
        )
        .then((response) => {
          this.predmeti = response.data.message

          this.getOcene()
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
