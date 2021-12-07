import Vue from 'vue'
import VueMatomo from 'vue-matomo'

export default ({ app }) => {
  Vue.use(VueMatomo, {
    router: app.router,
    host: 'https://analitika-scc.thepatik.eu.org',
    siteId: 1,
  })
}
