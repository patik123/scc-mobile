<template>
  <div class="">
    <v-app>
      <v-card class="no-radius" height="100%" width="100%">
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
          <MenuLinks :school-website="school_website()" :show-nadomescanja="show_nadomescanja()" />
        </v-navigation-drawer>

        <v-main>
          <!-- TABI -->
          <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
            <v-tab v-for="item in items" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
          <div v-if="loaded">
            <v-tabs-items v-model="tab">
              <!-- TAB LAVA 22 -->
              <v-tab-item :v-for="0">
                <v-tabs v-model="tab_lava">
                  <v-tab> {{ days[0] }}</v-tab>
                  <v-tab> {{ days[1] }}</v-tab>
                  <v-tab> {{ days[2] }} </v-tab>
                  <v-tab> {{ days[3] }}</v-tab>
                  <v-tab> {{ days[4] }}</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab_lava">
                  <v-tab-item :v-for="0">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[0][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[1][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[2][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 4</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[3][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 5</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[4][days[0]] }}</v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="1">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[0][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[1][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[2][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 4</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[3][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 5</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[4][days[1]] }}</v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="2">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[0][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[1][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[2][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 4</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[3][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 5</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[4][days[2]] }}</v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="3">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[0][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[1][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[2][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 4</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[3][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 5</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[4][days[3]] }}</v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="4">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[0][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[1][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[2][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 4</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_lava_22[3][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 5</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_lava_22[4][days[4]] }}</v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                </v-tabs-items>
              </v-tab-item>

              <!-- TAB Kosovelova 14 (pionirski dom) -->
              <v-tab-item :v-for="1">
                <v-tabs v-model="tab_kosovelova">
                  <v-tab> {{ days[0] }}</v-tab>
                  <v-tab> {{ days[1] }}</v-tab>
                  <v-tab> {{ days[2] }} </v-tab>
                  <v-tab> {{ days[3] }}</v-tab>
                  <v-tab> {{ days[4] }}</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab_kosovelova">
                  <v-tab-item :v-for="0">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI TOPLI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[0][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_kosovelova_14[1][days[0]] }}</v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[2][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[3][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="1">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI TOPLI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[0][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_kosovelova_14[1][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[2][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[3][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="2">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI TOPLI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[0][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_kosovelova_14[1][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[2][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[3][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="3">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI TOPLI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[0][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_kosovelova_14[1][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[2][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[3][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="4">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI TOPLI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[0][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_kosovelova_14[1][days[4]] }}</v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[2][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_kosovelova_14[3][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                </v-tabs-items>
              </v-tab-item>

              <!-- TAB Ljubljanska 21 (dijaški dom) -->
              <v-tab-item :v-for="2">
                <v-tabs v-model="tab_ljubljanska">
                  <v-tab> {{ days[0] }}</v-tab>
                  <v-tab> {{ days[1] }}</v-tab>
                  <v-tab> {{ days[2] }} </v-tab>
                  <v-tab> {{ days[3] }}</v-tab>
                  <v-tab> {{ days[4] }}</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab_ljubljanska">
                  <v-tab-item :v-for="0">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[0][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[1][days[0]] }}</v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3 - HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[2][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[3][days[0]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="1">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[0][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_ljubljanska_21[1][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3 - HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[2][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[3][days[1]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="2">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[0][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_ljubljanska_21[1][days[2]] }}</v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3 - HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[2][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[3][days[2]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="3">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[0][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_ljubljanska_21[1][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3 - HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[2][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[3][days[3]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                  <v-tab-item :v-for="4">
                    <v-expansion-panels accordion>
                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 1</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[0][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 2</v-expansion-panel-header>
                        <v-expansion-panel-content> {{ jedilnik_ljubljanska_21[1][days[4]] }}</v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 3 - HLADNI</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[2][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel>
                        <v-expansion-panel-header>MENI 6</v-expansion-panel-header>
                        <v-expansion-panel-content>{{ jedilnik_ljubljanska_21[3][days[4]] }} </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-tab-item>
                </v-tabs-items>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-main>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'
import cherio from 'cherio'
import moment from 'moment'
import HtmlTableToJson from 'html-table-to-json'
import basicFunctions from '~/assets/js/basic_functions_other.js'

export default {
  name: 'Jedilnik',
  mixins: [basicFunctions],
  data() {
    return {
      tab: null,
      tab_lava: moment().day(),
      tab_kosovelova: moment().day(),
      tab_ljubljanska: moment().day(),
      items: ['Lava 22', 'Kosovelova 14 (pionirski dom)', ' Ljubljanska 21 (dijaški dom)'],
      jedilnik_lava_22: [],
      jedilnik_kosovelova_14: [],
      jedilnik_ljubljanska_21: [],
      days: [], // prikaže dneve v tednu
      loaded: false, // znak da je jedilnik pridobljen zaradi tega ker v nasprotnem rimeru napiše error
    }
  },

  created() {
    this.weekDates() // get dates for the week
    this.getJedilnik() // get jedilnik
  },

  methods: {
    weekDates() {
      const currentDate = moment()
      const weekDays = ['Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota', 'Nedelja']

      const weekStart = currentDate.clone().startOf('isoWeek')
      const weekEnd = currentDate.clone().endOf('isoWeek')

      if (currentDate.format('DD.MM.YYYY') === weekEnd.format('DD.MM.YYYY')) {
        weekStart.add(7, 'days')
      }
      for (let i = 0; i <= 6; i++) {
        this.days.push(weekDays[i] + ' ' + moment(weekStart).add(i, 'days').format('DD.MM.YYYY'))
      }
    },

    getJedilnik() {
      const url = this.config.default.prehrana_site

      axios.get(`https://api.allorigins.win/raw?url=${url}`).then((response) => {
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
