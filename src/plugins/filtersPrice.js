// 处理千分位

export default (data) => {
  // 边界处理 当数据不满足要求 则一律返回0
  if (!data || data === '0' || data === '') return 0
  // 是否为浮点数 是否包含 .
  let isFloat = false
  let newData = data.toString()
  if (/\./.test(newData)) isFloat = true
  // 分割为数组
  let dataArray = newData.split('')
  // 根据千分位为每隔3位加一逗号 存储千分位位置 判断是否为浮点数 浮点数则从第6位开始
  // '1,234.56' '1,234'
  let dataArrayLen = isFloat ? dataArray.length - 6 : dataArray.length - 3
  if (dataArrayLen > 0) {
    let priceFormat = (data) => {
      dataArray.splice(dataArrayLen, 0, ',')
      dataArrayLen = dataArrayLen - 3
      // 如果剩余未处理的数据小于1 则为全部处理完毕 将数组拼接
      if (dataArrayLen < 1) {
        newData = dataArray.join('')
        return
      }
      priceFormat(newData)
    }
    priceFormat(data)
  }
  return (newData)
}
