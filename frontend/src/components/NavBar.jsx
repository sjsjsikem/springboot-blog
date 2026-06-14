/**
 * 导航栏组件
 * 
 * 使用 NavLink 实现导航功能
 * 
 * NavLink 特点：
 * - 点击切换路由（不刷新页面）
 * - 自动添加激活样式（当前页面对应的链接）
 */

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavBar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  
  // 调试信息
  console.log('📋 NavBar - isAuthenticated:', isAuthenticated)
  console.log('📋 NavBar - user:', user)
  
  /**
   * 处理登出
   */
  const handleLogout = () => {
    logout()
    navigate('/')
    alert('已退出登录')
  }
  
  return (
    <nav style={{
      backgroundColor: '#343a40',
      padding: '15px 20px',
      marginBottom: '20px'
    }}>

      {/* Logo 和导航区域 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          📝 博客系统
        </div>
        
        {/* 右侧区域：导航链接 + 用户区域 */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* 导航链接 */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? '#ffc107' : 'white',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: isActive ? '#495057' : 'transparent',
                transition: 'all 0.3s'
              })}
            >
              🏠 首页
            </NavLink>
            
            <NavLink
              to="/articles"
              style={({ isActive }) => ({
                color: isActive ? '#ffc107' : 'white',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: isActive ? '#495057' : 'transparent',
                transition: 'all 0.3s'
              })}
            >
              📚 文章列表
            </NavLink>
           
            <select
              onChange={(e) => {
                const selectedValue = e.target.value
                if (selectedValue && selectedValue !== '#') {
                  navigate(selectedValue)
                  e.target.selectedIndex = 0
                }
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: '#495057',
                color: '#ffc107',
                border: '1px solid #ffc107',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                outline: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ffc107\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                paddingRight: '32px'
              }}
            >
              <option value="disabled">📝 创建</option>
              <option value="/createCategory">创建分类</option>
              <option value="/create">创建文章</option>
            </select>


            <NavLink
              to="/comments"
              style={({ isActive }) => ({
                color: isActive ? '#ffc107' : 'white',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: isActive ? '#495057' : 'transparent',
                transition: 'all 0.3s'
              })}
            >
              📖 评论
            </NavLink>
            
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                color: isActive ? '#ffc107' : 'white',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: isActive ? '#495057' : 'transparent',
                transition: 'all 0.3s'
              })}
            >
              📖 关于
            </NavLink>
            
            <NavLink
              to="/contact"
              style={({ isActive }) => ({
                color: isActive ? '#ffc107' : 'white',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: isActive ? '#495057' : 'transparent',
                transition: 'all 0.3s'
              })}
            >
              📧 联系
            </NavLink>
          </div>
          
          {/* 分隔线 */}
          <div style={{ 
            width: '1px', 
            height: '20px', 
            backgroundColor: '#6c757d',
            margin: '0 5px'
          }}></div>
          
          {/* 用户区域 */}
          {isAuthenticated ? (
            <>
              <span style={{ color: '#ffc107', fontSize: '14px' }}>
                👤 {user?.nickname || user?.username}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                退出
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                style={({ isActive }) => ({
                  color: '#ffc107',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#495057',
                  border: '2px solid #ffc107',
                  transition: 'all 0.3s'
                })}
              >
                🔐 登录
              </NavLink>
              
              <NavLink
                to="/register"
                style={({ isActive }) => ({
                  color: '#343a40',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#ffc107',
                  border: '2px solid #ffc107',
                  transition: 'all 0.3s'
                })}
              >
                📝 注册
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar