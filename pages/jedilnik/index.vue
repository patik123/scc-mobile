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
            <v-alert type="error" dismissible text dense>Prehrano je potrebno za naslednji dan urediti do 14. ure tekočega dne.</v-alert>
            <!-- TABI -->
            <v-tabs v-model="tab" background-color="transparent" right grow :active-class="getSchoolColor()" :slider-color="getSchoolColor()">
              <v-tab v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <!-- KONEC TABI -->
            <div v-if="!loaded" id="loading_jedilnik" class="mt-2">
              <v-skeleton-loader type="paragraph,paragraph,paragraph,paragraph,paragraph,paragraph,paragraph"></v-skeleton-loader>
            </div>
            <div v-if="loaded">
              <v-tabs-items v-model="tab">
                <!-- TAB LAVA 22 -->
                <v-tab-item :v-for="0">
                  <v-tabs v-model="tab_lava" grow right :active-class="getSchoolColor()" :slider-color="getSchoolColor()">
                    <v-tab v-for="(n, i) in 5" :key="i"> {{ days[i] }}</v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab_lava">
                    <v-tab-item :v-for="0">
                      <v-expansion-panels v-model="panel_lava_22" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_lava_22[0][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_lava_22[1][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_lava_22[2][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 4" :ime_jedi="jedilnik_lava_22[3][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 5" :ime_jedi="jedilnik_lava_22[4][days[0]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="1">
                      <v-expansion-panels v-model="panel_lava_22" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_lava_22[0][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_lava_22[1][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_lava_22[2][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 4" :ime_jedi="jedilnik_lava_22[3][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 5" :ime_jedi="jedilnik_lava_22[4][days[1]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="2">
                      <v-expansion-panels v-model="panel_lava_22" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_lava_22[0][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_lava_22[1][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_lava_22[2][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 4" :ime_jedi="jedilnik_lava_22[3][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 5" :ime_jedi="jedilnik_lava_22[4][days[2]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="3">
                      <v-expansion-panels v-model="panel_lava_22" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_lava_22[0][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_lava_22[1][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_lava_22[2][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 4" :ime_jedi="jedilnik_lava_22[3][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 5" :ime_jedi="jedilnik_lava_22[4][days[3]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="4">
                      <v-expansion-panels v-model="panel_lava_22" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_lava_22[0][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_lava_22[1][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_lava_22[2][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 4" :ime_jedi="jedilnik_lava_22[3][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 5" :ime_jedi="jedilnik_lava_22[4][days[4]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                  </v-tabs-items>
                </v-tab-item>

                <!-- TAB Kosovelova 14 (pionirski dom) -->
                <v-tab-item :v-for="1">
                  <v-tabs v-model="tab_kosovelova" right grow :active-class="getSchoolColor()" :slider-color="getSchoolColor()">
                    <v-tab v-for="(n, i) in 5" :key="i"> {{ days[i] }}</v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab_kosovelova">
                    <v-tab-item :v-for="0">
                      <v-expansion-panels v-model="panel_kosovelova_14" multiple>
                        <jedilnik-paneli ime_menija="MENI TOPLI" :ime_jedi="jedilnik_kosovelova_14[0][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI HLADNI" :ime_jedi="jedilnik_kosovelova_14[1][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_kosovelova_14[2][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_kosovelova_14[3][days[0]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="1">
                      <v-expansion-panels v-model="panel_kosovelova_14" multiple>
                        <jedilnik-paneli ime_menija="MENI TOPLI" :ime_jedi="jedilnik_kosovelova_14[0][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI HLADNI" :ime_jedi="jedilnik_kosovelova_14[1][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_kosovelova_14[2][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_kosovelova_14[3][days[1]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="2">
                      <v-expansion-panels v-model="panel_kosovelova_14" multiple>
                        <jedilnik-paneli ime_menija="MENI TOPLI" :ime_jedi="jedilnik_kosovelova_14[0][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI HLADNI" :ime_jedi="jedilnik_kosovelova_14[1][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_kosovelova_14[2][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_kosovelova_14[3][days[2]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="3">
                      <v-expansion-panels v-model="panel_kosovelova_14" multiple>
                        <jedilnik-paneli ime_menija="MENI TOPLI" :ime_jedi="jedilnik_kosovelova_14[0][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI HLADNI" :ime_jedi="jedilnik_kosovelova_14[1][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_kosovelova_14[2][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_kosovelova_14[3][days[3]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="4">
                      <v-expansion-panels v-model="panel_kosovelova_14" multiple>
                        <jedilnik-paneli ime_menija="MENI TOPLI" :ime_jedi="jedilnik_kosovelova_14[0][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI HLADNI" :ime_jedi="jedilnik_kosovelova_14[1][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3" :ime_jedi="jedilnik_kosovelova_14[2][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_kosovelova_14[3][days[4]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                  </v-tabs-items>
                </v-tab-item>

                <!-- TAB Ljubljanska 21 (dijaški dom) -->
                <v-tab-item :v-for="2">
                  <v-tabs v-model="tab_ljubljanska" right grow :active-class="getSchoolColor()" :slider-color="getSchoolColor()">
                    <v-tab v-for="(n, i) in 5" :key="i"> {{ days[i] }}</v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab_ljubljanska">
                    <v-tab-item :v-for="0">
                      <v-expansion-panels v-model="panel_ljubljanska_21" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_ljubljanska_21[0][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_ljubljanska_21[1][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3 - HLADNI" :ime_jedi="jedilnik_ljubljanska_21[2][days[0]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_ljubljanska_21[3][days[0]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="1">
                      <v-expansion-panels v-model="panel_ljubljanska_21" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_ljubljanska_21[0][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_ljubljanska_21[1][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3 - HLADNI" :ime_jedi="jedilnik_ljubljanska_21[2][days[1]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_ljubljanska_21[3][days[1]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="2">
                      <v-expansion-panels v-model="panel_ljubljanska_21" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_ljubljanska_21[0][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_ljubljanska_21[1][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3 - HLADNI" :ime_jedi="jedilnik_ljubljanska_21[2][days[2]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_ljubljanska_21[3][days[2]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="3">
                      <v-expansion-panels v-model="panel_ljubljanska_21" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_ljubljanska_21[0][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_ljubljanska_21[1][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3 - HLADNI" :ime_jedi="jedilnik_ljubljanska_21[2][days[3]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_ljubljanska_21[3][days[3]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                    <v-tab-item :v-for="4">
                      <v-expansion-panels v-model="panel_ljubljanska_21" multiple>
                        <jedilnik-paneli ime_menija="MENI 1" :ime_jedi="jedilnik_ljubljanska_21[0][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 2" :ime_jedi="jedilnik_ljubljanska_21[1][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 3 - HLADNI" :ime_jedi="jedilnik_ljubljanska_21[2][days[4]]"></jedilnik-paneli>
                        <jedilnik-paneli ime_menija="MENI 6" :ime_jedi="jedilnik_ljubljanska_21[3][days[4]]"></jedilnik-paneli>
                      </v-expansion-panels>
                    </v-tab-item>
                  </v-tabs-items>
                </v-tab-item>
              </v-tabs-items>
            </div>
          </v-container>
        </v-main>
      </v-sheet>
    </v-app>
  </div>
</template>

<script>
import cherio from 'cherio'
import HtmlTableToJson from 'html-table-to-json'
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'

export default {
  name: 'Jedilnik',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      tab: null,
      tab_lava: this.jedilnikGetDay(), // prevzeto prikaže dan kateri je danes
      tab_kosovelova: this.jedilnikGetDay(), // prevzeto prikaže dan kateri je danes
      tab_ljubljanska: this.jedilnikGetDay(), // prevzeto prikaže dan kateri je danes
      items: ['Lava 22', 'Kosovelova 14 (pionirski dom)', ' Ljubljanska 21 (dijaški dom)'], // lokacije prehrane
      jedilnik_lava_22: [],
      jedilnik_kosovelova_14: [],
      jedilnik_ljubljanska_21: [],
      panel_lava_22: [0, 1, 2], // kateri paneli so odprti
      panel_kosovelova_14: [0, 1], // kateri paneli so odprti
      panel_ljubljanska_21: [0, 1], // kateri paneli so odprti
      days: [], // prikaže dneve v tednu
      loaded: false, // znak da je jedilnik pridobljen zaradi tega ker v nasprotnem rimeru napiše error
    }
  },

  created() {
    this.weekDates() // get dates for the week
    this.getJedilnik() // get jedilnik
  },

  methods: {
    // izračun dnevov v tednu
    weekDates() {
      const currentDate = this.$moment()
      const weekDays = ['Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota', 'Nedelja']

      const weekStart = currentDate.clone().startOf('isoWeek')
      const weekEnd = currentDate.clone().endOf('isoWeek')

      // ob nedeljah stan prikaže za naslednji teden jedilnik - dodamo sedem dni naprej
      if (currentDate.format('DD.MM.YYYY') === weekEnd.format('DD.MM.YYYY')) {
        weekStart.add(7, 'days')
      }
      for (let i = 0; i <= 6; i++) {
        this.days.push(weekDays[i] + ' ' + this.$moment(weekStart).add(i, 'days').format('DD.MM.YYYY'))
      }
    },

    // funkcija za izbiro dneva v jedilniku po 15:00 pokaže prevzeto naslednji dan drugače pokaže isti dan
    jedilnikGetDay() {
      const diff = this.$moment(new Date(), 'HH:mm').diff(this.$moment('15:00', 'HH:mm'))
      if (diff >= 0) {
        const day = this.$moment().isoWeekday()
        return day
      }
      const day = this.$moment().isoWeekday() - 1
      return day
    },

    // pridobi jedilnik
    getJedilnik() {
      this.loaded = false

      const url = this.config.default.prehrana_site // url strani za prehrano definirana v config datoteki

      this.$axios.get(`https://api.allorigins.win/raw?url=${url}`).then((response) => {
        const $ = cherio.load(response.data)

        // Ustvari presledek za vsak break v tabeli (za lepši izpis)
        $('table br').each(function (e, el) {
          $(el).replaceWith(' ')
        })

        /* eslint-disable no-alert, no-console */
        // Lava 22
        const table_lava_22 = $('.content')[0]
        const table_lava_22_result = HtmlTableToJson.parse($(table_lava_22).html())
        this.jedilnik_lava_22 = table_lava_22_result.results
        this.jedilnik_lava_22 = this.jedilnik_lava_22[0]

        // Kosovelova 14
        const table_kosovelova_14 = $('.content')[1]
        const table_kosovelova_14_result = HtmlTableToJson.parse($(table_kosovelova_14).html())
        this.jedilnik_kosovelova_14 = table_kosovelova_14_result.results
        this.jedilnik_kosovelova_14 = this.jedilnik_kosovelova_14[0]

        // Ljubljanska 21
        const table_ljubljanska_21 = $('.content')[2]
        const table_ljubljanska_21_result = HtmlTableToJson.parse($(table_ljubljanska_21).html())
        this.jedilnik_ljubljanska_21 = table_ljubljanska_21_result.results
        this.jedilnik_ljubljanska_21 = this.jedilnik_ljubljanska_21[0]
        this.loaded = true
        /* eslint-enable no-alert, no-console */
      })
    },
  },
}
</script>
