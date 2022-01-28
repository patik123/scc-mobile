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
            <v-card>
              <v-card-title>Moji podatki</v-card-title>
              <v-card-text>
                <div class="font-weight-bold">{{ user_data.first_name + ' ' + user_data.last_name }}</div>
                <div>{{ user_data.email }}</div>
                <div>{{ config[school].full_school_name }}</div>
                <div v-if="user_type === 'dijak'">{{ user_class }}</div>
              </v-card-text>
            </v-card>

            <v-card class="mt-3">
              <v-card-title>Tema aplikacije</v-card-title>
              <v-card-text>
                <div class="text-center">
                  <p>{{ theme === 'dark' ? 'Temna tema' : 'Svetla tema' }}</p>
                  <v-btn icon large fab @click="darkMode()">
                    <v-icon>{{ dark_light_icon }}</v-icon></v-btn
                  >
                </div>
              </v-card-text>
            </v-card>

            <v-card class="mt-3">
              <v-card-title>Povezane aplikacije</v-card-title>
              <v-card-text>
                <div class="font-weight-bold">EviWeb</div>
                <div v-if="!eviweb_check">
                  <v-skeleton-loader class="mt-2" type="heading"></v-skeleton-loader>
                  <v-skeleton-loader class="mt-2" type="heading"></v-skeleton-loader>
                  <v-skeleton-loader class="mt-2" type="button"></v-skeleton-loader>
                </div>
                <div v-if="eviweb_check">
                  <div v-if="eviweb_available">
                    <p>
                      Uporabniško ime: <span class="font-weight-bold">{{ eviweb_username }}</span>
                    </p>

                    <p>
                      Povezano od: <span class="font-weight-bold">{{ $moment(eviweb_connected_at).format('DD. MM. YYYY HH:mm:ss') }}</span>
                    </p>
                  </div>
                  <v-btn v-if="!eviweb_available" @click="eviwebLoginOpen" color="success">Poveži moj račun z EviWebom</v-btn>
                  <v-btn v-if="eviweb_available" class="text-wrap" @click="eviwebRemove" color="error">Prekini povezavo z EviWebom</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-container>
        </v-main>

        <!-- EviWeb povezava dialog -->
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
              <div class="mb-3">Aplikacija potrebuje vnos vašega gesla in uporabniškega imena od vašega EviWeba, da lahko komunicira z EviWebom. Vaše geslo in uporabniško ime se v šifrirani obliki shrani v vaš Microsft Office račun.</div>
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
      eviweb_check: false,
      eviweb_connected_at: '',
      error_message_eviweb: '',
      eviweb_login_dialog: false,
      eviweb_login_form: {
        valid: false,
        username: '',
        password: '',
      },
    }
  },

  created() {
    this.checkEviLogin()
  },

  methods: {
    eviwebRemove() {
      this.$axios.delete(`https://graph.microsoft.com/v1.0/me/extensions/com.scc-mobile-eviweb`, { validateStatus: false }).then((response) => {
        this.checkEviLogin()
      })
    },

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
                    this.checkEviLogin()
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

    eviwebLoginClose() {
      this.eviweb_login_dialog = false
    },

    eviwebLoginOpen() {
      this.eviweb_login_dialog = true
    },
  },
}
</script>

<style scoped></style>
