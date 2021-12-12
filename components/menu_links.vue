<template>
  <v-list nav dense shaped>
    <v-list-item-group v-model="group" :active-class="schoolBGColor()">
      <v-list-item to="/" nuxt>
        <v-list-item-title><v-icon>home</v-icon> Domov</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="user_type === 'dijak'" to="/urnik" nuxt>
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
          <v-list-item-title><v-icon>school</v-icon> Spletna učilnica</v-list-item-title>
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
  },
}
</script>

<style></style>
