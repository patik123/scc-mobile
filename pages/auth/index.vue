<template>
  <div></div>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  created() {
    const decodedBearer = jwtDecode(this.$auth.$storage.getUniversal('_token.aad'))
    this.$auth.$storage.setUniversal('jwt_decoded', decodedBearer)
  },
}
</script>
