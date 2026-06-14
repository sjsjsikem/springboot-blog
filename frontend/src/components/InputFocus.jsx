/**
 * 输入框聚焦组件
 * 
 * 演示 useRef 访问 DOM 元素
 * 
 * useRef 的使用步骤：
 * 1. 创建 ref: const inputRef = useRef(null)
 * 2. 绑定到元素：<input ref={inputRef} />
 * 3. 访问 DOM: inputRef.current
 */

import { useRef } from 'react'

function InputFocus() {
  // 创建 ref
  const inputRef = useRef(null)
  
  /**
   * 处理聚焦按钮点击
   */
  const handleFocus = () => {
    // 通过 ref 访问 DOM 元素
    inputRef.current.focus()
  }
  
  /**
   * 处理选中按钮点击
   */
  const handleSelect = () => {
    inputRef.current.select()
  }
  
  /**
   * 处理清空按钮点击
   */
  const handleClear = () => {
    inputRef.current.value = ''
    inputRef.current.focus()
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>输入框聚焦演示</h2>
      
      {/* 绑定 ref 到 input 元素 */}
      <input
        ref={inputRef}
        type="text"
        placeholder="点击按钮来操作这个输入框"
        style={{
          width: '300px',
          padding: '10px',
          fontSize: '16px',
          marginRight: '10px'
        }}
      />
      
      {/* 操作按钮 */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleFocus} style={{ marginRight: '5px' }}>
          聚焦
        </button>
        <button onClick={handleSelect} style={{ marginRight: '5px' }}>
          全选
        </button>
        <button onClick={handleClear}>
          清空并聚焦
        </button>
      </div>
      
      <p style={{ color: '#666', marginTop: '15px' }}>
        提示：点击"聚焦"按钮，输入框会自动获得焦点
      </p>
    </div>
  )
}

export default InputFocus