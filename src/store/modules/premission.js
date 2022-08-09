import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  // 先获取到每个角色都拥有的静态路由模块，包括登录，首页和404页面等
  routes: constantRoutes
}
const mutations = {
  // 当获取到用户的信息以后向默认的静态路由中添加静态路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    // 从全局获取到的用户的路由信息后，就判断在动态路由中是否包含该路由，将
    const resRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    context.commit('setRoutes', resRoutes)
    console.log(resRoutes)
    // 将获取到的路由列表返回
    return resRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
