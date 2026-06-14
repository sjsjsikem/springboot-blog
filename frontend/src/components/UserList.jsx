/**
 * 用户列表组件
 * 
 * 演示 useEffect 中的数据请求
 * 
 * 典型的数据加载流程：
 * 1. 组件挂载 → useEffect 执行
 * 2. 发起 API 请求
 * 3. 接收数据
 * 4. 更新 State
 * 5. 组件重新渲染显示数据
 */

import { useState, useEffect } from 'react'

function UserList() {
  // State: 用户列表
  const [users, setUsers] = useState([])
  
  // State: 加载状态
  const [loading, setLoading] = useState(true)
  
  // State: 错误信息
  const [error, setError] = useState(null)
  
  /**
   * useEffect 用于数据请求
   * 
   * 依赖数组为空 []：
   * - 只在组件首次挂载时执行
   * - 类似 componentDidMount
   */
  useEffect(() => {
    // 定义异步函数获取数据
    const fetchUsers = async () => {
      try {
        // 设置加载状态
        setLoading(true)
        
        // 模拟 API 请求（使用 JSONPlaceholder）
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        
        // 检查响应状态
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        // 解析 JSON 数据
        const data = await response.json()
        
        // 更新用户列表
        setUsers(data)
        
        // 清除错误
        setError(null)
      } catch (err) {
        // 捕获错误
        setError(err.message)
      } finally {
        // 无论成功失败，都设置加载完成
        setLoading(false)
      }
    }
    
    // 执行数据请求
    fetchUsers()
  }, []) // 空依赖数组：只执行一次
  
  // 条件渲染：加载中
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>加载中...</p>
      </div>
    )
  }
  
  // 条件渲染：错误
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <p>出错了：{error}</p>
      </div>
    )
  }
  
  // 正常渲染：用户列表
  return (
    <div style={{ padding: '20px' }}>
      <h2>用户列表</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          >
            <h3>{user.name}</h3>
            <p>用户名：{user.username}</p>
            <p>邮箱：{user.email}</p>
            <p>电话：{user.phone}</p>
            <p>网站：{user.website}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList