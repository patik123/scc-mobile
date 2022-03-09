<template>
  <v-list nav dense shaped>
    <v-list-item-group v-model="group" :active-class="schoolBGColor()">
      <v-list-item :to="startUrl()" nuxt>
        <v-list-item-title><v-icon>home</v-icon> {{ $t('menu_items.domov') }}</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn" to="/urnik" nuxt>
        <v-list-item-title><v-icon>schedule</v-icon> {{ $t('menu_items.urnik') }}</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn" to="/obvestila" nuxt>
        <v-list-item-title><v-icon>notifications</v-icon> {{ $t('menu_items.obvestila') }}</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn" to="/nadomescanja" nuxt>
        <v-list-item-title><v-icon>shuffle</v-icon> {{ $t('menu_items.nadomescanja') }}</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn" to="/jedilnik" nuxt>
        <v-list-item-title><v-icon>restaurant_menu</v-icon> {{ $t('menu_items.jedilnik') }}</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn && user_type === 'dijak' && eviweb_available" to="/ocene" nuxt>
        <v-list-item-title><v-icon>done_all</v-icon> {{ $t('menu_items.ocene') }} <v-chip class="float-end" text>Beta</v-chip></v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn && user_type === 'dijak' && eviweb_available" to="/ocenjevanja" nuxt>
        <v-list-item-title><v-icon>assessment</v-icon> {{ $t('menu_items.preizkusi_znanja') }} <v-chip class="float-end" text>Beta</v-chip></v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn && user_type === 'dijak' && eviweb_available" to="/ucitelji" nuxt>
        <v-list-item-title><v-icon>people</v-icon> {{ $t('menu_items.profesorji') }} <v-chip class="float-end" text>Beta</v-chip></v-list-item-title>
      </v-list-item>

            <v-list-item v-if="$auth.loggedIn && user_type === 'dijak' && eviweb_available" to="/izostanki" nuxt>
        <v-list-item-title><v-icon>lock_clock</v-icon> {{ $t('menu_items.izostanki') }} <v-chip class="float-end" text>Beta</v-chip></v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn" to="/koledar" nuxt>
        <v-list-item-title><v-icon>event</v-icon> {{ $t('menu_items.koledar') }}</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn" to="/opravila" nuxt>
        <v-list-item-title><v-icon>task_alt</v-icon> {{ $t('menu_items.opravila') }}</v-list-item-title>
      </v-list-item>

      <v-divider v-if="$auth.loggedIn" class="mb-1"></v-divider>

      <div v-if="$auth.loggedIn">
        <v-list-item target="_blank" :href="config.eucilnica_site">
          <v-list-item-title><v-icon>language</v-icon> {{ $t('menu_items.spletna_ucilnica') }}</v-list-item-title>
        </v-list-item>

        <v-list-item target="_blank" :href="schoolWebsite">
          <v-list-item-title><v-icon>language</v-icon> {{ $t('menu_items.solska_spletna_stran') }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="user_type === 'dijak'" target="_blank" :href="config.eviweb_public_url">
          <v-list-item-title><v-icon>language</v-icon> {{ $t('menu_items.eviweb') }}</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="user_type === 'ucitelj'" target="_blank" :href="config.eviweb_private_url">
          <v-list-item-title><v-icon>language</v-icon> {{ $t('menu_items.eviweb') }}</v-list-item-title>
        </v-list-item>

        <v-list-item target="_blank" :href="config.prehrana_site">
          <v-list-item-title><v-icon>language</v-icon> {{ $t('menu_items.solska_prehrana') }}</v-list-item-title>
        </v-list-item>
      </div>
      <v-divider v-if="$auth.loggedIn" class="mb-1"></v-divider>
      <v-list-item v-if="$auth.loggedIn" to="/nastavitve" nuxt>
        <v-list-item-title><v-icon>settings</v-icon> {{ $t('menu_items.nastavitve') }}</v-list-item-title>
      </v-list-item>

      <v-divider v-if="$auth.loggedIn" class="mb-1"></v-divider>

      <v-list-item v-if="$auth.loggedIn" to="/navodila" nuxt>
        <v-list-item-title><v-icon>help_outline</v-icon> {{ $t('menu_items.navodila') }}</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="$auth.loggedIn" to="/about" nuxt>
        <v-list-item-title><v-icon>info</v-icon> {{ $t('menu_items.about') }}</v-list-item-title>
      </v-list-item>
    </v-list-item-group>

    <div v-if="$auth.loggedIn" class="text-center mt-1">
      <img :src="require(`~/static/${school}_cvet.png`)" class="school-logo" />
    </div>

    <div v-if="$auth.loggedIn" class="text-center mt-1">
      <a v-if="config[school].social.instagram !== '' && $auth.loggedIn" :href="config[school].social.instagram" target="_blank">
        <img src="~/static/instagram_logo.png" class="social-logo" />
      </a>
      <a v-if="config[school].social.facebook !== '' && $auth.loggedIn" :href="config[school].social.facebook" target="_blank">
        <img src="~/static/facebook_logo.png" class="social-logo" />
      </a>
    </div>
  </v-list>
</template>

<script>
import * as configData from '~/static/config.json'
export default {
  created() {
    if (!this.$auth.loggedIn) {
      this.$emit('schoolWebsite', '')
      this.$emit('school', '')
    }
  },
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
      eviweb_available: localStorage.getItem('eviweb_available') ? localStorage.getItem('eviweb_available') : false,
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
  methods: {
    schoolBGColor() {
      if (this.$auth.loggedIn) {
        const school = this.$props.school
        return `${school}-background`
      } else {
        return 'SCC-default-background'
      }
    },

    startUrl() {
      if (this.$route.query.source === 'pwa') {
        return '/?source=pwa'
      } else return '/'
    },
  },
}
</script>

<style scoped>
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
