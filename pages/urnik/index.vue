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
          <MenuLinks :school-website="school_website()" :school="school" :show-nadomescanja="show_nadomescanja()" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <div v-if="user_razred == ''">
              <v-skeleton-loader type="paragraph,paragraph,paragraph,paragraph,paragraph,paragraph,paragraph"></v-skeleton-loader>
            </div>

            <div v-if="user_razred != ''">
              <div>
                <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.timetable.prev()"><v-icon>navigate_before</v-icon><span class="d-none d-sm-flex">Nazaj</span></v-btn>
                <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.timetable.next()"><span class="d-none d-sm-flex">Naprej</span><v-icon>navigate_next</v-icon></v-btn>
                <v-btn :color="getSchoolColor()" class="mb-3" @click="changeTimetableView"
                  ><span class="d-none d-sm-flex"></span><v-icon>{{ timetable_view_icon }}</v-icon></v-btn
                >
                <v-btn :color="getSchoolColor()" class="mb-3" @click="setToday"><v-icon>today</v-icon><span class="d-none d-sm-flex">Danes</span></v-btn>
              </div>
              <v-calendar
                ref="timetable"
                v-model="timetable"
                v-touch="{ left: () => $refs.timetable.next(), right: () => $refs.timetable.prev() }"
                :weekdays="[1, 2, 3, 4, 5]"
                locale="sl"
                :max-days="5"
                first-interval="6"
                interval-minutes="60"
                interval-count="10"
                :events="timetable_events"
                :type="timetable_view"
                @change="getTimetableEvents"
                @click:more="viewDay"
                @click:date="viewDay"
                @click:event="openTimetableDialog"
              >
                <template #day-body="{ date, week }">
                  <div class="v-current-time" :class="{ first: date === week[0].date }" :style="{ top: nowY() }"></div>
                </template>
              </v-calendar>
            </div>
          </v-container>
        </v-main>
        <!-- Modal for new event -->
        <v-dialog v-model="timetable_dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar :color="getSchoolColor()">
              <v-btn icon @click="closeTimetableDialog()">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ timetable_dialog_event.activity }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">subject</v-icon>
                    <span class="mr-3" :class="timetable_dialog_content_class">{{ timetable_dialog_event.lesson_name }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">person</v-icon>
                    <span v-for="element in timetable_dialog_event['teacher']" :id="element.id" :key="element.id" :class="timetable_dialog_content_class" class="mr-3">{{ element.longname }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">school</v-icon>
                    <span v-for="element in timetable_dialog_event['classes']" :id="element.id" :key="element.id" :class="timetable_dialog_content_class" class="mr-3">{{ element.name }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">meeting_room</v-icon>
                    <span v-for="element in timetable_dialog_event['room']" :id="element.id" :key="element.id" :class="timetable_dialog_content_class" class="mr-3">{{ element.name }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-if="timetable_dialog_event.substText !== ''">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon class="mr-2">description</v-icon>
                    <span class="mr-3">{{ timetable_dialog_event.substText }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'Urnik',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      user_razred: '',
      timetable_events: [],
      timetable: null,
      timetable_colors: [],
      timetable_view: 'week',
      timetable_view_icon: 'calendar_view_day',
      timetable_dialog: false,
      timetable_dialog_event: {},
      timetable_dialog_content_class: '',
    }
  },
  created() {
    this.getClasses()
    this.getTimetableColors()
    console.log(this.request_error)
  },

  mounted() {},

  methods: {
    getClasses() {
      this.$axios.get(this.config.default.url_backend_aplikacije + '/untis/get_classes').then((response) => {
        const classes = response.data.result

        classes.forEach((element) => {
          if (element.name === this.user_class) {
            this.user_razred = element
          }
        })
      })
    },

    setToday() {
      this.timetable = ''
    },

    closeTimetableDialog() {
      this.timetable_dialog = false
      this.timetable_dialog_event = {}
    },

    openTimetableDialog(event) {
      this.timetable_dialog_content_class = ''
      this.timetable_dialog_event = event.event
      if (event.event.cancelled === true) {
        this.timetable_dialog_content_class = 'text-decoration-line-through'
      }
      this.timetable_dialog = true
    },

    viewDay({ date }) {
      this.timetable = date
      this.timetable_events = []
      this.changeTimetableView()
    },

    getCurrentTime() {
      return this.$refs.timetable ? this.$refs.timetable.times.now.hour * 60 + this.$refs.timetable.times.now.minute : 0
    },
    scrollToTime() {
      const time = this.getCurrentTime()
      const first = Math.max(0, time - (time % 30) - 30)

      this.$refs.timetable.scrollToTime(first)
    },

    updateTime() {
      setInterval(() => this.$refs.timetable.updateTimes(), 60 * 1000)
    },

    getTimetableColors() {
      this.$axios
        .get(this.config.default.url_backend_aplikacije + '/untis/get_status_data')
        .then((response) => {
          this.timetable_colors = response.data.result
        })
        .catch((error) => {
          console.log(error)
          this.setRequestError()
        })
    },

    changeTimetableView() {
      if (this.timetable_view === 'week') {
        this.timetable_view = 'day'
        this.timetable_view_icon = 'calendar_view_week'
        this.scrollToTime()
      } else {
        this.timetable_view = 'week'
        this.timetable_view_icon = 'calendar_view_day'
        this.scrollToTime()
      }
    },

    nowY() {
      if (!this.$refs.timetable) return '-10px'
      return this.$refs.timetable.timeToY(this.$refs.timetable.times.now) + 'px'
    },

    getTimetableEvents({ start, end }) {
      this.timetable_events = []
      const startDate = this.$moment(start.date).format('YYYYMMDD')
      const endDate = this.$moment(end.date).format('YYYYMMDD')
      const classId = this.user_razred.id
      this.scrollToTime()
      this.$axios
        .get(`${this.config.default.url_backend_aplikacije}/untis/get_class_timetable?class_id=${classId}&start_date=${startDate}&end_date=${endDate}`)
        .then((response) => {
          const lessons = response.data.result
          lessons.forEach((lesson) => {
            let eventColor
            let nadomescanje = false
            let odpadla = false
            const code = lesson.code ? lesson.code : ''

            // Določitev barve dogodka v urniku
            if (code === 'cancelled') {
              eventColor = `#${this.timetable_colors.codes[0].cancelled.backColor}`
              odpadla = true
            } else if (code === 'irregular') {
              eventColor = `#${this.timetable_colors.codes[1].irregular.backColor}`
              nadomescanje = true
            } else if (lesson.te[0].orgname) {
              eventColor = `#${this.timetable_colors.codes[1].irregular.backColor}`
              nadomescanje = true
            } else eventColor = `#${this.timetable_colors.lstypes[0].ls.backColor}`

            // Dodajanje dogodka v urnik
            this.timetable_events.push({
              name: lesson.su[0].name + ' ' + lesson.ro[0].name,
              lesson_name: lesson.su[0].longname,
              activity: lesson.activityType,
              start: this.$moment(lesson.date + 'T' + lesson.startTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
              end: this.$moment(lesson.date + 'T' + lesson.endTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
              color: eventColor,
              classes: lesson.kl,
              room: lesson.ro,
              teacher: lesson.te,
              cancelled: odpadla,
              substitution: nadomescanje,
              substText: lesson.substText ? lesson.substText : '',
            })
          })
        })
        .catch((error) => {
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
