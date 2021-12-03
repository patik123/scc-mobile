<template>
  <div>
    <v-app>
      <p>Config: {{ config_datoteka }}</p>
      <p>Api url: {{ api_url }}</p>

      <tiptap />
    </v-app>
  </div>
</template>

<script>
import basicFunctions from '~/assets/js/basic_functions.js'
import authMiddleware from '~/assets/js/auth_middleware.js'
import Tiptap from '~/components/Tiptap.vue'

export default {
  components: { Tiptap },
  name: 'Check_config',
  mixins: [basicFunctions, authMiddleware],
  data() {
    return {
      config_datoteka: '',
      api_url: '',
    }
  },

  created() {
    this.config_datoteka = this.config
    this.api_url = this.config.url_backend_aplikacije
  },
}
</script>
