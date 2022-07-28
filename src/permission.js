import router from '@/router'
import store from '@/store'
// 引入进度条插件
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const LoginPath = '/login'
const noFoundPath = '/404'
const whiteList = [LoginPath, noFoundPath]

// 监听路由的变化
router.beforeEach(async(to, from, next) => {
  Nprogress.start()
  // 获取token
  const token = store.getters.token
  // 判断是否有token
  if (token) {
    // 有token的话不让跳转到登录页
    if (!store.getters.userId) {
      await store.dispatch('user/getUser')
    }
    if (to.path === LoginPath) {
      next('/')
    } else {
      next()
    }
  } else {
    // 判断路由是否在白名单内，不在则不让跳转，直接跳转到登录页
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(LoginPath)
    }
  }
})
router.afterEach(() => {
  Nprogress.done()
})
