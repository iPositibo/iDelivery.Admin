import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './infra/router'
import VueRouter from 'vue-router'
import moment from 'moment'

Vue.config.productionTip = false
Vue.use(VueRouter)

new Vue({
  vuetify,
  router,
  moment,
  render: h => h(App)
}).$mount('#app')


