// 定义自定义指令
// 解决图片报错的问题
export const imgError = {
  inserted(el, option) {
    // el元素绑定的元素可以直接操作DOM
    console.log(el)
    el.onerror = function() {
      el.src = option.value
    }
  }
}
