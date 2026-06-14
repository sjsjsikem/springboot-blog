/**
 * 使用自定义 Hook 的计数器
 * 
 * 演示如何使用自定义 Hook 简化组件代码
 */

import useCounter from '../hooks/useCounter'

function CounterWithHook() {
  // 使用自定义 Hook
  const { count, increment, decrement, reset, setCount } = useCounter(10)
  
  return (
    <div style={{
      padding: '20px',
      border: '2px solid #28a745',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>自定义 Hook 计数器</h2>
      <p style={{ fontSize: '36px', color: '#28a745' }}>{count}</p>
      
      <div style={{ marginTop: '15px' }}>
        <button onClick={decrement} style={{ marginRight: '5px' }}>-1</button>
        <button onClick={reset} style={{ marginRight: '5px' }}>重置</button>
        <button onClick={increment}>+1</button>
      </div>
      
      <div style={{ marginTop: '15px' }}>
        <button onClick={() => setCount(100)}>设置为 100</button>
        <button onClick={() => setCount(0)} style={{ marginLeft: '5px' }}>设置为 0</button>
      </div>
    </div>
  )
}

export default CounterWithHook