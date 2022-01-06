<template>
  <v-list nav dense shaped>
    <v-list-item-group v-model="group" :active-class="schoolBGColor()">
      <v-list-item :to="startUrl()" nuxt>
        <v-list-item-title><v-icon>home</v-icon> Domov</v-list-item-title>
      </v-list-item>

      <v-list-item to="/urnik" nuxt>
        <v-list-item-title><v-icon>schedule</v-icon> Urnik</v-list-item-title>
      </v-list-item>

      <v-list-item to="/obvestila" nuxt>
        <v-list-item-title><v-icon>notifications</v-icon> Obvestila</v-list-item-title>
      </v-list-item>

      <v-list-item to="/nadomescanja" nuxt>
        <v-list-item-title><v-icon>shuffle</v-icon> Nadomeščanja</v-list-item-title>
      </v-list-item>

      <v-list-item to="/jedilnik" nuxt>
        <v-list-item-title><v-icon>restaurant_menu</v-icon> Jedilnik</v-list-item-title>
      </v-list-item>

      <v-list-item to="/koledar" nuxt>
        <v-list-item-title><v-icon>event</v-icon> Koledar</v-list-item-title>
      </v-list-item>

      <v-list-item to="/opravila" nuxt>
        <v-list-item-title><v-icon>task_alt</v-icon> Opravila</v-list-item-title>
      </v-list-item>

      <v-divider class="mb-1"></v-divider>

      <div>
        <v-list-item target="_blank" :href="config.eucilnica_site">
          <v-list-item-title><v-icon>language</v-icon> Spletna učilnica</v-list-item-title>
        </v-list-item>

        <v-list-item target="_blank" :href="schoolWebsite">
          <v-list-item-title><v-icon>language</v-icon> Šolska spletna stran</v-list-item-title>
        </v-list-item>

        <v-list-item target="_blank" :href="config.eviweb_public_url">
          <v-list-item-title><v-icon>language</v-icon> EviWeb</v-list-item-title>
        </v-list-item>

        <v-list-item target="_blank" :href="config.prehrana_site">
          <v-list-item-title><v-icon>language</v-icon> Šolska prehrana</v-list-item-title>
        </v-list-item>
      </div>

      <v-divider class="mb-1"></v-divider>
      <v-list-item to="/about" nuxt>
        <v-list-item-title><v-icon>info</v-icon> O aplikaciji</v-list-item-title>
      </v-list-item>
    </v-list-item-group>

    <div class="text-center mt-1">
      <img :src="require(`~/static/${school}_cvet.png`)" class="school-logo" />
    </div>

    <div class="text-center mt-1">
      <a v-if="config[school].social.instagram !== ''" :href="config[school].social.instagram" target="_blank">
        <img src="~/static/instagram_logo.png" class="social-logo" />
      </a>
      <a v-if="config[school].social.facebook !== ''" :href="config[school].social.facebook" target="_blank">
        <img src="~/static/facebook_logo.png" class="social-logo" />
      </a>
    </div>
  </v-list>
</template>

<script>
import * as configData from '~/static/config.json'
export default {
  props: {
    schoolWebsite: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      config: configData.default,
      group: null,
      user_type: localStorage.getItem('user_type'),
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
  methods: {
    schoolBGColor() {
      const school = this.$props.school
      return `${school}-background`
    },

    startUrl() {
      if (this.$route.query.source === 'pwa') {
        return '/?source=pwa'
      } else return '/'
    },
  },
}
</script>

<style>
.school-logo {
  margin-top: 10px;
  width: 55px;
  height: 55px;
}
.social-logo {
  margin-top: 10px;
  width: 40px;
  height: 40px;
}
</style>
