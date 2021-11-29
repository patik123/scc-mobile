<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet v-if="!$auth.loggedIn" class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-toolbar-title>Šolski center Celje</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon class="mr-2" @click="darkMode()">{{ dark_light_icon }}</v-icon>
          <v-icon @click="login()">login</v-icon>
        </v-app-bar>

        <v-main class="text-center">
          <img src="~/static/cvet_barvni.png" alt="ŠCC roža" width="100px" height="100px" class="mt-5" />

          <p class="mt-5 font-weight-bold" style="font-size: 25px">Mobilna aplikacija Šolskega centra Celje</p>
          <p class="mt-2" style="font-size: 20px">Aplikacija namenjena dijakom Šolskega centra Celje.</p>

          <img src="~/static/app_img.svg" alt="Aplikacija" class="mt-3 app-img" />
        </v-main>
      </v-sheet>

      <v-sheet v-if="$auth.loggedIn" class="no-radius" height="100%" width="100%">
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
          <MenuLinks :school-website="school_website()" :school="school" :show-nadomescanja="show_nadomescanja()" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <!-- BLIŽNICE DO DELOV APLIKACIJE -->
            <v-chip-group mandatory>
              <v-chip @click="goToPath('urnik')">
                <v-icon left>schedule</v-icon>
                Urnik
              </v-chip>

              <v-chip @click="goToPath('obvestila')">
                <v-icon left>notifications</v-icon>
                Obvestila
              </v-chip>

              <v-chip @click="goToPath('jedilnik')">
                <v-icon left>restaurant_menu</v-icon>
                Jedilnik
              </v-chip>
              <v-chip v-if="show_nadomescanja()" @click="goToPath('nadomescanja')">
                <v-icon left>shuffle</v-icon>
                Nadomeščanja
              </v-chip>

              <v-chip @click="goToPath('nadomescanja/nova')">
                <v-icon left>shuffle</v-icon>
                Nadomeščanja (nova)
              </v-chip>
            </v-chip-group>

            <!-- TRENUTNA URA -->

            <!-- PRIHAJAJOČI DOGODKI -->

            <!-- OPRAVILA -->
          </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
// Zaradi tega druga datoteka ker se tukaj ne izvede preusmeritve če uporabnik ni prijavljen
import basicFunctions from '~/assets/js/basic_functions.js'

export default {
  name: 'VstopnaStran',
  mixins: [basicFunctions],

  methods: {
    goToPath(path) {
      this.$router.push(`/${path}`)
    },
  },
}
</script>
<style scoped>
.app-img {
  width: 30%;
  height: 30%;
}
@media screen and (max-width: 960px) {
  .app-img {
    width: 50%;
    height: 50%;
  }
}
</style>
