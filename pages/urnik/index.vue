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
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.prev()"><v-icon>navigate_before</v-icon><span class="d-none d-sm-flex">Nazaj</span></v-btn>
              <v-btn :color="getSchoolColor()" class="mb-3" @click="$refs.calendar.next()"><span class="d-none d-sm-flex">Naprej</span><v-icon>navigate_next</v-icon></v-btn>
            </div>
            <v-calendar ref="calendar" v-model="calendar" v-if="user_razred != ''" v-touch="{ left: () => $refs.calendar.next(), right: () => $refs.calendar.prev() }" :events="timetable" type="day" @change="getTimetableEvents"></v-calendar>
          </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'Urnik',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      user_razred: '',
      timetable: [],
      calendar: null,
    }
  },
  created() {
    this.getClasses()
  },

  methods: {
    getClasses() {
      this.$axios.get(this.config.default.url_backend_aplikacije + 'untis/get_classes').then((response) => {
        const classes = response.data.result

        classes.forEach((element) => {
          if (element.name === this.user_class) {
            this.user_razred = element
          }
        })
      })
    },
    getTimetableEvents({ start, end }) {
      const startDate = this.$moment(start.date).format('YYYYMMDD')
      const endDate = this.$moment(end.date).format('YYYYMMDD')
      const classId = this.user_razred.id
      axios.get(`${this.config.default.url_backend_aplikacije}untis/get_class_timetable?class_id=${classId}&start_date=${startDate}&end_date=${endDate}`).then((response) => {
        const lessons = response.data.result
        lessons.forEach((lesson) => {
         this.timetable.push({
           name: lesson.su[0].longname,
           start: this.$moment(lesson.date +'T' + lesson.startTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
           end: this.$moment(lesson.date +'T' + lesson.endTime, 'YYYYMMDDTHmm').format('YYYY-MM-DDTH:mm'),
         })
        })
      })
    },
  },
}
</script>
