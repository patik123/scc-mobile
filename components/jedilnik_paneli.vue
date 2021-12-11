<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ ime_menija }}</v-expansion-panel-header>
    <v-expansion-panel-content>{{ ime_jedi }} </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'JedilnikPaneli',
  props: {
    ime_menija: {
      type: String,
      required: true,
    },
    ime_jedi: {
      type: String,
      required: true,
    },
  },
}
</script>
