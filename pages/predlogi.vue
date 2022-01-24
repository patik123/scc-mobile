<template>
  <v-app>
    <offlineAlter v-if="$nuxt.isOffline"></offlineAlter>
    <errorRequestAlter v-if="request_error"></errorRequestAlter>
    <v-sheet class="no-radius" height="100%" width="100%">
      <v-app-bar class="navbar-z-index">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Šolski center Celje</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="darkMode()">
          <v-icon>{{ dark_light_icon }}</v-icon></v-btn
        >
        <v-btn v-if="!$auth.loggedIn" icon @click="login()"><v-icon>login</v-icon></v-btn>
        <v-btn v-if="$auth.loggedIn" icon @click="$auth.logout('aad')"><v-icon>logout</v-icon></v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list v-if="$auth.loggedIn">
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6"> {{ user_data.first_name + ' ' + user_data.last_name }} </v-list-item-title>
              <v-list-item-subtitle>{{ user_class }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <MenuLinks v-if="$auth.loggedIn" :school-website="school_website()" :school="school" />
        <v-list-item v-else to="/" nuxt>
          <v-list-item-title><v-icon>home</v-icon> {{ $t('menu_items.domov') }}</v-list-item-title>
        </v-list-item>
      </v-navigation-drawer>

      <v-main>
        <v-container fluid>
          <h1>Predlogi</h1>
          <p>V anketnem vprašalniku, ste mi podali veliko predlogov. Večino sem zbral na tem mestu in jih obrazložil ali bodo izvedeni ali ne oziroma kdaj bodo prišli v poštev. <b>Predlogi so navedeni tako kot so bili v anketnem vprašalniku.</b></p>

          <div class="mb-3">
               <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Predlog
          </th>
          <th class="text-left">
            Utemeljitev
          </th>
                    <th class="text-left">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in ideas"
          :key="item.naziv_predloga"
        >
          <td>{{ item.naziv_predloga }}</td>
          <td>{{ item.utemeljitev }}</td>
            <td>
                <v-chip
                text
                >
                {{ item.opomba }}
                </v-chip>
            </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
          </div>

          <p>S spodnjim vprašalnikom lahko podaste svoje ideje za aplikacijo. </p>
              <iframe width="100%" height= "700px" src= "https://forms.office.com/Pages/ResponsePage.aspx?id=LqzK6Lz5lkOfGI3IDgRExckrds-p8kVPr90d71g_VkhUNk9VMTRQNzdZMElTSEZCOVg0S0JSODJXNy4u&embed=true" frameborder= "0" marginwidth= "0" marginheight= "0" style= "border: none; max-width:100%; max-height:100vh" allowfullscreen webkitallowfullscreen mozallowfullscreen msallowfullscreen> </iframe>
        </v-container>
      </v-main>
    </v-sheet>
  </v-app>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'

export default {
  name: 'Navodila',
  mixins: [basicFunctions],

  data() {
    return {
      ideas: [
        {
          naziv_predloga: 'urniki učiteljev',
          utemeljitev: 'S prilagoditvijo trenutnega vmesnika bo tudi to možno.',
          opomba: 'Da',
        },
        {
          naziv_predloga: 'digitalna dijaška kartica',
          utemeljitev: 'Potrebno je pridobiti dodatne informacije.',
          opomba: 'Mogoče',
        },

        {
          naziv_predloga: 'seznam kabinetov profesorjev',
          utemeljitev: 'Z integracijo EviWeba v samo aplikacijo bo tudi to mogoče videti.',
          opomba: 'Se izvaja',
        },

        {
          naziv_predloga: 'belezbo testov in sprasevanj',
          utemeljitev: 'Je že mogoče, ročno v koledarju.',
          opomba: 'Ne',
        },

        {
          naziv_predloga: 'sesnam bližajočih se dejavnosti: športni dnevi...',
          utemeljitev: 'S prilagoditvijo trenutnega vmesnika bo tudi to možno. Trenutno ročno beleženje v koledarju.',
          opomba: 'Da',
        },

        {
          naziv_predloga: 'redovalnica, moje ocene',
          utemeljitev: 'Z integracijo EviWeba v aplikacijo bo tudi to mogoče.',
          opomba: 'Se izvaja.',
        },
        {
          naziv_predloga: 'nomago vozni red : )',
          utemeljitev: 'To ni predvideno. Potrebno pridobiti dodatne informacije.',
          opomba: 'Ne',
        },

        {
          naziv_predloga: 'mesto kjer lahko profesorji pustijo obvestila (danes nam ura opade...)',
          utemeljitev: 'V primeru, da bo uradno sprejeta s strani ŠCC bo to prednostna naloga.',
          opomba: 'Da',
        },

        {
          naziv_predloga: 'možnost oddaje predloga za šolski zvonec',
          utemeljitev: 'Potrebno pridobiti dodatne informacije.',
          opomba: 'Ne',
        },

        {
          naziv_predloga: 'da je zelo prilagodljiva (barva ozadja, velikost pisave, slogi...)',
          utemeljitev: 'Dobra ideja, vendar trenutno ni predvideno.',
          opomba: 'Ne',
        },
        {
          naziv_predloga: 'Prijava/odjava obroka ',
          utemeljitev: 'V primeru, da bo uradno sprejeta s strani ŠCC bo to prednostna naloga.',
          opomba: 'Trenutno ne',
        },
      ],
    }
  },
  methods: {},
}
</script>
<style scoped></style>
