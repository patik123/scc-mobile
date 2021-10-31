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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      localStorage.clear()
      this.$router.push('/')
    }
  },
}
</script>
