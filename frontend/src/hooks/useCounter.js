/**
 * 自定义 Hook：useCounter
 * 
 * 封装计数器的逻辑，可以在多个组件中复用
 * 
 * 参数：
 * - initialValue: 初始值，默认 0
 * 
 * 返回：
 * - count: 当前值
 * - increment: 增加
 * - decrement: 减少
 * - reset: 重置
 * - setCount: 直接设置
 */

import { useState } from 'react'

function useCounter(initialValue = 0) {
  // 内部 State
  const [count, setCount] = useState(initialValue)
  
  // 增加
  const increment = () => {
    setCount(count + 1)
  }
  
  // 减少
  const decrement = () => {
    setCount(count - 1)
  }
  
  // 重置
  const reset = () => {
    setCount(initialValue)
  }
  
  // 直接设置
  const setCountValue = (value) => {
    setCount(value)
  }
  
  // 返回所有需要的方法和值
  return {
    count,
    increment,
    decrement,
    reset,
    setCount: setCountValue
  }
}

export default useCounter