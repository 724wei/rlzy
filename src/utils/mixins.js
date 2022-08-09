import store from '@/store'

export const myMixin = {
  methods: {
    checkPermission(key) {
      // console.log(111)
      console.log(store.state.user.userinfo)
      // 判断是否有与传递过来的key相同的权限
      return !store.state.user.userinfo.roles.points.includes(key)
    }
  }
}
