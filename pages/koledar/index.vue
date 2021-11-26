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
              <v-btn :color="getSchoolColor()" class="mb-3" @click="new_event_dialog = true"><v-icon>add</v-icon><span class="d-none d-sm-flex">Dodaj dogodek</span></v-btn>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.prev()"><v-icon>navigate_before</v-icon><span class="d-none d-sm-flex">Nazaj</span></v-btn>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.next()"><span class="d-none d-sm-flex">Naprej</span><v-icon>navigate_next</v-icon></v-btn>
            </div>
            <v-calendar
              ref="calendar"
              v-model="calendar"
              v-touch="{ left: () => $refs.calendar.next(), right: () => $refs.calendar.prev() }"
              :events="calendar_events"
              type="week"
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
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="createNewEventClose()">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Nov dogodek</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn text @click="createNewEventSave()"> Save </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-form ref="new_event_form">
                <v-text-field v-model="new_event_event_name" :rules="[() => !!new_event_event_name || 'To polje je zahtevano']" :color="getSchoolColor()" :background-color="getSchoolColor()" label="Naziv dogodka" outlined></v-text-field>

                <!-- Datum in čas začetka -->
                <v-row>
                  <v-col>
                    <v-menu ref="new_event_start_date_menu" :close-on-content-click="false" left transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="new_event_start_date"
                          :rules="[() => !!new_event_start_date || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Datum začetka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="new_event_start_date" no-title :color="getSchoolColor()" first-day-of-week="1"></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col>
                    <v-menu ref="new_event_start_time_menu" :close-on-content-click="false" left :return-value.sync="new_event_start_time" transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="new_event_start_time"
                          :rules="[() => !!new_event_start_time || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Čas začetka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-model="new_event_start_time" :color="getSchoolColor()" flat format="24hr" @click:minute="$refs.new_event_start_time_menu.save(new_event_start_time)"></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <!-- Celodnevni dogodek -->
                <div></div>
                <!-- Čas konca -->
                <v-row>
                  <v-col>
                    <v-menu ref="new_event_end_date_menu" :close-on-content-click="false" transition="scale-transition" left offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="new_event_end_date"
                          :rules="[() => !!new_event_end_date || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Datum zaključka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="new_event_end_date" :min="new_event_start_date" no-title :color="getSchoolColor()" first-day-of-week="1"></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col>
                    <v-menu ref="new_event_end_time_menu" :close-on-content-click="false" :return-value.sync="new_event_end_time" left transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="new_event_end_time"
                          :rules="[() => !!new_event_end_time || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Čas zaključka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-model="new_event_end_time" :min="new_event_start_time" flat :color="getSchoolColor()" format="24hr" @click:minute="$refs.new_event_end_time_menu.save(new_event_end_time)"></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <!-- Opomnik -->
                <div>
                  <v-select
                    v-model="new_event_reminder"
                    :items="[
                      { text: 'Nikoli', value: 0 },
                      { text: '15 minut pred', value: 15 },
                      { text: '30 min pred', value: 30 },
                    ]"
                    label="Opomnik"
                    :color="getSchoolColor()"
                    :item-color="schoolBGColor()"
                    outlined
                  ></v-select>
                </div>
                <!-- Opis dogodka -->
                <div>
                  <v-textarea v-model="new_event_description" outlined label="Opis dogodka" :color="getSchoolColor()" :background-color="getSchoolColor()"></v-textarea>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- End of modal for new event -->

        <!-- Modal for editing events -->
        <v-dialog v-model="edit_event_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="edit_event_dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Uredi dogodek</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn text @click="edit_event_dialog = false"> Save </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-text-field label="Naziv dogodka" :value="edit_modal_polja.name" outlined></v-text-field>
            </v-card-text>
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
      edit_modal_polja: [],
      new_modal_polja: [],

      // New event modal variables
      new_event_valid: true,
      new_event_event_name: '',
      new_event_start_date: null,
      new_event_end_date: null,
      new_event_start_time: null,
      new_event_end_time: null,
      new_event_reminder: 0,
      new_event_description: '',
    }
  },
  created() {
    this.$vuetify.lang.current = 'sl'
  },

  methods: {
    eventClick(event) {
      console.log(event.event)
      this.edit_event_dialog = true
      this.edit_modal_polja = event.event
    },

    createNewEvent(event) {
      this.new_event_dialog = true
      this.new_modal_polja = event
      console.log(event)
    },

    createNewEventClose() {
      this.new_event_dialog = false
      this.new_modal_polja = []
      this.new_event_start_date = null
      this.new_event_end_date = null
      this.new_event_start_time = null
      this.new_event_end_time = null
    },

    createNewEventSave() {
      this.$axios({
        url: 'https://graph.microsoft.com/v1.0/me/events',
        method: 'POST',
        data: {
          subject: this.new_event_event_name,
          start: {
            dateTime: this.new_event_start_date + 'T' + this.new_event_start_time + ':00',
            timeZone: 'Europe/Ljubljana',
          },
          end: {
            dateTime: this.new_event_end_date + 'T' + this.new_event_end_time + ':00',
            timeZone: 'Europe/Ljubljana',
          },
          body: {
            contentType: 'HTML',
            content: this.new_event_description,
          },
        },
        headers: {
          Authorization: 'Bearer ' + this.access_token,
          'Content-Type': 'application/json',
        },
      }).then(
        (response) => {
          console.log(response)
          this.new_event_dialog = false
          this.new_modal_polja = []
          this.new_event_start_date = null
          this.new_event_end_date = null
        },
        (error) => {
          console.log(error)
        }
      )
    },

    getCalendarEvents({ start, end }) {
      this.calendar_events = []
      this.$axios
        .get(`https://graph.microsoft.com/v1.0/me/calendarview?$select=id,subject,body,bodyPreview,start,end,location,webLink,isOnlineMeeting,onlineMeeting&startdatetime=${start.date}T00:00:00Z&enddatetime=${end.date}T00:00:00Z`, {
          headers: {
            Authorization: this.$auth.$storage.getUniversal('_token.aad'),
          },
        })
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
