<template>
  <div id="main">
    <div v-if="!$auth.loggedIn">
      <b-navbar type="dark" variant="dark">
        <b-navbar-nav>
          <b-nav-item href="#">Šolski center Celje</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item @click="login()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
              <path
                fill-rule="evenodd"
                d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
              />
              <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
            </svg>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>

      <div class="center">
        <div class="mt-4">
          <img src="~/static/cvet_barvni.png" alt="ŠCC roža" width="100px" height="100px" />
        </div>
        <div class="mt-2">Mobilna aplikacija Šolskega centra Celje</div>

        <div class="mt-3">Aplikacija je namenjena dijakom Šolskega centra Celje.</div>
        <div class="mt-3">
          <b-button variant="primary" @click="login()"> Prijava </b-button>
        </div>
      </div>
    </div>

    <div v-else>
      <b-navbar type="dark" variant="dark">
        <b-navbar-nav>
          <b-nav-item v-b-toggle.side-menu>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </b-nav-item>

          <b-nav-item href="#">Šolski center Celje</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item @click="$auth.logout('aad')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
              <path
                fill-rule="evenodd"
                d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"
              />
              <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
            </svg>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>

      <!-- SIDEBAR MENU -->
      <b-sidebar id="side-menu" backdrop bg-variant="dark" text-variant="light" shadow>
        <template #footer>
          <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
            <strong class="mr-auto">Verzija: {{ config.default.version }} </strong>
          </div>
        </template>
        <div class="px-3 py-3">
          <span class="d-block mb-3 font-weight-bold h4">{{ jwt_decoded.given_name + ' ' + jwt_decoded.family_name }}</span>
          <span class="d-block mb-1">{{ full_school_name() }}</span>
          <span class="d-block">{{ user_class }}</span>
        </div>

        <nav class="mb-3 px-3 py-3">
          <b-nav vertical>
            <NuxtLink to="/" class="mb-1 pt-3 text-light text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon" viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                />
                <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
              </svg>

              Domov</NuxtLink
            >
            <NuxtLink to="/obvestila" class="mb-1 pt-3 text-light text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                <path
                  d="M256 80c-8.66 0-16.58 7.36-16 16l8 216a8 8 0 008 8h0a8 8 0 008-8l8-216c.58-8.64-7.34-16-16-16z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                />
                <circle cx="256" cy="416" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
              </svg>

              Obvestila</NuxtLink
            >
            <NuxtLink v-if="show_nadomescanja()" to="/nadomescanja" class="mb-1 pt-3 text-light text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon" viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"
                />
                <path
                  d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"
                />
              </svg>

              Nadomeščanja</NuxtLink
            >
            <NuxtLink to="/jedilnik" class="mb-1 pt-3 text-light text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                <path
                  d="M322 416c0 35.35-20.65 64-56 64H134c-35.35 0-56-28.65-56-64M336 336c17.67 0 32 17.91 32 40h0c0 22.09-14.33 40-32 40H64c-17.67 0-32-17.91-32-40h0c0-22.09 14.33-40 32-40"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="32"
                />
                <path
                  d="M344 336H179.31a8 8 0 00-5.65 2.34l-26.83 26.83a4 4 0 01-5.66 0l-26.83-26.83a8 8 0 00-5.65-2.34H56a24 24 0 01-24-24h0a24 24 0 0124-24h288a24 24 0 0124 24h0a24 24 0 01-24 24zM64 276v-.22c0-55 45-83.78 100-83.78h72c55 0 100 29 100 84v-.22M241 112l7.44 63.97"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="32"
                />
                <path d="M256 480h139.31a32 32 0 0031.91-29.61L463 112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" />
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 112l16-64 47-16" />
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M224 112h256" />
              </svg>

              Jedilnik</NuxtLink
            >
            <NuxtLink to="/izkaznica" class="mb-3 pt-3 text-light text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon" viewBox="0 0 16 16">
                <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"
                />
              </svg>

              E-izkaznica</NuxtLink
            >

            <a v-bind:href="config.default.eucilnica_site" class="text-light pt-4 text-decoration-none">Spletna učilnica</a>
            <a v-bind:href="school_website()" class="text-light pt-3 text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                <path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" />
                <path
                  d="M256 48c-58.07 0-112.67 93.13-112.67 208S197.93 464 256 464s112.67-93.13 112.67-208S314.07 48 256 48z"
                  fill="none"
                  stroke="currentColor"
                  stroke-miterlimit="10"
                  stroke-width="32"
                />
                <path
                  d="M117.33 117.33c38.24 27.15 86.38 43.34 138.67 43.34s100.43-16.19 138.67-43.34M394.67 394.67c-38.24-27.15-86.38-43.34-138.67-43.34s-100.43 16.19-138.67 43.34"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                />
                <path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 48v416M464 256H48" />
              </svg>
              Šolska spletna stran</a
            >
          </b-nav>
        </nav>
      </b-sidebar>
    </div>
  </div>
</template>

<script>
import * as configData from '~/static/config.json'

export default {
  data() {
    return {
      jwt_decoded: this.$auth.$storage.getUniversal('jwt_decoded'),
      jwt_token: this.$auth.$storage.getUniversal('_token.aad'),
      user: localStorage.getItem('user'),
      school: localStorage.getItem('school'),
      user_class: localStorage.getItem('class'),
      config: configData,
    }
  },

  mounted() {},

  created() {
    if (!this.$auth.loggedIn) {
      this.$auth.loginWith('aad')
    }
  },

  methods: {
    /* ERROR OB USMERITVI NA STRAN SE POJAVI UNTABLE ERROR */
    full_school_name() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config.default[school].full_school_name
      }
      return null
    },

    show_nadomescanja() {
      if (this.$auth.loggedIn) {
        const school = this.school
        return this.config.default[school].show_nadomescanja
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
  },
}
</script>

<style>
.center {
  text-align: center;
}

.icon {
  width: 2em;
  height: 2em;
  margin-right: 0.3em;
}
</style>
