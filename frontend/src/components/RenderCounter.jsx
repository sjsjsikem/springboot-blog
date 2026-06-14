/**
 * 渲染计数器组件
 * 
 * 演示 useRef 保存可变值
 * 
 * useRef vs useState：
 * - useRef.current 变化 → 不触发渲染
 * - useState 变化 → 触发渲染
 */

import { useState, useRef, useEffect } from 'react'

function RenderCounter() {
  // State: 会计数器（变化会触发渲染）
  const [count, setCount] = useState(0)
  
  // Ref: 渲染次数（变化不会触发渲染）
  const renderCountRef = useRef(0)
  
  // Ref: 保存上一次的 count 值
  const prevCountRef = useRef(0)
  
  /**
   * useEffect 在每次渲染后执行
   */
  useEffect(() => {
    // 增加渲染次数
    renderCountRef.current += 1
    
    // 保存上一次的 count
    prevCountRef.current = count
  })
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
      <h2>渲染计数器</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <p>当前计数：<strong>{count}</strong></p>
        <p>上一次计数：<strong>{prevCountRef.current}</strong></p>
        <p>组件渲染次数：<strong>{renderCountRef.current}</strong>次</p>
      </div>
      
      <button onClick={() => setCount(count + 1)} style={{ marginRight: '5px' }}>
        增加计数
      </button>
      
      <button onClick={() => setCount(0)}>
        重置
      </button>
      
      <p style={{ color: '#856404', marginTop: '15px' }}>
        说明：每次点击"增加计数"，组件会重新渲染，
        renderCountRef.current 会增加，但这个变化本身不会触发渲染。
      </p>
    </div>
  )
}

export default RenderCounter