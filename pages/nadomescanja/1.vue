<template>
  <div>
    <v-app>
      <offline-alert v-if="$nuxt.isOffline"></offline-alert>
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
          <MenuLinks :school-website="school_website()" :show-nadomescanja="show_nadomescanja()" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
             <v-tabs v-model="tab" background-color="transparent" right grow>
            <v-tab >
            Danes
            </v-tab>
                 <v-tab >
            Jutri
            </v-tab>
          </v-tabs>

            <v-tabs-items v-model="tab">
                  <v-tab-item v-for="0">
Tab 1
                    <v-tab-item>
                                      <v-tab-item v-for="1">
Tab 2
                    <v-tab-item>
                  </v-tabs-items>
          </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions_other.js'

export default {
  name: 'Nadomescanja1',
  mixins: [basicFunctions],
  data: {
      tab: null,
  }
}
</script>