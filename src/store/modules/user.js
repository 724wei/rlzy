// 状态
import { getToken, removeToken, setToken } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userinfo: {}
}
// 修改状态
const mutations = {
//  修改用户信息
  setUserInfo(state, userinfo) {
    state.userinfo = userinfo
  },
  // 修改token的方法
  setToken(state, token) {
    // 存储到vuex中
    state.token = token
    // 存储token到cookie中
    setToken(token)
  },
  //  删除token
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
// 执行异步
const actions = {
//  登录请求>>commit>>mutations
  async login(context, data) {
    try {
      const res = await login(data)
      console.log(res)
      // 将登录以后的token存储到本地存储以及vuex仓库
      context.commit('setToken', res)
    } catch (e) {
      console.log(e)
      return Promise.reject('error')
    }
  },
  // 获取用户信息
  async getUser(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // console.log(res)
    context.commit('setUserInfo', { ...res, ...baseInfo })
    return {
      ...baseInfo,
      ...res
    }
  },
  //  退出登录
  logOut(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
    // 退出的时候清空路由信息，防止喜爱登录时显示上次登录用户的信息
    resetRouter()
    // 通过设置{root:true}将当前context转换为根节点的context，方便不同的模块之间互相调用方法
    context.commit('premission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
