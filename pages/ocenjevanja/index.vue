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
          <v-btn to="/navodila" icon target="_blank" class="d-none d-sm-flex"><v-icon>help_outline</v-icon></v-btn>
          <v-btn icon @click="darkMode()">
            <v-icon>{{ dark_light_icon }}</v-icon></v-btn
          >
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
            <!-- Vse ocene  -->
            <div v-if="!loading">
              <v-card v-for="test in pisni_preizkusi" :key="test[0]" outlined class="margin-card" :class="getSchoolColor()">
                <v-card-title class="card-text-title">
                  <span>{{ test[1] }}</span>
                </v-card-title>

                <v-card-subtitle>
                  <span>{{ $moment(test[2], 'YYYY-MM-DD').format('DD. MM. YYYY') }}</span>
                </v-card-subtitle>
              </v-card>
            </div>
          </v-container>
        </v-main>

        <!-- New task dialog -->
        <v-dialog v-model="eviweb_login_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="eviwebLoginClose">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ $t('ocene.prijava_v_eviweb') }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-alert v-if="error_message_eviweb" type="error" text>{{ error_message_eviweb }}</v-alert>
              <div class="mb-3">Aplikacija potrebuje vnos vašega gesla in uporabniškega imena od vašega EviWeba, da lahko komunicira z EviWebom. Vaše geslo in uporabniško ime se ne shranjuje nikamor.</div>
              <v-form v-model="eviweb_login_form.valid">
                <v-text-field v-model="eviweb_login_form.username" :label="$t('ocene.email_eviweb')" outlined :color="getSchoolColor()" :background-color="getSchoolColor()" required></v-text-field>
                <v-text-field v-model="eviweb_login_form.password" :label="$t('ocene.geslo_eviweb')" outlined :color="getSchoolColor()" :background-color="getSchoolColor()" type="password" required></v-text-field>
              </v-form>
              <v-btn :color="getSchoolColor()" @click="eviwebLogin">{{ $t('ocene.login_eviweb') }}</v-btn>
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
      error_message_eviweb: '',
      eviweb_login_dialog: false,
      eviweb_login_form: {
        valid: false,
        username: '',
        password: '',
      },
      eviweb_password: '',
      eviweb_username: '',
      pisni_preizkusi: [],
      loading: true,
    }
  },

  created() {
    this.eviwebCheckLogin()
  },

  methods: {
    eviwebLogin() {
      if (this.eviweb_login_form.username !== '' && this.eviweb_login_form.password !== '') {
        this.error_message_eviweb = ''
        this.$axios
          .post(
            `${this.config.url_backend_aplikacije}/eviweb/encrypt_user_credits`,
            {
              username: this.eviweb_login_form.username,
              password: this.eviweb_login_form.password,
            },
            { validateStatus: false }
          )
          .then((response) => {
            if (response.status === 401) {
              return (this.error_message_eviweb = 'Napačno uporabniško ime ali geslo.')
            }
            const username = response.data.message.username
            const password = response.data.message.password

            this.$axios.get('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-eviweb', { validateStatus: false }).then((response) => {
              if (response.status === 404) {
                this.$axios
                  .post('https://graph.microsoft.com/v1.0/me/extensions', {
                    '@odata.type': 'microsoft.graph.openTypeExtension',
                    extensionName: 'com.scc-mobile-eviweb',
                    username: username,
                    password: password,
                    last_update: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
                  })
                  .then((response) => {
                    // eslint-disable-next-line no-console
                    console.log(response)
                    this.eviweb_login_dialog = false
                    this.eviwebCheckLogin()
                  })
                  .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error)
                  })
              } else {
                this.$axios
                  .patch('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-eviweb', {
                    username: username,
                    password: password,
                    last_update: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
                  })
                  .then((response) => {
                    // eslint-disable-next-line no-console
                    this.eviweb_login_dialog = false
                    this.eviwebCheckLogin()
                  })
                  .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error)
                  })
              }

              this.eviweb_login_dialog = false
            })
          })
      } else {
        this.error_message_eviweb = 'Vnesite uporabniško ime in geslo.'
      }
    },
    eviwebCheckLogin() {
      this.$axios
        .get('https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-eviweb', { validateStatus: false })
        .then((response) => {
          if (response.status === 200) {
            this.eviweb_password = response.data.password
            this.eviweb_username = response.data.username
            this.eviweb_login_dialog = false
            this.getPreizkusi()
          } else {
            this.eviweb_login_dialog = true
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },
    eviwebLoginClose() {
      this.eviweb_login_dialog = false
    },

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
