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
          id: decodedBearer.oid, // ID uporabnkika
          email: decodedBearer.upn, // uporabnikov email
          first_name: decodedBearer.given_name, // uporabnikovo ime
          last_name: decodedBearer.family_name, // uporabnikov priimek
          type: this.detect_user_type(decodedBearer.upn), // tip uporabnika
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
        return 'ucitelj'
      } else if (userEmail.includes('@dijak.sc-celje.si')) {
        localStorage.setItem('user_type', 'dijak')
        return 'dijak'
      } else {
        localStorage.setItem('user_type', 'neznano')
        return 'neznano'
      }
    },
  },
}
</script>
