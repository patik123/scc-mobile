<template>
  <div></div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  name: 'Auth',
  meta: {
    analyticsIgnore: true,
  },
  created() {
    try {
      const decodedBearer = jwtDecode(this.$auth.$storage.getUniversal('_token.aad'))
      localStorage.setItem(
        'user_data',
        JSON.stringify({
          id: decodedBearer.oid,
          email: decodedBearer.upn,
          first_name: decodedBearer.given_name,
          last_name: decodedBearer.family_name,
        })
      )
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
