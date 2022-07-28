import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth'
import router from '@/router'
// 创建axios实例
const request = axios.create({
  baseURL: process.env['VUE_APP_BASE_API']
})
const Time = 120000000
// 判断token是否过期
function isChecked() {
  // 过期返回false
  // 没过期返回true
  return Date.now() - getTime() < Time
}
// 请求拦截器
request.interceptors.request.use(config => {
  // 通过判断是否有token来给请求头添加token
  const token = store.getters.token
  if (token) {
    // 判断用户登录是否超时
    if (isChecked()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      // 超时则返回登录页面，并显示提示信息
      store.dispatch('user/logOut')
      router.push('/login')
      Message.error('登录超时，请重新登录')
    }
  }
  return config
}, error => Promise.reject(error))
// 响应拦截器
request.interceptors.response.use(response => {
  // 解构从后端返回来的数据
  const { data: { success, data, message }} = response
  // 请求成功干就返回成功后返回来的数据
  if (success) {
    return data
  }
  // 请求结果失败
  Message.error(message || '系统错误')
  // 失败的Promise>>接口请求的地方报错
  return Promise.reject(message || '系统错误')
},
// 错误的返回信息
error => {
  // 判断是否出错
  if (error.response.status === 401) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error?.response?.data?.message || '系统错误')
  return Promise.reject(error)
})
export default request
