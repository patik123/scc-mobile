<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
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
          <MenuLinks :school-website="school_website()" :school="school" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <img src="~/static/SC_Celje.png" alt="Logo Šolskega centra Celje" class="scc-logo" />

            <p>
              Verzija: <v-chip>{{ config.version }}</v-chip>
            </p>
            <p>Avtor: Patrick KOŠIR</p>
            <p>
              E-mail: <a :href="contactEmailLink">{{ config.contact_email }}</a>
            </p>

            <p>Mobilna aplikacija Šolskega centra Celje je namenjena vsem dijakom vseh srednjih šol Šolskega centra Celje in združuje najpomembnejše informacije potrebne za uspešno opravljanje šolskih obveznosti.</p>
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
  name: 'About',
  mixins: [basicFunctions, authMiddleware],

  computed: {
    contactEmailLink: function () {
      return `mailto:${this.config.contact_email}`
    },
  },
}
</script>
<style scoped>
.scc-logo {
  width: 160px;
  height: 90px;
}
</style>
