import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import "./plugins/axios";

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ko'

// import axios from 'axios'
// import VueAxios from 'vue-axios'

// If you don't need the styles, do not connect

Vue.use(VueSweetalert2);
Vue.use(ElementUI, { locale })
// Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
