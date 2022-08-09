import ToolBar from '@/components/ToolBar'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('ToolBar', ToolBar)
  }
}
