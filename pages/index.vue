<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet v-if="!$auth.loggedIn" class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-toolbar-title>Šolski center Celje</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon class="mr-2" @click="darkMode()">{{ dark_light_icon }}</v-icon>
          <v-icon @click="login()">login</v-icon>
        </v-app-bar>

        <v-main class="text-center">
          <img src="~/static/cvet_barvni.png" alt="ŠCC roža" width="100px" height="100px" class="mt-5" />

          <p class="mt-5 font-weight-bold" style="font-size: 25px">Mobilna aplikacija Šolskega centra Celje</p>
          <p class="mt-2" style="font-size: 20px">Aplikacija namenjena dijakom Šolskega centra Celje.</p>

          <img src="~/static/app_img.svg" alt="Aplikacija" class="mt-3 app-img" />
        </v-main>
      </v-sheet>

      <v-sheet v-if="$auth.loggedIn" class="no-radius" height="100%" width="100%">
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
          <MenuLinks :school-website="school_website()" :school="school" />
        </v-navigation-drawer>

        <v-main>
          <v-container fluid>
            <!-- BLIŽNICE DO DELOV APLIKACIJE -->
            <v-chip-group mandatory>
              <v-chip @click="goToPath('urnik')">
                <v-icon left>schedule</v-icon>
                Urnik
              </v-chip>

              <v-chip @click="goToPath('obvestila')">
                <v-icon left>notifications</v-icon>
                Obvestila
              </v-chip>

              <v-chip @click="goToPath('jedilnik')">
                <v-icon left>restaurant_menu</v-icon>
                Jedilnik
              </v-chip>

              <v-chip @click="goToPath('nadomescanja')">
                <v-icon left>shuffle</v-icon>
                Nadomeščanja
              </v-chip>
            </v-chip-group>

            <div class="mt-2 mb-3">
              <span class="user-greatting">{{ `${getGreeting()},  ${jwt_decoded.given_name}` }}</span>
            </div>

            <!-- TRENUTNA URA -->
            <div id="lesson-now" v-if="current_lessons !== []">
              <v-card>
                <div>
                  <v-card-title :class="getSchoolColor()" class="title">Trenutna ura<v-spacer></v-spacer><v-btn :class="getSchoolColor()" @click="$router.push('/urnik')">Moj urnik</v-btn></v-card-title>
                </div>
                <div v-for="lesson in current_lessons" :key="lesson.id">
                  <v-row>
                    <v-col>
                      <v-card-text>
                        <v-icon class="mr-2">schedule</v-icon>
                        <span class="mr-3">{{ $moment(lesson.start, 'YYYY-MM-DDTH:mm').format('HH:mm') + ' - ' + $moment(lesson.end, 'YYYY-MM-DDTH:mm').format('HH:mm') }}</span>
                      </v-card-text>

                      <v-card-text>
                        <v-icon class="mr-2">school</v-icon>
                        <span class="mr-3">{{ lesson.lesson_name }}</span>
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
                  <v-card-text>
                    <v-icon class="mr-2">info</v-icon>
                    Začetek v ______ minutah ali do konca ure je še _______ minut
                  </v-card-text>
                </div>
              </v-card>
            </div>

            <!-- PRIHAJAJOČI DOGODKI -->

            <div id="events">
              <v-card class="mt-5">
                <v-card-title :class="getSchoolColor()" class="title">Prihajajoči dogodki<v-spacer></v-spacer><v-btn :class="getSchoolColor()" @click="$router.push('/koledar?action=new-event')">Nov dogodek</v-btn></v-card-title>
                <v-card-text>
                  <v-list two-line>
                    <v-list-item v-if="events === []">
                      <v-list-item-content>
                        <div class="text-center">
                          <v-list-item-title><b>Izgleda da nimate nobenih dogodkov v prihajajočih dneh</b></v-list-item-title>
                          <img src="~/static/calendar.svg" alt="Slika koledarja " class="widget-img mt-2" />
                        </div>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item v-for="event in events" :key="event.id">
                      <v-list-item-content>
                        <v-list-item-title>{{ event.subject }}</v-list-item-title>
                        <v-list-item-subtitle>{{ `${$moment(event.start.dateTime).utcOffset('+0200').format('dddd DD. MM. YYYY HH:mm')} - ${$moment(event.end.dateTime).utcOffset('+0200').format('dddd DD. MM. YYYY HH:mm')}` }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>

            <!-- OPRAVILA -->

            <div id="tasks">
              <v-card class="mt-5">
                <v-card-title class="title" :class="getSchoolColor()">Bližajoča opravila</v-card-title>
                <v-card-text> </v-card-text>
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
  name: 'VstopnaStran',
  mixins: [basicFunctions],

  data() {
    return {
      events: [],
      timetable_class: '',
      timetable_events: [],
      current_lessons: [],
    }
  },

  created() {
    if (this.$auth.loggedIn) {
      this.getCalendarEvents()
      this.getClasses()
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
      const endDate = this.$moment().add(1, 'day').format('YYYYMMDD')
      const classId = this.timetable_class.id
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
        return 'Dobro jutro'
      } else if (hour >= 10 && hour < 17) {
        return 'Dober dan'
      } else if (hour >= 17 && hour < 24) {
        return 'Dober večer'
      }
    },

    getCurrentLesson() {
      this.timetable_events.forEach((event) => {
        const lessonStart = this.$moment(event.start, 'YYYY-MM-DDTH:mm').subtract(10, 'minutes')
        const lessonEnd = this.$moment(event.end, 'YYYY-MM-DDTH:mm')

        if (this.$moment().isBetween(lessonStart, lessonEnd)) {
          this.current_lessons.push(event)
          console.log(this.current_lessons)
        }
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

.school-img {
  width: 40px;
  height: 40px;
}

.user-greatting {
  font-size: 1.5rem;
  font-weight: bold;
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
  .school-img {
    display: none;
  }
}
</style>
