<template>
  <div></div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  name: 'Auth',
  created() {
    try {
      const decodedBearer = jwtDecode(this.$auth.$storage.getUniversal('_token.aad'))
      this.$auth.$storage.setUniversal('jwt_decoded', decodedBearer)
      this.detect_user_type(decodedBearer.upn)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      localStorage.clear()
      this.$router.push('/')
    }
  },
  methods: {
    detect_user_type(userEmail) {
      if (userEmail.includes('@sc-celje.si')) {
        localStorage.setItem('user_type', 'ucitelj')
      } else if (userEmail.includes('@dijak.sc-celje.si')) {
        localStorage.setItem('user_type', 'dijak')
      } else {
        localStorage.setItem('user_type', 'neznano')
      }
    },
  },
}
</script>
