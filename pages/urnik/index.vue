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
          <v-btn href="/Navodila.pdf" icon target="_blank" class="d-none d-sm-flex"><v-icon>help_outline</v-icon></v-btn>
          <v-btn icon @click="darkMode()">
            <v-icon>{{ dark_light_icon }}</v-icon></v-btn
          >
          <v-btn icon @click="$auth.logout('aad')"><v-icon>logout</v-icon></v-btn>
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
            <div v-if="timetable_class == ''">
              <v-skeleton-loader type="paragraph,paragraph,paragraph,paragraph,paragraph,paragraph,paragraph"></v-skeleton-loader>
            </div>

            <div v-if="timetable_class != ''">
              <div>
                <v-btn :color="getSchoolColor()" class="mb-3" @click="timetablePrev"><v-icon>navigate_before</v-icon><span class="d-none d-sm-flex">Nazaj</span></v-btn>
                <v-btn :color="getSchoolColor()" class="mb-3" @click="timetableNext"><span class="d-none d-sm-flex">Naprej</span><v-icon>navigate_next</v-icon></v-btn>
                <v-btn :color="getSchoolColor()" class="mb-3" @click="changeTimetableView"
                  ><span class="d-none d-sm-flex"></span><v-icon>{{ timetable_view_icon }}</v-icon></v-btn
                >
                <v-btn :color="getSchoolColor()" class="mb-3" @click="setToday"><v-icon>today</v-icon><span class="d-none d-sm-flex">Danes</span></v-btn>
              </div>
              <v-calendar
                ref="timetable"
                v-model="timetable"
                v-touch="{ left: () => timetableNext(), right: () => timetablePrev() }"
                :weekdays="[1, 2, 3, 4, 5]"
                locale="sl"
                :max-days="5"
                first-interval="6"
                interval-minutes="60"
                interval-count="10"
                :events="timetable_events"
                :type="timetable_view"
                @change="getTimetableEvents"
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
        <!-- Modal for show  class -->
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
                    <v-icon class="mr-2">schedule</v-icon>
                    <span class="mr-3" :class="timetable_dialog_content_class">{{ $moment(timetable_dialog_event.start, 'YYYY-MM-DDTH:mm').format('HH:mm') + ' - ' + $moment(timetable_dialog_event.end, 'YYYY-MM-DDTH:mm').format('HH:mm') }}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

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
      request_class: '',
      timetable_events: [],
      timetable: null,
      timetable_view: 'week',
      timetable_view_icon: 'calendar_view_day',
      timetable_dialog: false,
      timetable_dialog_event: {},
      timetable_dialog_content_class: '',
      timetable_class: '',
    }
  },
  created() {
    this.getClasses()

    if (this.$router.currentRoute.query.class) {
      this.request_class = this.$router.currentRoute.query.class
    } else {
      this.request_class = this.user_class
    }
  },

  mounted() {},

  methods: {
    getClasses() {
      this.$axios
        .get(this.config.url_backend_aplikacije + '/untis/get_classes')
        .then((response) => {
          const classes = response.data.result

          classes.forEach((element) => {
            if (element.name === this.request_class) {
              this.timetable_class = element
            }
          })
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error)
          this.setRequestError()
        })
    },

    setToday() {
      this.timetable = ''
    },

    closeTimetableDialog() {
      this.timetable_dialog = false
      this.timetable_dialog_event = {}
    },

    timetableNext() {
      this.$refs.timetable.next()
      this.timetable_events = []
    },

    timetablePrev() {
      this.$refs.timetable.prev()
      this.timetable_events = []
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

    interval_function() {
      if (this.$refs.timetable.updateTimes() !== undefined) {
        this.$refs.timetable.updateTimes()
      }
    },

    updateTime() {
      setInterval(() => this.interval_function(), 60 * 1000)
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
      this.restartErrorRequestNotification()
      this.timetable_events = []
      const startDate = this.$moment(start.date).format('YYYYMMDD')
      const endDate = this.$moment(end.date).format('YYYYMMDD')
      const classId = this.timetable_class.id
      this.scrollToTime()
      this.updateTime()
      this.$axios
        .get(`${this.config.url_backend_aplikacije}/untis/get_class_timetable?class_id=${classId}&start_date=${startDate}&end_date=${endDate}`)
        .then((response) => {
          const lessons = response.data.result

          if (lessons.error) {
            this.setRequestError()
            return
          }
          lessons.forEach((lesson) => {
            let eventColor
            let nadomescanje = false
            let odpadla = false
            const profesor = lesson.te[0] ? lesson.te[0] : ''
            const ucilnica = lesson.ro[0] ? lesson.ro[0] : ''
            const code = lesson.code ? lesson.code : ''

            // Določitev barve dogodka v urniku
            if (code === 'cancelled') {
              eventColor = `#${'b1b3b4'}`
              odpadla = true
            } else if (code === 'irregular') {
              eventColor = `#${'a781b5'}`
              nadomescanje = true
            } else if (profesor.orgname) {
              eventColor = `#${'a781b5'}`
              nadomescanje = true
            } else if (ucilnica.orgname){
               eventColor = `#${'a781b5'}`
              nadomescanje = true
            } else eventColor = `#${'f49f25'}`

            // Dodajanje dogodka v urnik
            this.timetable_events.push({
              name: `${lesson.su[0].name ? lesson.su[0].name : ''}  `,
              lesson_name: lesson.su[0].longname ? lesson.su[0].longname : '',
              activity: lesson.activityType ? lesson.activityType : '',
              start: this.$moment(lesson.date + 'T' + lesson.startTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
              end: this.$moment(lesson.date + 'T' + lesson.endTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
              color: eventColor,
              classes: lesson.kl ? lesson.kl : [],
              room: lesson.ro ? lesson.ro : [],
              teacher: lesson.te ? lesson.te : [],
              cancelled: odpadla,
              substitution: nadomescanje,
              substText: lesson.substText ? lesson.substText : '',
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
  watch: {
    $route(to, from) {
      if(to.query.class !== undefined) {
        this.request_class = to.query.class
        this.getClasses()
      }
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
