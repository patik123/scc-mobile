<template>
  <div>
    <v-app>
      <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
      <errorRequestAlter v-if="request_error"></errorRequestAlter>
      <v-sheet class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title>{{ $t('scc') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="$auth.logout('aad')" icon><v-icon>logout</v-icon></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" absolute temporary app>
          <v-list>
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
            <v-tabs v-model="tab" grow right :active-class="getSchoolColor()" :slider-color="getSchoolColor()">
              <v-tab> {{ today }} </v-tab>
              <v-tab> {{ tomorrow }} </v-tab>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <div class="mt-2" style="margin: 0px; padding: 0px; overflow: hidden">
                    <iframe class="mt-2" :src="nadomescanjaDanesUrl()" frameborder="0" width="98%" height="1700"></iframe>
                  </div>
                </v-tab-item>

                <v-tab-item>
                  <div class="mt-2" style="margin: 0px; padding: 0px; overflow: hidden">
                    <iframe class="mt-2" :src="nadomescanjaJutriUrl()" frameborder="0" width="98%" height="1700"></iframe>
                  </div>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import 'moment/locale/sl'
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'NadomescanjaNova',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      tab: null,
      today: this.$t('nadomescanja.danes'),
      tomorrow: this.$t('nadomescanja.jutri'),
    }
  },
  created() {
    this.$moment.locale('sl')
    this.returnDayToday()
    this.returnDayTomorrow()
  },
  methods: {
    nadomescanjaDanesUrl() {
      return `https://ajax.webuntis.com/WebUntis/monitor?school=sc-celje&monitorType=subst&format=Nadome%C5%A1%C4%8Danja%20-%20${this.school}`
    },

    nadomescanjaJutriUrl() {
      return `https://ajax.webuntis.com/WebUntis/monitor?school=sc-celje&monitorType=subst&format=Nadome%C5%A1%C4%8Danja%20-%20${this.school}1`
    },

    returnDayToday() {
      const today = this.$moment()

      if (today.isoWeekday() === 6 || today.isoWeekday() === 7) {
        const weekStart = today.clone().startOf('isoWeek')
        weekStart.add(7, 'days')

        return (this.today = weekStart.format('dddd DD.MM.YYYY'))
      } else {
        return (this.today = today.format('dddd DD.MM.YYYY'))
      }
    },

    returnDayTomorrow() {
      const tomorrow = this.$moment().add(1, 'days')
      const currentTime = this.$moment()

      if (currentTime.isoWeekday() === 5) {
        const weekStart = tomorrow.clone().startOf('isoWeek')
        weekStart.add(7, 'days')

        return (this.tomorrow = weekStart.format('dddd DD.MM.YYYY'))
      }

      if (currentTime.isoWeekday() === 6 || currentTime.isoWeekday() === 7) {
        const weekStart = currentTime.clone().startOf('isoWeek')
        weekStart.add(8, 'days')

        return (this.tomorrow = weekStart.format('dddd DD.MM.YYYY'))
      } else {
        this.tomorrow = tomorrow.format('dddd DD.MM.YYYY')
      }
    },
  },
}
</script>
<style scoped></style>
