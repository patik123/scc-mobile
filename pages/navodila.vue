<template>
  <v-app>
    <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
    <errorRequestAlter v-if="request_error"></errorRequestAlter>
    <v-sheet class="no-radius" height="100%" width="100%">
      <v-app-bar>
        <v-toolbar-title>Šolski center Celje</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="darkMode()">
          <v-icon>{{ dark_light_icon }}</v-icon></v-btn
        >
        <v-btn v-if="!$auth.loggedIn" icon @click="login()"><v-icon>login</v-icon></v-btn>
        <v-btn v-if="$auth.loggedIn" icon @click="$auth.logout('aad')"><v-icon>logout</v-icon></v-btn>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <vue-pdf-app style="height: 100vh" pdf="/Navodila.pdf" page-scale="auto" :config="config_pdf"></vue-pdf-app>
        </v-container>
      </v-main>
    </v-sheet>
  </v-app>
</template>

<script>
import VuePdfApp from 'vue-pdf-app'
import basicFunctions from '~/assets/js/basic_functions.js'
import 'vue-pdf-app/dist/icons/main.css'

export default {
  name: 'Navodila',
  mixins: [basicFunctions],
  components: {
    VuePdfApp,
  },
  data() {
    return {
      config_pdf: {
        sidebar: false,
        toolbar: {
          toolbarViewerLeft: false,
          toolbarViewerRight: {
            presentationMode: false,
            openFile: false,
            print: true,
            download: true,
            viewBookmark: false,
          },
        },
        secondaryToolbar: false,
      },
    }
  },
}
</script>
<style scoped></style>
