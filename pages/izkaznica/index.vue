<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet class="no-radius" height="100%" width="100%">
        <v-app-bar>
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
            <div v-if="user_type === 'dijak'" class="text-center">
              <span>Trenutno ta izkaznica nima nikakršnega pomena za dijake - mogoče uporabljeno v prihodnosti</span>
              <BarCode :value="sifra_dijaka" font="Nuninto"> Težava s prikazom barcode </BarCode>
              <span class="d-block mb-3 font-weight-bold" style="font-size: 25px">{{ jwt_decoded.given_name + ' ' + jwt_decoded.family_name }}</span>
              <span class="d-block mb-1" style="font-size: 18px">{{ full_school_name() }}</span>
              <span class="d-block" style="font-size: 18px">{{ user_class }}</span>
            </div>
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
  name: 'ElektronskaIzkaznica',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      sifra_dijaka: '',
    }
  },

  created() {
    this.sifra_dijaka = this.jwt_decoded.unique_name.split('@')[0].split('.').pop()
  },
}
</script>
