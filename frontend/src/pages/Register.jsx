/**
 * 注册页面组件
 * 
 * 功能：
 * 1. 用户注册表单
 * 2. 验证密码强度
 * 3. 调用注册 API
 * 4. 跳转到登录页
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import userService from '../services/userService'

function Register() {
  // Hook: 导航
  const navigate = useNavigate()
  
  // State: 表单数据
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    // 密码强度验证
    //密码长度至少为8个字符
    //密码中必须包含大写字母，小写字母，数字和特殊字符
    //密码中不能包含空格
    if (!/[A-Z]/.test(formData.password)) {
      setError('密码必须包含大写字母')
      return
    }
    if (!/[a-z]/.test(formData.password)) {
      setError('密码必须包含小写字母')
      return
    }
    if (!/\d/.test(formData.password)) {
      setError('密码必须包含数字')
      return
    }
    if (!/[!@#$%^&*()_+{}[\]:;|.<>/?]/.test(formData.password)) {
      setError('密码必须包含特殊字符')
      return
    }
    if (formData.password.includes(' ')) {
      setError('密码不能包含空格')
      return
    } 
    if (formData.password.length < 8) {
      setError('密码长度至少为 8 个字符')
      return
    }
    
    try {
      // 设置加载状态
      setLoading(true)
      setError('')
      
      console.log('📤 正在注册...', formData.username)
      
      // 调用注册 API
      await userService.register({
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname || formData.username,
        email: formData.email || ''
      })
      
      console.log('✅ 注册成功')
      
      // 注册成功，跳转到登录页
      alert('注册成功！请登录')
      navigate('/login')
      
    } catch (err) {
      // 捕获错误
      console.error('❌ 注册失败:', err)
      console.error('错误响应详情:', err.response?.data)
      
      // 显示错误信息
      let errorMessage = '注册失败，请稍后重试'
      
      if (err.response?.status === 400) {
        // 从后端响应中获取具体错误信息
        const responseData = err.response.data
        if (responseData?.message) {
          errorMessage = responseData.message
        } else if (responseData?.data?.message) {
          errorMessage = responseData.data.message
        } else {
          errorMessage = '用户名已存在或参数错误'
        }
      } else if (err.response?.status === 500) {
        errorMessage = '服务器错误，请稍后重试'
      } else {
        errorMessage = err.message || errorMessage
      }
      
      setError(errorMessage)
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
          📝 用户注册
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
        
        {/* 注册表单 */}
        <form onSubmit={handleSubmit}>
          {/* 用户名输入框 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              用户名 <span style={{ color: '#999', fontWeight: 'normal' }}>(必填)</span>
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
              密码 <span style={{ color: '#999', fontWeight: 'normal' }}>(必填，至少 6 位)</span>
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
          
          {/* 确认密码输入框 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              确认密码 <span style={{ color: '#999', fontWeight: 'normal' }}>(必填)</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="请再次输入密码"
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
          
          {/* 昵称输入框（可选） */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              昵称 <span style={{ color: '#999', fontWeight: 'normal' }}>(可选)</span>
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="请输入昵称"
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
          
          {/* 邮箱输入框（可选） */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              邮箱 <span style={{ color: '#999', fontWeight: 'normal' }}>(可选)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入邮箱"
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
          
          {/* 注册按钮 */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#ccc' : '#28a745',
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
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        
        {/* 登录链接 */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          已有账号？{' '}
          <Link
            to="/login"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            立即登录
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

export default Register