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
          <h1>Mnenja</h1>
          <p><b>Vsem se zahvaljujem, za uporabo aplikacije ŠCC Mobile. </b></p>

          <p>Vaša mnenja mi pomagajo izboljšati aplikacijo in pripomogla k uresničitvi moje želje, da bi se aplikacija uradno znašla na Šolskem centru Celje.</p>

          <iframe
            width="100%"
            height="700px"
            src="https://forms.office.com/Pages/ResponsePage.aspx?id=LqzK6Lz5lkOfGI3IDgRExckrds-p8kVPr90d71g_VkhUNlFZMjgwUFBHVDlZTEZOQ0RQQTJRUDdBNi4u&embed=true"
            frameborder="0"
            marginwidth="0"
            marginheight="0"
            style="border: none; max-width: 100%; max-height: 100vh"
            allowfullscreen
            webkitallowfullscreen
            mozallowfullscreen
            msallowfullscreen
          >
          </iframe>
        </v-container>
      </v-main>
    </v-sheet>
  </v-app>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'

export default {
  name: 'Navodila',
  mixins: [basicFunctions],

  data() {
    return {}
  },
  methods: {},
}
</script>
<style scoped></style>
