<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title>{{ $t('scc') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="$auth.logout('aad')" icon><v-icon>logout</v-icon></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary app>
          <v-list>
            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="text-h6"> {{ user_data.first_name + ' ' + user_data.last_name }} </v-list-item-title>
                <v-list-item-subtitle>{{ user_class }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
          <MenuLinks :school-website="school_website()" :school="school" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <img src="~/static/SC_Celje.png" alt="Logo Šolskega centra Celje" class="scc-logo" />

            <p>
              Verzija: <v-chip>{{ config.version }}</v-chip>
            </p>
            <p>Avtor: Patrick KOŠIR</p>
            <p>
              E-mail: <a :href="contactEmailLink">{{ config.contact_email }}</a>
            </p>

            <p>Mobilna aplikacija je namenjena dijakom in zaposlenim vseh srednjih šol Šolskega centra Celje.</p>

            <div>
              <iframe
                width="100%"
                height="450px"
                src="https://forms.office.com/Pages/ResponsePage.aspx?id=LqzK6Lz5lkOfGI3IDgRExckrds-p8kVPr90d71g_VkhUMldVS0ZVUTJCNVZMRVg2TEM1TEtXMFZFUi4u&embed=true"
                frameborder="0"
                marginwidth="0"
                marginheight="0"
                style="border: none; max-width: 100%; max-height: 100vh"
              >
              </iframe>
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
  name: 'About',
  mixins: [basicFunctions, authMiddleware],

  computed: {
    contactEmailLink: function () {
      return `mailto:${this.config.contact_email}`
    },
  },
}
</script>
<style scoped>
.scc-logo {
  width: 160px;
  height: 90px;
}
</style>
