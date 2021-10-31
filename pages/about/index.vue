<template>
  <div class="">
    <v-app>
      <v-card class="no-radius" height="100%" width="100%">
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
            <img src="~/static/SC_Celje.png" alt="Logo Šolskega centra Celje" class="scc-logo" />

            <p>
              Verzija: <v-chip>{{ config.default.version }}</v-chip>
            </p>
            <p>Avtor: Patrick KOŠIR</p>
            <p>E-mail: {{ config.default.contact_email }}</p>

            <p>
              Mobilna aplikacija Šolskega centra Celje je namenjena vsem dijakom vseh srednjih šol Šolskega centra Celje in združuje najpomembnejše informacije potrebne za uspešno opravljanje šolskih
              obveznosti.
            </p>
          </v-container>
        </v-main>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions_other.js'

export default {
  name: 'About',
  mixins: [basicFunctions],
}
</script>
<style scoped>
.scc-logo {
  width: 160px;
  height: 90px;
}
</style>
