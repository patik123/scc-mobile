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
                  <v-btn icon large fab @click="darkMode()">
                    <v-icon>{{ dark_light_icon }}</v-icon></v-btn
                  >
                </div>
              </v-card-text>
            </v-card>

            <!--      <v-card class="mt-3">
              <v-card-title>Povezane aplikacije</v-card-title>
              <v-card-text>
                <div>EviWeb</div>

                <div>Untis</div>
              </v-card-text>
            </v-card>
            -->
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
    return {}
  },

  created() {},

  methods: {},
}
</script>

<style scoped></style>
