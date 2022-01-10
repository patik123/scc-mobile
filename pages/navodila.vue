<template>
  <v-app>
    <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
    <errorRequestAlter v-if="request_error"></errorRequestAlter>
    <v-sheet class="no-radius" height="100%" width="100%">
      <v-app-bar class="navbar-z-index">
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

      <v-main>
        <v-container fluid>
          <div>
            <vue-pdf-app style="height: 100vh" pdf="/Navodila.pdf" :theme.sync="theme" page-scale="auto" :config="config_pdf"></vue-pdf-app>
          </div>
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
  methods: {},
}
</script>
<style scoped></style>
