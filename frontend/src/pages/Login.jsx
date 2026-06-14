/**
 * 登录页面组件
 * 
 * 功能：
 * 1. 用户登录表单
 * 2. 调用登录 API
 * 3. 保存 JWT Token
 * 4. 跳转到首页
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import userService from '../services/userService'

function Login() {
  // Hook: 导航
  const navigate = useNavigate()
  // Hook: 认证上下文
  const { login } = useAuth()
  
  // State: 表单数据
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  
  // State: 加载状态
  const [loading, setLoading] = useState(false)
  
  // State: 错误信息
  const [error, setError] = useState('')
  
  /**
   * 处理输入框变化
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 清空错误信息
    setError('')
  }
  
  /**
   * 处理表单提交
   */
  const handleSubmit = async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault()
    
    // 验证表单
    if (!formData.username || !formData.password) {
      setError('请填写用户名和密码')
      return
    }
    
    try {
      // 设置加载状态
      setLoading(true)
      setError('')
      
      console.log('📤 正在登录...', formData.username)
      
      // 使用 AuthContext 的 login 方法（会自动更新认证状态）
      const result = await login(formData.username, formData.password)
      
      console.log('✅ 登录成功，用户信息:', result)
      console.log('📋 Token 已保存到 localStorage:', localStorage.getItem('token') ? '✅' : '❌')
      
      // 登录成功，跳转到首页
      alert('登录成功！')
      navigate('/')
      
    } catch (err) {
      // 捕获错误
      console.error('❌ 登录失败:', err)
      
      // 显示错误信息
      if (err.response?.status === 400) {
        setError('用户名或密码错误')
      } else {
        setError(err.message || '登录失败，请稍后重试')
      }
    } finally {
      // 无论成功失败，都设置加载完成
      setLoading(false)
    }
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* 标题 */}
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333'
        }}>
          🔐 用户登录
        </h1>
        
        {/* 错误提示 */}
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee',
            color: '#c00',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #fcc'
          }}>
            ❌ {error}
          </div>
        )}
        
        {/* 登录表单 */}
        <form onSubmit={handleSubmit}>
          {/* 用户名输入框 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              用户名
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          {/* 密码输入框 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              密码
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s'
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        
        {/* 注册链接 */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          还没有账号？{' '}
          <Link
            to="/register"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            立即注册
          </Link>
        </div>
        
        {/* 返回首页链接 */}
        <div style={{
          marginTop: '15px',
          textAlign: 'center'
        }}>
          <Link
            to="/"
            style={{
              color: '#666',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login