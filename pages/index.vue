<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet v-if="!$auth.loggedIn" class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>{{ $t('scc') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="login()"><v-icon>login</v-icon></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app absolute temporary>
          <v-list nav dense shaped>
            <v-list-item-group :active-class="schoolBGColor()">
              <v-list-item to="/" nuxt>
                <v-list-item-title><v-icon>home</v-icon> {{ $t('menu_items.domov') }}</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item to="/navodila" nuxt>
                <v-list-item-title><v-icon>help_outline</v-icon> {{ $t('menu_items.navodila') }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>

        <v-main class="text-center">
          <img src="~/static/cvet_barvni.png" alt="ŠCC roža" width="100px" height="100px" class="mt-5" />

          <p class="mt-5 font-weight-bold" style="font-size: 25px">{{ $t('scc_mobile') }}</p>
          <p class="mt-2" style="font-size: 20px">{{ $t('scc_mobile_description') }}</p>

          <img src="~/static/app_img.svg" alt="Aplikacija" class="mt-3 app-img" />
        </v-main>
      </v-sheet>

      <v-sheet v-if="$auth.loggedIn" class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>{{ $t('scc') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="$auth.logout('aad')"><v-icon>logout</v-icon></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary app>
          <v-list v-if="$auth.loggedIn">
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
            <v-alert type="info" dismissible text
              >V aplikacijo je po novem integrirane funkcije EviWeba (pregled ocen, pregled ocenjevanj znanja in izostankov). 
            </v-alert>
            <!-- BLIŽNICE DO DELOV APLIKACIJE -->
            <v-chip-group mandatory>
              <v-chip @click="goToPath('urnik')">
                <v-icon left>schedule</v-icon>
                {{ $t('functions.urnik') }}
              </v-chip>

              <v-chip @click="goToPath('obvestila')">
                <v-icon left>notifications</v-icon>
                {{ $t('functions.obvestila') }}
              </v-chip>

              <v-chip @click="goToPath('jedilnik')">
                <v-icon left>restaurant_menu</v-icon>
                {{ $t('functions.jedilnik') }}
              </v-chip>

              <v-chip @click="goToPath('nadomescanja')">
                <v-icon left>shuffle</v-icon>
                {{ $t('functions.nadomescanja') }}
              </v-chip>
            </v-chip-group>

            <div class="mt-2 mb-3">
              <span class="user-greatting">{{ getGreeting() }}</span>
            </div>

            <!-- TRENUTNA URA -->
            <div v-if="current_lesson_available === true" id="lesson-now">
              <v-card>
                <div>
                  <v-card-title :class="getSchoolColor()" class="title"
                    >{{ $t('first_page.trenutna_ura') }}<v-spacer></v-spacer
                    ><v-btn :class="getSchoolColor()" @click="$router.push('/urnik')"
                      ><v-icon>calendar_today</v-icon><span class="d-none d-sm-flex"> {{ $t('first_page.moj_urnik') }}</span></v-btn
                    ></v-card-title
                  >
                </div>
                <v-divider></v-divider>
                <v-card-text v-for="lesson in current_lessons" :key="lesson.id">
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-card-text>
                          <v-icon class="mr-2">school</v-icon>
                          <span class="mr-3">{{ lesson.lesson_name }}</span>
                        </v-card-text>
                        <v-row>
                          <v-col>
                            <v-card-text>
                              <v-icon class="mr-2">schedule</v-icon>
                              <span class="mr-3">{{ $moment(lesson.start, 'YYYY-MM-DDTH:mm').format('HH:mm') + ' - ' + $moment(lesson.end, 'YYYY-MM-DDTH:mm').format('HH:mm') }}</span>
                            </v-card-text>

                            <v-card-text>
                              <v-icon class="mr-2">info</v-icon>
                              <span class="mr-3">{{ lesson.activity }}</span>
                            </v-card-text>
                          </v-col>

                          <v-col>
                            <v-card-text>
                              <v-icon class="mr-2">person</v-icon>
                              <span v-for="element in lesson['teacher']" :id="element.id" :key="element.id" class="mr-3">{{ element.longname }}</span>
                            </v-card-text>

                            <v-card-text>
                              <v-icon class="mr-2">meeting_room</v-icon>
                              <span v-for="element in lesson['room']" :id="element.id" :key="element.id" class="mr-3">{{ element.name }}</span>
                            </v-card-text>
                          </v-col>
                        </v-row>
                        <v-divider></v-divider>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>

            <!-- PRIHAJAJOČI DOGODKI -->

            <div id="events">
              <v-card class="mt-5">
                <v-card-title :class="getSchoolColor()" class="title"
                  >{{ $t('first_page.prihajajoci_dogodki') }}<v-spacer></v-spacer
                  ><v-btn :class="getSchoolColor()" @click="$router.push('/koledar?action=new-event')"
                    ><v-icon>add</v-icon><span class="d-none d-sm-flex">{{ $t('first_page.nov_dogodek') }}</span></v-btn
                  ></v-card-title
                >
                <v-divider></v-divider>

                <v-list v-if="events.length === 0" two-line>
                  <div>
                    <v-list-item>
                      <v-list-item-content>
                        <div class="text-center">
                          <v-list-item-title class="text-wrap">{{ $t('first_page.ni_dogodkov') }}</v-list-item-title>
                          <img src="~/static/calendar.svg" alt="Slika koledarja " class="widget-img mt-2" />
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </v-list>

                <v-list two-line>
                  <v-list-item v-for="event in events" :key="event.id">
                    <v-list-item-content>
                      <v-list-item-title class="text-wrap">{{ event.subject }}</v-list-item-title>
                      <v-list-item-subtitle class="text-wrap">{{
                        `${$moment(event.start.dateTime).utcOffset('+0200').format('dddd DD. MM. YYYY HH:mm')} - ${$moment(event.end.dateTime).utcOffset('+0200').format('dddd DD. MM. YYYY HH:mm')}`
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </div>

            <!-- OPRAVILA -->

            <div id="tasks">
              <v-card class="mt-5">
                <v-card-title class="title" :class="getSchoolColor()"
                  >{{ $t('first_page.opravila') }}<v-spacer></v-spacer
                  ><v-btn :class="getSchoolColor()" @click="$router.push('/opravila?action=new-task')"
                    ><v-icon>add</v-icon><span class="d-none d-sm-flex">{{ $t('first_page.novo_opravilo') }}</span></v-btn
                  ></v-card-title
                >
                <v-divider></v-divider>
                <v-list v-if="tasks.length === 0" two-line>
                  <div>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <div class="text-center">
                          <v-list-item-title class="text-wrap">{{ $t('first_page.ni_opravil') }}</v-list-item-title>
                          <img src="~/static/tasks.svg" alt="Slika opravil " class="widget-img mt-2" />
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </v-list>

                <v-list two-line>
                  <div v-for="task in tasks" :key="task.id" :data-id="task.id" @dblclick="markAsDoneTask">
                    <v-list-item two-line>
                      <v-list-item-content :class="{ 'task-done': task.status === 'completed' }">
                        <v-list-item-title class="text-wrap">{{ task.title }}</v-list-item-title>
                        <v-list-item-subtitle v-if="task.dueDateTime" class="text-wrap" :class="{ 'task-overdue': $moment().isAfter($moment(task.dueDateTime.dateTime)) }">{{
                          $moment(task.dueDateTime.dateTime).utcOffset('+0200').format('DD. MM. YYYY')
                        }}</v-list-item-subtitle>
                        <v-divider></v-divider>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </v-list>
              </v-card>
            </div>
          </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
// Zaradi tega druga datoteka ker se tukaj ne izvede preusmeritve če uporabnik ni prijavljen
import basicFunctions from '~/assets/js/basic_functions.js'
import 'moment/locale/sl'
export default {
  name: 'DomacaStran',
  mixins: [basicFunctions],

  data() {
    return {
      events: [],
      timetable_class: '',
      timetable_events: [],
      current_lessons: [],
      current_lesson_available: false,
      task_list_id: '',
      tasks: [],
    }
  },

  created() {
    if (this.$auth.loggedIn) {
      this.getCalendarEvents()
      this.getTaskList()
      this.checkEviLogin()

      if (this.user_type === 'dijak' && this.user_class !== null) {
        this.getClasses()
      }
    }
    this.$moment.locale('sl')
  },

  methods: {
    goToPath(path) {
      this.$router.push(`/${path}`)
    },

    getClasses() {
      this.$axios
        .get(this.config.url_backend_aplikacije + '/untis/get_classes')
        .then((response) => {
          const classes = response.data.result

          classes.forEach((element) => {
            if (element.name === this.user_class) {
              this.timetable_class = element
            }
          })
          this.getTimetable()
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error)
          this.setRequestError()
        })
    },

    getTimetable() {
      const startDate = this.$moment().format('YYYYMMDD')
      const endDate = this.$moment().format('YYYYMMDD')
      const classId = this.timetable_class.id
      this.timetable_events = []
      this.$axios
        .get(`${this.config.url_backend_aplikacije}/untis/get_class_timetable?class_id=${classId}&start_date=${startDate}&end_date=${endDate}`)
        .then((response) => {
          const lessons = response.data.result

          if (lessons.error) {
            this.setRequestError()
            return
          }
          lessons.forEach((lesson) => {
            // Dodajanje dogodka v urnik
            this.timetable_events.push({
              id: lesson.id,
              name: `${lesson.su[0].name ? lesson.su[0].name : ''}  `,
              lesson_name: lesson.su[0].longname ? lesson.su[0].longname : '',
              activity: lesson.activityType ? lesson.activityType : '',
              start: this.$moment(lesson.date + 'T' + lesson.startTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
              end: this.$moment(lesson.date + 'T' + lesson.endTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
              classes: lesson.kl ? lesson.kl : [],
              room: lesson.ro ? lesson.ro : [],
              teacher: lesson.te ? lesson.te : [],
              substText: lesson.substText ? lesson.substText : '',
            })
          })

          this.getCurrentLesson()
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error)
          this.setRequestError()
        })
    },

    getCalendarEvents() {
      const startDate = this.$moment().format('YYYY-MM-DD')
      const endDate = this.$moment().add(2, 'days').format('YYYY-MM-DD')

      this.$axios
        .get(`https://graph.microsoft.com/v1.0/me/calendarview?$select=id,subject,body,bodyPreview,start,webLink,end&startdatetime=${startDate}T00:00:00Z&enddatetime=${endDate}T23:59:00Z`)
        .then((response) => {
          this.events = response.data.value
        })
        .catch((error) => {
          this.events = []
          this.setRequestError()
          // eslint-disable-next-line
          console.log(error)
        })
    },

    getGreeting() {
      const hour = this.$moment().hour()
      if (hour >= 0 && hour < 10) {
        return this.$t('first_page.dobro_jutro', { user: this.user_data.first_name })
      } else if (hour >= 10 && hour < 17) {
        return this.$t('first_page.dober_dan', { user: this.user_data.first_name })
      } else if (hour >= 17 && hour < 24) {
        return this.$t('first_page.dober_vecer', { user: this.user_data.first_name })
      }
    },

    getCurrentLesson() {
      this.current_lessons = []
      this.current_lesson_available = false

      this.timetable_events.forEach((event) => {
        const lessonStart = this.$moment(event.start, 'YYYY-MM-DDTH:mm').subtract(10, 'minutes')
        const lessonEnd = this.$moment(event.end, 'YYYY-MM-DDTH:mm').subtract(10, 'minutes')

        if (this.$moment().isBetween(lessonStart, lessonEnd)) {
          this.current_lessons.push(event)
          this.current_lesson_available = true
        }
      })
    },

    getTaskList() {
      this.$axios.get('https://graph.microsoft.com/v1.0/me/todo/lists').then((response) => {
        this.task_list_id = response.data.value[0].id
        this.getTasks()
      })
    },

    getTasks() {
      this.tasks = []
      this.$axios.get('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks').then((response) => {
        response.data.value.forEach((task) => {
          if (task.status === 'notStarted') {
            this.tasks.push(task)
          }
        })
      })
    },

    markAsDoneTask(e) {
      const taskId = e.currentTarget.dataset.id
      this.$axios
        .patch('https://graph.microsoft.com/v1.0/me/todo/lists/' + this.task_list_id + '/tasks/' + taskId, {
          status: 'completed',
        })
        .then((response) => {
          this.getTasks()
        })
    },
  },
}
</script>
<style scoped>
.widget-img {
  width: 20%;
  height: 20%;
}

.app-img {
  width: 30%;
  height: 30%;
}

.user-greatting {
  font-size: 1.5rem;
  font-weight: bold;
}

.task-done {
  text-decoration: line-through;
}
.task-overdue {
  color: #ff5252 !important;
}

@media screen and (max-width: 960px) {
  .app-img {
    width: 50%;
    height: 50%;
  }
  .widget-img {
    width: 40%;
    height: 40%;
  }
}
</style>
