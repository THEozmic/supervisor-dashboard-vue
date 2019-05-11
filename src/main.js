import Vue from 'vue'
import Dashboard from './components/Dashboard.vue'
import moment from "moment";
import store from './store'

Vue.config.productionTip = false

Vue.filter('humanDate', function (value, format = 'Y') {
  return moment(value).format(format);
})

new Vue({
  store,
  render: h => h(Dashboard)
}).$mount('#app')
