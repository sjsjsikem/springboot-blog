/**
 * 用户表单组件
 * 
 * 演示多个 State 的管理
 */

import { useState } from 'react'

function UserForm() {
  // 多个独立的 State
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState(18)
  const [agree, setAgree] = useState(false)
  
  /**
   * 处理表单提交
   */
  const handleSubmit = (e) => {
    e.preventDefault() // 阻止表单默认提交行为
    
    // 收集表单数据
    const formData = {
      username,
      email,
      age,
      agree
    }
    
    // 打印到控制台
    console.log('表单提交:', formData)
    alert('表单提交成功！请查看控制台')
  }
  
  return (
    <div className="user-form" style={{
      maxWidth: '400px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2>用户注册表单</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 用户名输入 */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            用户名：
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <small style={{ color: '#666' }}>当前值：{username || '(空)'}</small>
        </div>
        
        {/* 邮箱输入 */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            邮箱：
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <small style={{ color: '#666' }}>当前值：{email || '(空)'}</small>
        </div>
        
        {/* 年龄输入 */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            年龄：
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            min={1}
            max={150}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <small style={{ color: '#666' }}>当前值：{age}岁</small>
        </div>
        
        {/* 复选框 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>我已阅读并同意服务条款</span>
          </label>
          <small style={{ color: '#666' }}>
            当前状态：{agree ? '✓ 已同意' : '✗ 未同意'}
          </small>
        </div>
        
        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={!username || !email || !agree}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: (!username || !email || !agree) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (!username || !email || !agree) ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          提交注册
        </button>
      </form>
    </div>
  )
}

export default UserForm