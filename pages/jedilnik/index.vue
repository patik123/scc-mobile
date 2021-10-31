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
          <v-list nav dense>
            <v-list-item-group v-model="group" active-class="">
              <v-list-item class="rounded-r-xl" to="/" nuxt>
                <v-list-item-title><v-icon>home</v-icon> Domov</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/urnik" nuxt>
                <v-list-item-title><v-icon>schedule</v-icon> Urnik</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/obvestila" nuxt>
                <v-list-item-title><v-icon>notifications</v-icon> Obvestila</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="show_nadomescanja()" class="rounded-r-xl" to="/nadomescanja" nuxt>
                <v-list-item-title><v-icon>shuffle</v-icon> Nadomeščanja</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/jedilnik" nuxt>
                <v-list-item-title><v-icon>restaurant_menu</v-icon> Jedilnik</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/izkaznica" nuxt>
                <v-list-item-title><v-icon>badge</v-icon> E-izkaznica</v-list-item-title>
              </v-list-item>

              <v-divider class="mb-1"></v-divider>
              <v-list-item class="rounded-r-xl" target="_blank" :href="config.default.eucilnica_site">
                <v-list-item-title><v-icon>school</v-icon> Spletna učilnica</v-list-item-title>
              </v-list-item>
              <v-list-item class="rounded-r-xl" target="_blank" :href="school_website()">
                <v-list-item-title><v-icon>language</v-icon> Šolska spletna stran</v-list-item-title>
              </v-list-item>

              <v-list-item class="rounded-r-xl" to="/about" nuxt>
                <v-list-item-title><v-icon>info</v-icon> O aplikaciji</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
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
import * as configData from '~/static/config.json'

export default {
  data() {
    return {
      jwt_decoded: null,
      jwt_token: null,
      user: localStorage.getItem('user'),
      school: localStorage.getItem('school'),
      user_class: localStorage.getItem('class'),
      config: configData,
      drawer: false,
      group: null,
      darkmode: false,
      dark_light_icon: 'dark_mode',
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
  watch: {
    group() {
      this.drawer = false
    },
    darkmode(oldval, newval) {
      this.handledarkmode()
    },
  },

  created() {
    if (!this.$auth.loggedIn) {
      this.$router.push('/')
    } else {
      this.jwt_decoded = this.$auth.$storage.getUniversal('jwt_decoded')
      this.jwt_token = this.$auth.$storage.getUniversal('_token.aad')
      this.config = configData
      if (this.$auth.loggedIn && !localStorage.getItem('user')) {
        this.getUserData()
      }
      if (localStorage.getItem('DarkMode')) {
        if (localStorage.getItem('DarkMode') === 'true') {
          this.darkmode = true
        } else {
          this.handledarkmode()
        }
      }
      this.weekDates() // get dates for the week
      this.getJedilnik()
      console.log(this.tab_lava)
    }
  },

  methods: {
    getUserData() {
      axios({
        method: 'GET',
        url: 'https://graph.microsoft.com/beta/me/profile',
        headers: {
          Authorization: this.$auth.$storage.getUniversal('_token.aad'),
        },
      })
        .then((response) => {
          window.localStorage.setItem('user', JSON.stringify(response.data))
          this.user = response.data
          window.localStorage.setItem('school', this.user.positions['0'].detail.company.department.split('(D)')[0])
          window.localStorage.setItem('class', this.user.positions['0'].detail.jobTitle)
          this.school = window.localStorage.getItem('school')
          this.user_class = window.localStorage.getItem('class')
          this.$router.go() // refresh page zaradi napake pri pridobivanju podatkov - le začasna rešitev
        })

        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    },

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

        const table_lava_22 = $('.content')[0]
        const table_lava_22_result = HtmlTableToJson.parse($(table_lava_22).html())
        this.jedilnik_lava_22 = table_lava_22_result.results
        this.jedilnik_lava_22 = this.jedilnik_lava_22[0]

        const table_kosovelova_14 = $('.content')[1]
        const table_kosovelova_14_result = HtmlTableToJson.parse($(table_kosovelova_14).html())
        this.jedilnik_kosovelova_14 = table_kosovelova_14_result.results
        this.jedilnik_kosovelova_14 = this.jedilnik_kosovelova_14[0]

        const table_ljubljanska_21 = $('.content')[2]
        const table_ljubljanska_21_result = HtmlTableToJson.parse($(table_ljubljanska_21).html())
        this.jedilnik_ljubljanska_21 = table_ljubljanska_21_result.results
        this.jedilnik_ljubljanska_21 = this.jedilnik_ljubljanska_21[0]
        this.loaded = true
      })
    },

    darkMode() {
      this.darkmode = !this.darkmode
      localStorage.setItem('DarkMode', this.darkmode)
    },
    show_nadomescanja() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config.default[school].show_nadomescanja
      }
      return null
    },
    handledarkmode() {
      if (this.darkmode === true) {
        this.$vuetify.theme.dark = true
        localStorage.setItem('DarkMode', true)
        this.dark_light_icon = 'dark_mode'
      } else if (this.darkmode === false) {
        this.$vuetify.theme.dark = false
        localStorage.setItem('DarkMode', false)
        this.dark_light_icon = 'light_mode'
      }
    },

    /* ERROR OB USMERITVI NA STRAN SE POJAVI UNTABLE ERROR */
    full_school_name() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config.default[school].full_school_name
      }
      return null
    },

    school_website() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config.default[school].website
      }
      return null
    },

    login() {
      this.$auth.loginWith('aad')
    },
  },
}
</script>
