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
          <MenuLinks :school-website="school_website()" :school="school" :show-nadomescanja="show_nadomescanja()" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <div>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="new_event_dialog = true"><v-icon>add</v-icon>Dodaj dogodek</v-btn>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.prev()"><v-icon>navigate_before</v-icon>Nazaj</v-btn>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.next()">Naprej<v-icon>navigate_next</v-icon></v-btn>
            </div>
            <v-calendar
              ref="calendar"
              v-model="calendar"
              :events="calendar_events"
              type="week"
               v-touch="{ left: () => $refs.calendar.next(), right: () => $refs.calendar.prev() }"
              @click:event="eventClick"
              @click:time="createNewEvent"
              @click:interval="createNewEvent"
              @change="getCalendarEvents"
            ></v-calendar>
          </v-container>
        </v-main>

        <!-- Modal for new event -->
        <v-dialog v-model="new_event_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar dark :color="getSchoolColor()">
              <v-btn icon dark @click="new_event_dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Nov dogodek</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="new_event_dialog = false"> Save </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-text-field label="Naziv dogodka" outlined></v-text-field>

              <!-- Čas začetka -->
              <!-- Celodnevni dogodek -->
              <div></div>
              <!-- Čas konca -->
              <div></div>

              <!-- Opomnik -->
              <div></div>
              <!-- Opis dogodka -->
              <div></div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- End of modal for new event -->

        <!-- Modal for editing events -->
        <v-dialog v-model="edit_event_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="edit_event_dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Uredi dogodek</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="edit_event_dialog = false"> Save </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text> Please stand by </v-card-text>
          </v-card>
        </v-dialog>
        <!-- End of modal for editing events -->
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'Koledar',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      calendar: null,
      calendar_events: [],
      new_event_dialog: false,
      edit_event_dialog: false,
      menu1: false,
    }
  },
  created() {
    this.$vuetify.lang.current = 'sl'
  },

  methods: {
    eventClick(event) {
      console.log(event.event)
    },

    createNewEvent(event) {
      this.new_event_dialog = true
    },

    getCalendarEvents({ start, end }) {
      this.calendar_events = []
      this.$axios
        .get(
          `https://graph.microsoft.com/v1.0/me/calendarview?$select=id,subject,body,bodyPreview,start,end,location,webLink,isOnlineMeeting,onlineMeeting&startdatetime=${start.date}T00:00:00Z&enddatetime=${end.date}T00:00:00Z`,
          {
            headers: {
              Authorization: this.$auth.$storage.getUniversal('_token.aad'),
            },
          }
        )
        .then((response) => {
          const events = response.data.value
          events.forEach((event) => {
            this.calendar_events.push({
              id: event.id,
              name: event.subject,
              start: this.$moment(event.start.dateTime).utcOffset('+0200').format('YYYY-MM-DD HH:mm'),
              end: this.$moment(event.end.dateTime).utcOffset('+0200').format('YYYY-MM-DD HH:mm'),
              location: event.location,
              description: event.bodyPreview,
              url: event.webLink,
              isOnlineMeeting: event.isOnlineMeeting,
            })
          })
        })
    },
  },
}
</script>
