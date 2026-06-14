/**
 * 计时器组件
 * 
 * 演示 useEffect 的基本用法
 * 
 * useEffect 作用：
 * 1. 在组件渲染后执行副作用
 * 2. 可以返回清理函数（组件卸载时执行）
 * 
 * 依赖数组：
 * - [] : 只在组件挂载时执行一次（类似 componentDidMount）
 * - [dep] : 当 dep 变化时执行（类似 componentDidUpdate）
 * - 不传 : 每次渲染都执行
 */

import { useState, useEffect } from 'react'

function Timer() {
  // State: 计数
  const [count, setCount] = useState(0)
  
  /**
   * useEffect Hook
   * 
   * 第一个参数：副作用函数
   * 第二个参数：依赖数组（可选）
   * 
   * 这里的配置：
   * - 依赖数组为 [count]
   * - 当 count 变化时，副作用函数会执行
   */
  useEffect(() => {
    // 副作用代码
    console.log(`计时器：${count}秒`)
    
    // 可选：返回清理函数
    // 在组件卸载或依赖变化前执行
    return () => {
      console.log(`清理：${count}秒的定时器`)
    }
  }, [count]) // 依赖数组：当 count 变化时重新执行
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>计时器</h2>
      <p style={{ fontSize: '48px' }}>{count}秒</p>
      <button onClick={() => setCount(count + 1)}>
        增加 1 秒
      </button>
      <button onClick={() => setCount(0)} style={{ marginLeft: '10px' }}>
        重置
      </button>
    </div>
  )
}

export default Timer