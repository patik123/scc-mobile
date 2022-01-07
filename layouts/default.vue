<template>
  <div class="noselect" @contextmenu="prevent_right_click($event)">
    <Nuxt />
  </div>
</template>
<script>
export default {
  methods: {
    prevent_right_click(e) {
      e.preventDefault();
    }
  }
}
</script>
