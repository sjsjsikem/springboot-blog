/**
 * 首页组件
 * 
 * 演示如何使用多个 Context
 */

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotification } from '../context/NotificationContext'

function Home() {
  // 使用多个 Context
  const { isAuthenticated, user } = useAuth()
  const { theme, isDark, toggleTheme } = useTheme()
  const { success, error, info } = useNotification()
  
  /**
   * 测试通知系统
   */
  const handleShowNotifications = () => {
    success('✅ 这是一条成功消息！')
    error('❌ 这是一条错误消息！')
    warning('⚠️ 这是一条警告消息！')
    info('ℹ️ 这是一条信息消息！')
  }
  
  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: isDark ? '#16213e' : '#f8f9fa',
      color: isDark ? '#ffffff' : '#333333',
      borderRadius: '8px',
      minHeight: '60vh'
    }}>
      {/* 主题切换按钮 */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px'
      }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: '10px 20px',
            backgroundColor: isDark ? '#ffc107' : '#343a40',
            color: isDark ? '#333' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isDark ? '☀️ 切换到浅色模式' : '🌙 切换到深色模式'}
        </button>
      </div>
      
      {/* 欢迎区域 */}
      <div style={{
        padding: '30px',
        backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          marginBottom: '15px',
          color: isDark ? '#ffc107' : '#343a40'
        }}>
          📝 欢迎来到我的博客系统
        </h1>
        
        {isAuthenticated ? (
          <p style={{ fontSize: '18px', color: isDark ? '#a0a0a0' : '#666' }}>
            👋 欢迎回来，<strong style={{ color: '#007bff' }}>{user?.nickname || user?.username}</strong>！
          </p>
        ) : (
          <p style={{ fontSize: '18px', color: isDark ? '#a0a0a0' : '#666' }}>
            请 <a href="/login" style={{ color: '#007bff' }}>登录</a> 或 <a href="/register" style={{ color: '#007bff' }}>注册</a> 以体验完整功能
          </p>
        )}
      </div>
      
      {/* 功能演示区域 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* 主题信息卡片 */}
        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: isDark ? '#ffc107' : '#343a40', marginBottom: '15px' }}>
            🎨 当前主题
          </h3>
          <p style={{ fontSize: '16px', color: isDark ? '#a0a0a0' : '#666' }}>
            当前模式：<strong>{isDark ? '深色模式 🌙' : '浅色模式 ☀️'}</strong>
          </p>
          <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', marginTop: '10px' }}>
            点击右上角按钮切换主题
          </p>
        </div>
        
        {/* 通知系统演示卡片 */}
        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: isDark ? '#ffc107' : '#343a40', marginBottom: '15px' }}>
            🔔 通知系统演示
          </h3>
          <p style={{ fontSize: '14px', color: isDark ? '#a0a0a0' : '#666', marginBottom: '15px' }}>
            点击按钮测试不同类型的通知
          </p>
          <button
            onClick={handleShowNotifications}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            显示所有通知类型
          </button>
        </div>
        
        {/* 用户状态卡片 */}
        <div style={{
          padding: '20px',
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: isDark ? '#ffc107' : '#343a40', marginBottom: '15px' }}>
            👤 用户状态
          </h3>
          <p style={{ fontSize: '16px', color: isDark ? '#a0a0a0' : '#666' }}>
            登录状态：<strong style={{ color: isAuthenticated ? '#28a745' : '#dc3545' }}>
              {isAuthenticated ? '✅ 已登录' : '❌ 未登录'}
            </strong>
          </p>
          {isAuthenticated && user && (
            <p style={{ fontSize: '14px', color: isDark ? '#666' : '#999', marginTop: '10px' }}>
              用户名：{user.username}<br/>
              昵称：{user.nickname || '未设置'}
            </p>
          )}
        </div>
      </div>
      
      {/* 文章列表入口 */}
      <div style={{
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <a
          href="/articles"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}
        >
          📚 浏览所有文章
        </a>
      </div>
    </div>
  )
}

export default Home
