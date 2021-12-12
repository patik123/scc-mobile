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
          <v-btn href="/Navodila.pdf" icon target="_blank"><v-icon>help_outline</v-icon></v-btn>
          <v-btn icon @click="darkMode()">
            <v-icon>{{ dark_light_icon }}</v-icon></v-btn
          >
          <v-btn @click="$auth.logout('aad')" icon><v-icon>logout</v-icon></v-btn>
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
            <div>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="new_event_dialog = true"><v-icon>add</v-icon><span class="d-none d-sm-flex">Dodaj dogodek</span></v-btn>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.prev()"><v-icon>navigate_before</v-icon><span class="d-none d-sm-flex">Nazaj</span></v-btn>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.next()"><span class="d-none d-sm-flex">Naprej</span><v-icon>navigate_next</v-icon></v-btn>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="changeCalendarView"
                ><span class="d-none d-sm-flex"></span><v-icon>{{ calendar_view_icon }}</v-icon></v-btn
              >
              <v-btn :color="getSchoolColor()" class="mb-3" @click="setToday"><v-icon>today</v-icon><span class="d-none d-sm-flex">Danes</span></v-btn>
            </div>
            <v-calendar
              ref="calendar"
              v-model="calendar"
              v-touch="{ left: () => $refs.calendar.next(), right: () => $refs.calendar.prev() }"
              :events="calendar_events"
              :type="calendar_view"
              :weekdays="[1, 2, 3, 4, 5, 6, 0]"
              @click:date="viewDay"
              @click:event="eventClick"
              @click:time="createNewEvent"
              @click:interval="createNewEvent"
              @change="getCalendarEvents"
            >
              <template #day-body="{ date, week }">
                <div class="v-current-time" :class="{ first: date === week[0].date }" :style="{ top: nowY() }"></div>
              </template>
            </v-calendar>
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
                <v-btn text :disabled="!new_event_modal.valid" @click="createNewEventSave()"> <v-icon>save</v-icon> </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-form v-model="new_event_modal.valid">
                <v-text-field
                  v-model="new_event_modal.event_name"
                  required
                  :color="getSchoolColor()"
                  :rules="[() => !!new_event_modal.event_name || 'To polje je zahtevano']"
                  :background-color="getSchoolColor()"
                  label="Naziv dogodka"
                  outlined
                ></v-text-field>

                <!-- Datum in čas začetka -->
                <v-row>
                  <v-col>
                    <v-menu ref="new_event_start_date_menu" :close-on-content-click="false" left transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="new_event_modal.start_date"
                          :rules="[() => !!new_event_modal.start_date || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Datum začetka"
                          readonly
                          outlined
                          v-bind="attrs"
                          required
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="new_event_modal.start_date" no-title color="#002f5f" background-color="#002f5f" first-day-of-week="1"></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col>
                    <v-menu ref="new_event_start_time_menu" :close-on-content-click="false" left :return-value.sync="new_event_modal.start_time" transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="new_event_modal.start_time"
                          :rules="[() => !!new_event_modal.start_time || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Čas začetka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-model="new_event_modal.start_time" color="#002f5f" background-color="#002f5f" format="24hr" @click:minute="$refs.new_event_start_time_menu.save(new_event_modal.start_time)"></v-time-picker>
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
                          v-model="new_event_modal.end_date"
                          :rules="[() => !!new_event_modal.end_date || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Datum zaključka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="new_event_modal.end_date" :min="new_event_modal.start_date" no-title color="#002f5f" background-color="#002f5f" first-day-of-week="1"></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col>
                    <v-menu ref="new_event_end_time_menu" :close-on-content-click="false" :return-value.sync="new_event_modal.end_time" left transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="new_event_modal.end_time"
                          :rules="[() => !!new_event_modal.end_time || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :background-color="getSchoolColor()"
                          label="Čas zaključka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-model="new_event_modal.end_time"
                        :min="new_event_modal.start_time"
                        flat
                        color="#002f5f"
                        background-color="#002f5f"
                        format="24hr"
                        @click:minute="$refs.new_event_end_time_menu.save(new_event_modal.end_time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <!-- Opomnik -->
                <div>
                  <v-select
                    v-model="new_event_modal.reminder"
                    :items="[
                      { text: 'Nikoli', value: 0 },
                      { text: '15 minut pred', value: 15 },
                      { text: '30 min pred', value: 30 },
                      { text: '1 ura pred', value: 60 },
                      { text: '2 uri pred', value: 120 },
                      { text: '4 uri pred', value: 240 },
                      { text: '12 ur pred', value: 720 },
                      { text: '1 dan pred', value: 1440 },
                    ]"
                    label="Opomnik"
                    :color="getSchoolColor()"
                    :item-color="schoolBGColor()"
                    outlined
                  ></v-select>
                </div>
                <!-- Opis dogodka -->
                <div>
                  <v-textarea v-model="new_event_modal.description" outlined label="Opis dogodka" :color="getSchoolColor()" :background-color="getSchoolColor()"></v-textarea>
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
                <v-btn v-if="edit_event_modal.conference_link !== ''" icon link target="_blank" :href="edit_event_modal.conference_link"> <v-icon>videocam</v-icon> </v-btn>
                <v-btn icon :disabled="edit_event_modal.isConference" @click="edit_event_update"> <v-icon>save</v-icon> </v-btn>
                <v-btn icon @click="edit_delete_event"> <v-icon>delete</v-icon> </v-btn>

                <v-btn v-if="edit_event_modal.web_link !== ''" icon link target="_blank" :href="edit_event_modal.web_link"> <v-icon>open_in_new</v-icon> </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-form v-model="edit_event_modal.valid">
                <v-text-field
                  label="Naziv dogodka"
                  :value="edit_event_modal.event_name"
                  :rules="[() => !!edit_event_modal.event_name || 'To polje je zahtevano']"
                  :disabled="edit_event_modal.isConference"
                  outlined
                  :color="getSchoolColor()"
                  :background-color="getSchoolColor()"
                ></v-text-field>
                <!-- Datum in čas začetka -->
                <v-row>
                  <v-col>
                    <v-menu ref="edit_event_start_date_menu" :close-on-content-click="false" left transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="edit_event_modal.start_date"
                          :rules="[() => !!edit_event_modal.start_date || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :disabled="edit_event_modal.isConference"
                          :background-color="getSchoolColor()"
                          label="Datum začetka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="edit_event_modal.start_date" no-title color="#002f5f" background-color="#002f5f" first-day-of-week="1"></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col>
                    <v-menu ref="edit_event_start_time_menu" :close-on-content-click="false" left :return-value.sync="edit_event_modal.start_time" transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="edit_event_modal.start_time"
                          :rules="[() => !!edit_event_modal.start_time || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :disabled="edit_event_modal.isConference"
                          :background-color="getSchoolColor()"
                          label="Čas začetka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker v-model="edit_event_modal.start_time" color="#002f5f" background-color="#002f5f" format="24hr" @click:minute="$refs.edit_event_start_time_menu.save(edit_event_modal.start_time)"></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <!-- Celodnevni dogodek -->
                <div></div>
                <!-- Čas konca -->
                <v-row>
                  <v-col>
                    <v-menu ref="edit_event_end_date_menu" :close-on-content-click="false" transition="scale-transition" left offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="edit_event_modal.end_date"
                          :rules="[() => !!edit_event_modal.end_date || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :disabled="edit_event_modal.isConference"
                          :background-color="getSchoolColor()"
                          label="Datum zaključka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="edit_event_modal.end_date" :min="edit_event_modal.start_date" no-title color="#002f5f" background-color="#002f5f" first-day-of-week="1"></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col>
                    <v-menu ref="edit_event_end_time_menu" :close-on-content-click="false" :return-value.sync="edit_event_modal.end_time" left transition="scale-transition" offset-y min-width="auto">
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="edit_event_modal.end_time"
                          :rules="[() => !!edit_event_modal.end_time || 'To polje je zahtevano']"
                          :color="getSchoolColor()"
                          :disabled="edit_event_modal.isConference"
                          :background-color="getSchoolColor()"
                          label="Čas zaključka"
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-model="edit_event_modal.end_time"
                        :min="edit_event_modal.start_time"
                        flat
                        color="#002f5f"
                        background-color="#002f5f"
                        format="24hr"
                        @click:minute="$refs.edit_event_end_time_menu.save(edit_event_modal.end_time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <!-- Opomnik -->
                <div>
                  <v-select
                    v-model="edit_event_modal.reminder"
                    :items="[
                      { text: 'Nikoli', value: 0 },
                      { text: '15 minut pred', value: 15 },
                      { text: '30 min pred', value: 30 },
                      { text: '1 ura pred', value: 60 },
                      { text: '2 uri pred', value: 120 },
                      { text: '4 uri pred', value: 240 },
                      { text: '12 ur pred', value: 720 },
                      { text: '1 dan pred', value: 1440 },
                    ]"
                    label="Opomnik"
                    :color="getSchoolColor()"
                    :item-color="schoolBGColor()"
                    outlined
                    :disabled="edit_event_modal.isConference"
                  ></v-select>
                </div>
                <!-- Opis dogodka -->
                <div>
                  <v-textarea v-model="edit_event_modal.description" outlined label="Opis dogodka" :disabled="edit_event_modal.isConference" :color="getSchoolColor()" :background-color="getSchoolColor()"></v-textarea>
                </div>
              </v-form>
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
      // Calendar variables
      calendar: null,
      calendar_events: [],
      calendar_view_icon: 'calendar_view_day',
      calendar_view: 'week',

      // Modal variables
      new_event_dialog: false,
      edit_event_dialog: false,
      edit_modal_polja: [],
      new_modal_polja: [],

      // New event modal variables
      new_event_modal: {
        valid: false,
        event_name: '',
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        reminder: 0,
        description: '',
      },

      // Edit event modal variables
      edit_event_modal: {
        isConference: false,
        valid: false,
        event_name: '',
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        reminder: 0,
        description: '',
        web_link: '',
        id: '',
        conference_link: '',
      },
    }
  },
  created() {
    this.$vuetify.lang.current = 'sl'

    if (this.$router.currentRoute.query.action === 'new-event') {
      this.new_event_dialog = true
    }
  },

  methods: {
    // Prikaz dogodka v modalu za urejanje
    eventClick(event) {
      const eventId = event.event.id
      this.$axios
        .get(`https://graph.microsoft.com/v1.0/me/events/${eventId}`)
        .then((response) => {
          this.edit_modal_polja = response.data
          this.edit_event_modal.event_name = response.data.subject
          this.edit_event_modal.isConference = response.data.isOnlineMeeting
          this.edit_event_modal.start_date = this.$moment(response.data.start.dateTime).utcOffset('+0200').format('YYYY-MM-DD')
          this.edit_event_modal.start_time = this.$moment(response.data.start.dateTime).utcOffset('+0200').format('HH:mm')
          this.edit_event_modal.end_date = this.$moment(response.data.end.dateTime).utcOffset('+0200').format('YYYY-MM-DD')
          this.edit_event_modal.end_time = this.$moment(response.data.end.dateTime).utcOffset('+0200').format('HH:mm')
          if (response.data.isReminderOn === true) {
            this.edit_event_modal.reminder = response.data.reminderMinutesBeforeStart
          } else {
            this.edit_event_modal.reminder = 0
          }
          this.edit_event_modal.description = response.data.bodyPreview
          if (this.edit_event_modal.isConference) {
            this.edit_event_modal.conference_link = response.data.onlineMeeting.joinUrl
          } else {
            this.edit_event_modal.conference_link = ''
          }
          this.edit_event_modal.id = response.data.id
          this.edit_event_modal.link = response.data.webLink
          this.edit_event_dialog = true
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error)
        })
    },

    closeEditDialog() {
      this.edit_event_modal.isConference = false
      this.edit_event_modal.valid = false
      this.edit_event_modal.event_name = ''
      this.edit_event_modal.start_date = null
      this.edit_event_modal.end_date = null
      this.edit_event_modal.start_time = null
      this.edit_event_modal.end_time = null
      this.edit_event_modal.reminder = 0
      this.edit_event_modal.description = ''
      this.edit_event_modal.web_link = ''
      this.edit_event_modal.event_id = ''
      this.edit_event_modal.conference_link = ''
      this.edit_event_dialog = false
    },

    // Posodobitev dogodka
    edit_event_update() {
      let remainder = false
      if (this.edit_event_modal.reminder !== 0) {
        remainder = true
      } else {
        remainder = false
      }
      this.$axios
        .patch(
          `https://graph.microsoft.com/v1.0/me/events/${this.edit_event_modal.id}`,
          {
            subject: this.edit_event_modal.event_name,
            start: {
              dateTime: this.edit_event_modal.start_date + 'T' + this.edit_event_modal.start_time + ':00',
              timeZone: 'Europe/Ljubljana',
            },
            end: {
              dateTime: this.edit_event_modal.end_date + 'T' + this.edit_event_modal.end_time + ':00',
              timeZone: 'Europe/Ljubljana',
            },
            body: {
              contentType: 'HTML',
              content: this.edit_event_modal.description,
            },
            isReminderOn: remainder,
            reminderMinutesBeforeStart: this.edit_event_modal.reminder,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          this.calendar_events = this.calendar_events.filter((event) => {
            return event.id !== this.edit_event_modal.id
          })
          this.calendar_events.push({
            id: response.data.id,
            name: response.data.subject,
            start: this.$moment(response.data.start.dateTime).format('YYYY-MM-DD HH:mm'),
            end: this.$moment(response.data.end.dateTime).format('YYYY-MM-DD HH:mm'),
            description: response.data.bodyPreview,
            url: response.data.webLink,
          })
          this.closeEditDialog()
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error)
        })
    },

    // Skok na današnji dan
    setToday() {
      this.calendar = ''
    },

    getCurrentTime() {
      return this.$refs.calendar ? this.$refs.calendar.times.now.hour * 60 + this.$refs.calendar.times.now.minute : 0
    },
    scrollToTime() {
      const time = this.getCurrentTime()
      const first = Math.max(0, time - (time % 30) - 30)

      this.$refs.calendar.scrollToTime(first)
    },

    viewDay({ date }) {
      this.calendar = date
      this.changeCalendarView()
    },

    // Izbris dogodka iz koledarja
    edit_delete_event() {
      this.restartErrorRequestNotification()
      this.$axios.delete(`https://graph.microsoft.com/v1.0/me/events/${this.edit_event_modal.id}`).then((response) => {
        if (response.status === 204) {
          this.closeEditDialog()
          this.calendar_events = this.calendar_events.filter((event) => {
            return event.id !== this.edit_event_modal.id
          })
        } else {
          this.showErrorRequestNotification()
        }
      })
    },

    changeCalendarView() {
      if (this.calendar_view === 'week') {
        this.calendar_view = 'day'
        this.calendar_view_icon = 'calendar_view_week'
        this.scrollToTime()
      } else {
        this.calendar_view = 'week'
        this.calendar_view_icon = 'calendar_view_day'
        this.scrollToTime()
      }
    },

    updateTime() {
      setInterval(() => this.$refs.calendar.updateTimes(), 60 * 1000)
    },

    nowY() {
      if (!this.$refs.calendar) return '-10px'
      return this.$refs.calendar.timeToY(this.$refs.calendar.times.now) + 'px'
    },

    // Odpre modal za ustvarjanje novega dogodka
    createNewEvent(event) {
      this.new_event_dialog = true
      this.new_modal_polja = event
    },

    // Zapre modal za ustvarjanje novega dogodka
    createNewEventClose() {
      this.new_event_dialog = false
      this.new_modal_polja = []
      this.new_event_modal.start_date = null
      this.new_event_modal.end_date = null
      this.new_event_modal.start_time = null
      this.new_event_modal.end_time = null
      this.new_event_modal.reminder = 0
      this.new_event_modal.description = ''
      this.new_event_modal.event_name = ''
    },

    // Shrani nov dogodek v koledar
    createNewEventSave() {
      this.restartErrorRequestNotification()

      // Nastavitev opomnika - zaradi ločenih nastavitev
      let remainder = false
      if (this.new_event_reminder !== 0) remainder = true
      else remainder = false

      // Shranjevanje dogodka v koledar (MS Graph API)
      this.$axios({
        url: 'https://graph.microsoft.com/v1.0/me/events',
        method: 'POST',
        data: {
          subject: this.new_event_modal.event_name,
          start: {
            dateTime: this.new_event_modal.start_date + 'T' + this.new_event_modal.start_time + ':00',
            timeZone: 'Europe/Ljubljana',
          },
          end: {
            dateTime: this.new_event_modal.end_date + 'T' + this.new_event_modal.end_time + ':00',
            timeZone: 'Europe/Ljubljana',
          },
          body: {
            contentType: 'HTML',
            content: this.new_event_modal.description,
          },
          isReminderOn: remainder,
          reminderMinutesBeforeStart: this.new_event_modal.reminder,
        },
      }).then(
        (response) => {
          this.calendar_events.push({
            id: response.data.id,
            name: response.data.subject,
            start: this.$moment(response.data.start.dateTime).format('YYYY-MM-DD HH:mm'),
            end: this.$moment(response.data.end.dateTime).format('YYYY-MM-DD HH:mm'),
            description: response.data.bodyPreview,
            url: response.data.webLink,
          })
          this.createNewEventClose()
        },
        (error) => {
          this.setRequestError()
          // eslint-disable-next-line
          console.log(error)
        }
      )
    },

    // Pridobi dogodke iz koledarja (MS Graph API)
    getCalendarEvents({ start, end }) {
      this.restartErrorRequestNotification()
      this.calendar_events = []
      this.$axios
        .get(`https://graph.microsoft.com/v1.0/me/calendarview?$select=id,subject,body,bodyPreview,start,webLink,end&startdatetime=${start.date}T00:00:00Z&enddatetime=${end.date}T23:59:00Z`)
        .then((response) => {
          const events = response.data.value
          this.scrollToTime()
          this.updateTime()
          events.forEach((event) => {
            this.calendar_events.push({
              id: event.id,
              name: event.subject,
              start: this.$moment(event.start.dateTime).utcOffset('+0200').format('YYYY-MM-DD HH:mm'),
              end: this.$moment(event.end.dateTime).utcOffset('+0200').format('YYYY-MM-DD HH:mm'),
              description: event.bodyPreview,
              url: event.webLink,
            })
          })
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error)
          this.setRequestError()
        })
    },
  },
}
</script>
<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
