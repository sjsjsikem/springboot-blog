/**
 * 窗口信息组件
 * 
 * 演示 useEffect 的清理函数
 * 
 * 清理函数的作用：
 * 1. 清理事件监听器
 * 2. 取消定时器
 * 3. 取消网络请求
 * 4. 清理订阅
 * 
 * 防止内存泄漏的关键！
 */

import { useState, useEffect } from 'react'

function WindowInfo() {
  // State: 窗口尺寸
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  /**
   * useEffect 添加事件监听
   * 
   * 关键：返回清理函数
   * - 组件卸载时自动调用
   * - 移除事件监听器，防止内存泄漏
   */
  useEffect(() => {
    // 定义事件处理函数
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    // 添加事件监听器
    window.addEventListener('resize', handleResize)
    
    // 返回清理函数
    return () => {
      // 组件卸载时移除事件监听器
      window.removeEventListener('resize', handleResize)
      console.log('清理：窗口大小监听器已移除')
    }
  }, []) // 空依赖：只执行一次
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e7f3ff',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2>窗口信息</h2>
      <p>窗口宽度：{windowSize.width}px</p>
      <p>窗口高度：{windowSize.height}px</p>
      <p style={{ color: '#666', fontSize: '12px' }}>
        提示：调整浏览器窗口大小，查看实时更新
      </p>
    </div>
  )
}

export default WindowInfo