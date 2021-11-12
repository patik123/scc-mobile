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
          <v-container fluid> </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions_other.js'

export default {
  name: 'Koledar',
  mixins: [basicFunctions],
  data() {
    return {
      calendar_id: '',
      calendar_events: [],
    }
  },
  created() {
    this.getUserCalendarEvents()
  },

  methods: {
    getUserCalendarEvents() {
      this.$axios
        .get('https://graph.microsoft.com/beta/me/calendars', {
          headers: {
            Authorization: this.$auth.$storage.getUniversal('_token.aad'),
          },
        })
        .then((response) => {
          this.calendar_id = response.data.value[0].id
          console.log(response.data)
          this.getCalendarEvents()
        })
    },

    getCalendarEvents() {
      this.$axios
        .get(
          'https://graph.microsoft.com/beta/me/calendars/' +
            this.calendar_id +
            '/events?$select=subject,body,bodyPreview,start,end,location&startdatetime=2021-11-12T11:29:18.417Z&enddatetime=2021-11-19T11:29:18.417Z',
          {
            headers: {
              Authorization: this.$auth.$storage.getUniversal('_token.aad'),
            },
          }
        )
        .then((response) => {
          this.calendar_events = response.data.value
          console.log(response.data)
        })
    },
  },
}
</script>
