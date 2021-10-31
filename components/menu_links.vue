<template>
  <div class="menu-links">
    <v-list-item class="rounded-r-xl" to="/urnik" nuxt>
      <v-list-item-title><v-icon>schedule</v-icon> Urnik</v-list-item-title>
    </v-list-item>

    <v-list-item class="rounded-r-xl" to="/obvestila" nuxt>
      <v-list-item-title><v-icon>notifications</v-icon> Obvestila</v-list-item-title>
    </v-list-item>

    <v-list-item v-if="showNadomescanja" class="rounded-r-xl" to="/nadomescanja" nuxt>
      <v-list-item-title><v-icon>shuffle</v-icon> Nadomeščanja</v-list-item-title>
    </v-list-item>

    <v-list-item class="rounded-r-xl" to="/jedilnik" nuxt>
      <v-list-item-title><v-icon>restaurant_menu</v-icon> Jedilnik</v-list-item-title>
    </v-list-item>

    <v-list-item class="rounded-r-xl" to="/izkaznica" nuxt>
      <v-list-item-title><v-icon>badge</v-icon> E-izkaznica</v-list-item-title>
    </v-list-item>
    <v-list-item class="rounded-r-xl" to="/koledar" nuxt>
      <v-list-item-title><v-icon>event</v-icon> Koledar</v-list-item-title>
    </v-list-item>

    <v-list-item class="rounded-r-xl" to="/opravila" nuxt>
      <v-list-item-title><v-icon>task_alt</v-icon> Opravila</v-list-item-title>
    </v-list-item>

    <v-divider class="mb-1"></v-divider>
    <v-list-item class="rounded-r-xl" target="_blank" :href="config.default.eucilnica_site">
      <v-list-item-title><v-icon>school</v-icon> Spletna učilnica</v-list-item-title>
    </v-list-item>
    <v-list-item class="rounded-r-xl" target="_blank" :href="schoolWebsite">
      <v-list-item-title><v-icon>language</v-icon> Šolska spletna stran</v-list-item-title>
    </v-list-item>

    <v-list-item class="rounded-r-xl" to="/about" nuxt>
      <v-list-item-title><v-icon>info</v-icon> O aplikaciji</v-list-item-title>
    </v-list-item>
  </div>
</template>

<script>
import { props } from 'vue-barcode'
import * as configData from '~/static/config.json'
export default {
  data() {
    return {
      config: configData,
    }
  },
  methods: {},

  props: {
    schoolWebsite: {
      type: String,
      required: true,
    },
    showNadomescanja: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style></style>
