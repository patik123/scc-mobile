<template>
  <div></div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  created() {
    try {
      const decodedBearer = jwtDecode(this.$auth.$storage.getUniversal('_token.aad'))
      console.log(decodedBearer)
      this.$auth.$storage.setUniversal('jwt_decoded', decodedBearer)
    } catch (error) {
      console.error(error)

      localStorage.clear()
      this.$router.push('/')
    }
  },
}
</script>
