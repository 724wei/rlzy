import Cookies from 'js-cookie'

const TokenKey = 'hrsass-token'
const timeKey = 'time_key'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取存储的时间戳
export function getTime() {
  return Cookies.get(timeKey)
}
// 设置当前的时间戳
export function setTime() {
  return Cookies.set(timeKey, Date.now())
}
