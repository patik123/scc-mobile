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
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Predmet</th>
                      <th class="text-left">Ocene</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in ocene_array" :key="item.id">
                      <td>{{ item.naziv }}</td>
                      <td>
                        <span v-for="mark in ocene_array[index].ocene" :key="mark.id" class="mr-3" @click="markData(item.naziv, mark.ocena, mark.cas_vpisa, mark.tip_ocene)">{{ mark.ocena }}</span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>

            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title>
                  <span>{{ grade_data.predmet }}</span>
                </v-card-title>

                <v-card-text>
                  <div>
                    <v-icon class="mr-2">grade</v-icon>
                    <span>{{ grade_data.ocena }}</span>
                  </div>

                  <div>
                    <v-icon class="mr-2">numbers</v-icon>
                    <span>{{ markType(grade_data.tip_ocene) }}</span>
                  </div>

                  <div>
                    <v-icon class="mr-2">schedule</v-icon>
                    <span>{{ grade_data.cas_vpisa }}</span>
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
                      grade_data = {}
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
      ocene: [],
      ocene_count: 0,
      predmeti: [],
      loading: true,
      ocene_array: [], // namenjen prilagoditvi ocen za prikaz
      grade_data: {},
      dialog: false,
    }
  },

  created() {
    this.eviLoginWithCallback(this.getOcene)
  },

  methods: {
    markType(type) {
      const grade_type = type
      if (grade_type == 0) {
        return 'Ustna ocena'
      }
      if (grade_type == 1) {
        return 'Pisna ocena'
      }
      if (grade_type == 2) {
        return 'Izdelek'
      }
      if(grade_type === 'G'){
        return 'Graja'
      }

    },
    markData(predmet, ocena, cas_vpisa, tip_ocene) {
      this.grade_data = {
        predmet: predmet,
        ocena: ocena,
        tip_ocene: tip_ocene,
        cas_vpisa: cas_vpisa,
      }
      this.dialog = true
    },
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
          this.ocene = response.data.message.ocene
          this.predmeti = response.data.message.predmeti
          this.ocene_count = this.ocene.length

          this.ocene_array = []

          this.predmeti.forEach((predmet) => {
            this.ocene_array.push({
              id: predmet[1],
              krajsava: predmet[2],
              naziv: predmet[3],
              ocene: [],
            })
          })

          this.ocene.forEach((ocena) => {
            const predmet = this.predmeti.find((predmet) => {
              return predmet[1] === ocena[4]
            })

            for (var i = 0; i < this.ocene_array.length; i++) {
              if (this.ocene_array[i]['id'] === ocena[4]) {
                this.ocene_array[i]['ocene'].push({
                  id: ocena[1],
                  ocena: ocena[6],
                  cas_vpisa: ocena[9],
                  tip_ocene: ocena[8],
                })
              }
            }
          })
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
