<template>
  <v-app>
    <offline-alert v-if="$nuxt.isOffline"></offline-alert>
    <v-sheet class="no-radius" height="100%" width="100%">
      <v-app-bar>
        <v-toolbar-title>Šolski center Celje</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon class="mr-2" @click="darkMode()">{{ dark_light_icon }}</v-icon>
        <v-icon v-if="!$auth.loggedIn" @click="login()">login</v-icon>
        <v-icon v-if="$auth.loggedIn" @click="logout()">logout</v-icon>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <h3 class="text-center">ŠOLSKI CENTER CELJE – CENTER SODOBNIH ZNANJ, TEHNOLOGIJ IN INOVATIVNOSTI</h3>

          <p>Lokacije Šolskega centra Celje</p>
          <p><strong>1.) Pot na Lavo 22:</strong></p>
          <ul>
            <li>Gimnazija Lava,</li>
            <li>Srednja šola za gradbeništvo in varovanje okolja,</li>
            <li>Srednja šola za kemijo, elektrotehniko in računalništvo,</li>
            <li>Srednja šola za strojništvo, mehatroniko in medije,</li>
            <li>Višja strokovna šola,</li>
            <li>Medpodjetniški izobraževalni center.</li>
          </ul>
          <p class="mt-2">
            <iframe
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2759.7603907729135!2d15.254791451562005!3d46.23510947901519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476570f882737b75%3A0xecd7993078b5df43!2s%C5%A0olski+center+Celje!5e0!3m2!1ssl!2ssi!4v1514973418050"
              width="100%"
              height="350"
              frameborder="0"
              style="border: 0"
              allowfullscreen
            ></iframe>
          </p>
          <p><strong>2.) Ljubljanska 17:</strong></p>
          <ul>
            <li>Srednja šola za storitvene dejavnosti in logistiko.</li>
          </ul>
          <p class="mt-2">
            <iframe
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2759.8963552401597!2d15.255550215979666!3d46.23240578987497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476570f8b611c0b3%3A0x82867e19322760a0!2sLjubljanska+cesta+17%2C+3000+Celje!5e0!3m2!1ssl!2ssi!4v1514973709654"
              width="100%"
              height="350"
              frameborder="0"
              style="border: 0"
              allowfullscreen
            ></iframe
            ><br />
            <strong>3.) Kosovelova ulica 12:</strong>
          </p>
          <ul>
            <li>Srednja šola za storitvene dejavnosti in logistiko&nbsp;–&nbsp;program frizer,</li>
            <li>Srednja šola za strojništvo, mehatroniko in medije – program medijski tehnik.</li>
          </ul>
          <p class="mt-2">
            <iframe
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2759.7754217692986!2d15.262843215979752!3d46.23481058971233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476570fa3df26a1d%3A0x51954478355b713e!2sKosovelova+ulica+12%2C+3000+Celje!5e0!3m2!1ssl!2ssi!4v1514973662920"
              width="100%"
              height="350"
              frameborder="0"
              style="border: 0"
              allowfullscreen
            ></iframe>
          </p>
        </v-container>
      </v-main>
    </v-sheet>
  </v-app>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'
export default {
  name: 'Error',
  mixins: [basicFunctions],
}
</script>
<style scoped></style>
