// 处理缓存 以及控制超时时间

export default {
  /**
   * @param { String } key 缓存ID 根据该值设置缓存
   * @param { Number } value 缓存值 需要储存的值
   */
  setCache: (key, value) => {
    localStorage.setItem(key, JSON.stringify({
      data: value,
      // 设置当前时间作为该缓存的时间戳
      time: new Date().getTime()
    }))
  },
  /**
   * @param { String } key 缓存ID 根据该值获取缓存
   * @param { Number } deadline 过期时间 根据该值处理数据是否过期
   */
  getCache: (key, deadline = 5) => {
    return new Promise((resolve, reject) => {
      let cache = JSON.parse(localStorage.getItem(key))
      if (!cache) reject(new Error('cache 404'))
      if (new Date().getTime() - cache.time > deadline * 1000 * 60) {
        reject(new Error('cache dead'))
        // 如果缓存过期，则清理该缓存 避免重复执行
        localStorage.removeItem(key)
        return
      }
      resolve(cache)
    })
  }
}
