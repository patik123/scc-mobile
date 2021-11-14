<template>
  <v-app>
    <offline-alert v-if="$nuxt.isOffline"></offline-alert>
    <v-sheet class="no-radius" height="100%" width="100%">
      <v-app-bar>
        <v-toolbar-title>Šolski center Celje</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-2" @click="darkMode()">{{ dark_light_icon }}</v-icon>
        <v-icon v-if="!$auth.loggedIn" @click="login()">login</v-icon>
        <v-icon v-if="$auth.loggedIn" @click="logout()">logout</v-icon>
      </v-app-bar>

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
  methods: {
    logout() {
      this.$auth.logout()
      this.$router.push('/')
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
