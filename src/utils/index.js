/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// 处理待转化的数据将其转换为树形结构
export function transListTree(list, rootvalue) {
  const arr = []
  // 遍历获取到的数据
  list.forEach(item => {
    // 判断该项的pid是否等于所传入的值
    if (item.pid === rootvalue) {
      // 判断是否有子项
      const children = transListTree(list, item.id)
      // 再次调用该函数去获取与该项pid相同的子项，并添加到chilren数组中
      if (children.length) {
        item.children = children
      }
      arr.push(item)
    }
  })
  return arr
}

// 优化处理数据到树形结构
export function transListTreeNew(list, rootpid) {
  const map = []
  const treelist = []
  // 先构建一个map结构使得item的id作为key值，value值为item
  list.forEach(item => {
    // 判断是否有children属性，没有则给该项的children属性赋值为空
    if (!item.children) {
      item.children = []
    }
    map[item.id] = item
  })
  // 遍历数据
  list.forEach(item => {
    // 通过判断该项的pid是否存在来判断是否有父节点
    const parent = map[item.pid]
    // console.log(item.pid)
    // console.log(map[item.id])
    if (parent) {
      // 有父节点则将该元素添加到对应父节点的children中
      parent.children.push(item)
    } else if (item.pid === '') {
      treelist.push(item)
    }
  })
  return treelist
}
