import axios from 'axios'
import { Message } from 'element-ui'
// 创建axios实例
const request = axios.create({
  baseURL: process.env['VUE_APP_BASE_API']
})
// 请求拦截器
request.interceptors.request.use()
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
})
export default request
