import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import components from '@/components'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives/index'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import * as filters from '@/filters'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import Print from 'vue-print-nb'
Vue.use(Print)
Vue.use(components)
Vue.component(UploadExcel.name, UploadExcel)
Vue.component(ImageUpload.name, ImageUpload)
console.log(directives)
for (const key in directives) {
  Vue.directive(key, directives[key])
}
// 遍历注册文件中的过滤器
for (const filtersKey in filters) {
  Vue.filter(filtersKey, filters[filtersKey])
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
