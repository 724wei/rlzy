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
      const res = await store.dispatch('user/getUser')
      // 调用premission里的方法，并将获取到的用户权限的路由信息，传递给这个方法，从而再该方法内部取进行筛选
      // 将筛选过后的数组返回
      // console.log(res)
      const routes = await store.dispatch('premission/filterRoutes', res.roles.menus)
      console.log(routes)
      // 将拿到的筛选后的数组添加到路由表里，目录中跳转的路由是通过add添加到路由表里的路由
      router.addRoutes([
        ...routes,
        // 404 page must be placed at the end !!!
        { path: '*', redirect: '/404', hidden: true }])
      // 当路由请求完成后再进行一次跳转，防止后面出错不能跳转
      next(to.path)
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
