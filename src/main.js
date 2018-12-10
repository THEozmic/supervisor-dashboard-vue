import Vue from 'vue'
import Dashboard from './components/Dashboard.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Dashboard),
}).$mount('#app')
