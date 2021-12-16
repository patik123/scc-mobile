<template>
  <div></div>
</template>

<script>
export default {
  name: 'Logout',
  meta: {
    analyticsIgnore: true,
  },
  created() {
    localStorage.clear()
    this.$router.push('/')
  },
}
</script>
