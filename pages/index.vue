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

            <!-- TRENUTNA URA -->
            <div id="lesson-now">
              <v-card>
                <v-card-title class="title">Trenutna uro</v-card-title>
                <v-card-text> </v-card-text>
              </v-card>
            </div>

            <!-- PRIHAJAJOČI DOGODKI -->

            <div id="events">
              <v-card class="mt-5">
                <v-card-title>Prihajajoči dogodki</v-card-title>
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
                        <v-list-item-subtitle>{{ `${$moment(event.start.dateTime).utcOffset('+0200').format('DD. MM. YYYY HH:mm')} - ${$moment(event.end.dateTime).utcOffset('+0200').format('DD. MM. YYYY HH:mm')}` }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </div>

            <!-- OPRAVILA -->

            <div id="tasks">
              <v-card>
                <v-card-title class="title">Bližajoča opravila</v-card-title>
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

export default {
  name: 'VstopnaStran',
  mixins: [basicFunctions],

  data() {
    return {
      events: [],
      timetable_class: '',
    }
  },

  created() {
    this.getCalendarEvents()
    this.getClasses()
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
