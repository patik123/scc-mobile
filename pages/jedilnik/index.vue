<template>
  <div class="">
    <v-app>
      <v-card v-if="!$auth.loggedIn" class="no-radius" height="100%" width="100%">
        <v-app-bar>
          <v-toolbar-title>Šolski center Celje</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon class="mr-2" @click="darkMode()">{{ dark_light_icon }}</v-icon>
          <v-icon @click="login()">login</v-icon>
        </v-app-bar>

        <v-main class="text-center">
          <img src="~/static/cvet_barvni.png" alt="ŠCC roža" width="100px" height="100px" class="mt-5" />

          <p class="mt-5 font-weight-bold" style="font-size: 25px">Mobilna aplikacija Šolskega centra Celje</p>
          <p class="mt-2" style="font-size: 20px">Aplikacija je namenjena dijakom Šolskega centra Celje.</p>
        </v-main>
      </v-card>

      <v-card v-else class="no-radius" height="100%" width="100%">
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

          <v-tabs-items v-model="tab">
            <!-- TAB LAVA 22 -->
            <v-tab-item :v-for="0">

              <span v-html="jedilnik_lava_22"></span>
            </v-tab-item>

            <!-- TAB Kosovelova 14 (pionirski dom) -->
            <v-tab-item :v-for="1"> 

               <span v-html="jedilnik_kosovelova_14"></span>
            </v-tab-item>

            <!-- TAB Ljubljanska 21 (dijaški dom) -->
            <v-tab-item :v-for="2"> 
               <span v-html="jedilnik_ljubljanska_21"></span>
            </v-tab-item>
          </v-tabs-items>
        </v-main>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'
import cherio from 'cherio'
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
      items: ['Lava 22', 'Kosovelova 14 (pionirski dom)', ' Ljubljanska 21 (dijaški dom)'],
      jedilnik_lava_22: '',
      jedilnik_kosovelova_14: '',
      jedilnik_ljubljanska_21: '',
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

    const url = this.config.default.prehrana_site

    axios.get(`https://api.allorigins.win/get?url=${url}`).then((response) => {
      const $ = cherio.load(response.data.contents)
      const jedilnikLava = $('.content').html()
      this.jedilnik_lava_22 = jedilnikLava

      const jedilnikKosovelova = $('.content').html()
      this.jedilnik_kosovelova_14 = jedilnikKosovelova

      const jedilnikLjubljanska = $('.content').html()
      this.jedilnik_ljubljanska_21 = jedilnikLjubljanska


    })
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
