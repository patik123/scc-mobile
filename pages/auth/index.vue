<template>
  <div></div>
</template>

<script>
export default({
  created() {
    try {
      const token = this.$auth.$storage.getUniversal('_token.aad')
      const base64Url = token.toString().split('.')[1]

      if (token) {
        const decodedValue = JSON.parse(
          decodeURIComponent(escape(atob(base64Url)))
        )
        this.$auth.$storage.setUniversal('jwt_decoded', decodedValue)

        this.$auth.refreshTokens()
      }
    } catch (e) {
      this.$auth.$storage.removeUniversal('_token.aad')
      this.$auth.$storage.removeUniversal('jwt_decoded')
    }
  },
})
</script>
