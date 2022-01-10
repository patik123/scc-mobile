<template>
  <v-app>
    <offline-alert v-if="$nuxt.isOffline"></offline-alert>
    <v-sheet class="no-radius" height="100%" width="100%">
      <v-app-bar>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Šolski center Celje</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="darkMode()">
          <v-icon>{{ dark_light_icon }}</v-icon></v-btn
        >
        <v-btn v-if="!$auth.loggedIn" icon @click="login()"><v-icon>login</v-icon></v-btn>
        <v-btn v-if="$auth.loggedIn" icon @click="$auth.logout('aad')"><v-icon>logout</v-icon></v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list v-if="$auth.loggedIn">
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6"> {{ user_data.first_name + ' ' + user_data.last_name }} </v-list-item-title>
              <v-list-item-subtitle>{{ user_class }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <MenuLinks v-if="$auth.loggedIn" :school-website="school_website()" :school="school" />
        <v-list-item v-else to="/" nuxt>
          <v-list-item-title><v-icon>home</v-icon> {{ $t('menu_items.domov') }}</v-list-item-title>
        </v-list-item>
      </v-navigation-drawer>

      <v-main class="text-center">
        <img src="~/static/cvet_barvni.png" alt="ŠCC roža" width="100px" height="100px" class="mt-5" />
        <div>
          <div v-if="error.statusCode === 404">
            <h3>Zahtevana stran ne obstaja</h3>
            <img src="~/static/not_found.svg" class="mt-2 not-found-img" alt="404 napaka" />
          </div>

          <div v-else>
            <h3>Napaka</h3>
            <img src="~/static/warning.svg" class="mt-2 warning-img" alt="Opozorilo" />
          </div>
          <v-btn class="mt-5" color="primary" to="/" nuxt>Nazaj na domačo stran</v-btn>
        </div>
      </v-main>
    </v-sheet>
  </v-app>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'
export default {
  name: 'Error',
  mixins: [basicFunctions],
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
}
</script>
<style scoped>
.not-found-img {
  width: 30%;
  height: 30%;
}
.warning-img {
  width: 30%;
  height: 30%;
}

@media screen and (max-width: 960px) {
  .not-found-img {
    width: 50%;
    height: 50%;
  }
  .warning-img {
    width: 50%;
    height: 50%;
  }
}
</style>
