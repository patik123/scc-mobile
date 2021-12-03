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
            <v-tabs v-model="tab" grow right :active-class="getSchoolColor()" :slider-color="getSchoolColor()">
              <v-tab> Danes </v-tab>
              <v-tab> Jutri </v-tab>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <div class="mt-2" style="margin: 0px; padding: 0px; overflow: hidden">
                    <iframe class="mt-2" :src="nadomescanjaDanesUrl()" frameborder="0" width="98%" height="1000"></iframe>
                  </div>
                </v-tab-item>

                <v-tab-item>
                  <div class="mt-2" style="margin: 0px; padding: 0px; overflow: hidden">
                    <iframe class="mt-2" :src="nadomescanjaJutriUrl()" frameborder="0" width="98%" height="1000"></iframe>
                  </div>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
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
  name: 'NadomescanjaNova',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      tab: null,
    }
  },
  methods: {
    nadomescanjaDanesUrl() {
      return `https://ajax.webuntis.com/WebUntis/monitor?school=sc-celje&monitorType=subst&format=Nadome%C5%A1%C4%8Danja%20-%20${this.school}`
    },

    nadomescanjaJutriUrl() {
      return `https://ajax.webuntis.com/WebUntis/monitor?school=sc-celje&monitorType=subst&format=Nadome%C5%A1%C4%8Danja%20-%20${this.school}1`
    },
  },
}
</script>
<style scoped></style>
