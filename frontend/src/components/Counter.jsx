/**
 * 计数器组件
 * 
 * 演示 State 的基本用法
 * 
 * useState Hook：
 * - useState(initialValue) - 创建状态
 * - 返回 [state 值，更新函数]
 * - 调用更新函数会触发组件重新渲染
 */

import { useState } from 'react'

function Counter() {
  /**
   * 使用 useState 创建状态
   * 
   * count: 当前计数器的值
   * setCount: 更新 count 的函数
   * 0: 初始值
   * 
   * 语法：const [状态名，更新函数] = useState(初始值)
   */
  const [count, setCount] = useState(0)
  
  /**
   * 增加计数
   * 
   * 调用 setCount 后：
   * 1. count 的值会更新
   * 2. 组件会重新渲染
   * 3. UI 会显示最新的 count 值
   */
  const handleIncrement = () => {
    setCount(count + 1)
  }
  
  /**
   * 减少计数
   */
  const handleDecrement = () => {
    setCount(count - 1)
  }
  
  /**
   * 重置计数
   */
  const handleReset = () => {
    setCount(0)
  }
  
  return (
    <div className="counter" style={{
      textAlign: 'center',
      padding: '20px',
      border: '2px solid #007bff',
      borderRadius: '8px',
      maxWidth: '300px',
      margin: '20px auto'
    }}>
      <h2>计数器</h2>
      
      {/* 显示当前计数 */}
      <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#007bff' }}>
        {count}
      </p>
      
      {/* 按钮组 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={handleDecrement}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          -1
        </button>
        
        <button 
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          重置
        </button>
        
        <button 
          onClick={handleIncrement}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +1
        </button>
      </div>
      
      {/* 显示状态信息 */}
      <p style={{ marginTop: '15px', color: '#666' }}>
        当前状态：{count === 0 ? '初始状态' : count > 0 ? '正数' : '负数'}
      </p>
    </div>
  )
}

export default Counter