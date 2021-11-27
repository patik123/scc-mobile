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
                :weekdays="[1, 2, 3, 4, 5]"
                v-touch="{ left: () => $refs.timetable.next(), right: () => $refs.timetable.prev() }"
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
              <v-toolbar-title>{{ timetable_dialog_event.name }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items> </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-3">
              <v-list-item>
                <v-list-item-content >
                 <v-list-item-title><v-icon>person</v-icon></v-list-item-title>
                  <v-list-item-title v-for="element in timetable_dialog_event['teacher']" :key="element.id">{{ element.longname }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content >
                  <v-list-item-title><v-icon>school</v-icon></v-list-item-title>
                  <v-list-item-title v-for="element in timetable_dialog_event['classes']" :key="element.id">{{ element.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title><v-icon>meeting_room</v-icon></v-list-item-title>
                  <v-list-item-title v-for="element in timetable_dialog_event['room']" :key="element.id">{{ element.name }}</v-list-item-title>
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
    }
  },
  created() {
    this.getClasses()
    this.getTimetableColors()
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
      this.timetable_dialog_event = event.event
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
      this.$axios.get(this.config.default.url_backend_aplikacije + '/untis/get_status_data').then((response) => {
        this.timetable_colors = response.data.result
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
      this.updateTime()
      this.$axios.get(`${this.config.default.url_backend_aplikacije}/untis/get_class_timetable?class_id=${classId}&start_date=${startDate}&end_date=${endDate}`).then((response) => {
        const lessons = response.data.result
        lessons.forEach((lesson) => {
          this.timetable_events.push({
            name: lesson.su[0].longname,
            start: this.$moment(lesson.date + 'T' + lesson.startTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
            end: this.$moment(lesson.date + 'T' + lesson.endTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
            color: `#${this.timetable_colors.lstypes[0].ls.backColor}`,
            classes: lesson.kl,
            room: lesson.ro,
            teacher: lesson.te,
          })
        })
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
