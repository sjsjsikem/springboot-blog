/**
 * 用户认证上下文
 * 
 * 作用：
 * 1. 全局管理用户登录状态
 * 2. 提供登录、登出方法
 * 3. 在任何组件中都可以访问用户信息
 * 
 * 使用 React Context API
 */

import { createContext, useContext, useState, useEffect } from 'react'
import userService from '../services/userService'

/**
 * 创建认证上下文
 * 默认值为 null
 */
const AuthContext = createContext(null)

/**
 * 认证提供者组件
 * 
 * 包裹在应用最外层，提供认证状态
 */
export function AuthProvider({ children }) {
  // State: 用户信息
  const [user, setUser] = useState(null)
  
  // State: 是否已登录
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // State: 加载状态
  const [loading, setLoading] = useState(true)
  
  /**
   * useEffect: 组件挂载时检查登录状态
   */
  useEffect(() => {
    checkAuth()
  }, [])
  
  /**
   * 检查认证状态
   */
  const checkAuth = async () => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    
    if (token) {
      // 有 token，尝试获取用户信息
      try {
        console.log('🔍 检查登录状态...')
        const userData = await userService.getCurrentUser()
        setUser(userData.data || userData)
        setIsAuthenticated(true)
        console.log('✅ 用户已登录:', userData.data?.username)
      } catch (err) {
        console.log('⚠️ Token 已过期，清除登录状态')
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthenticated(false)
      }
    } else {
      // 没有 token，未登录状态
      console.log('ℹ️ 用户未登录')
      setUser(null)
      setIsAuthenticated(false)
    }
    
    // 设置加载完成
    setLoading(false)
  }
  
  /**
   * 登录方法
   */
  const login = async (username, password) => {
    try {
      console.log('📤 正在登录...', username)
      const response = await userService.login(username, password)
      
      console.log('📋 API 返回数据:', response)
      
      // 保存用户信息
      const userData = response.data || response
      console.log('📋 用户数据:', userData)
      
      setUser(userData)
      setIsAuthenticated(true)
      
      console.log('✅ 登录成功，isAuthenticated 已设置为 true')
      console.log('📋 当前 user 状态:', userData)
      return response
    } catch (err) {
      console.error('❌ 登录失败:', err)
      throw err
    }
  }
  
  /**
   * 登出方法
   */
  const logout = () => {
    console.log('📤 正在登出...')
    
    // 清除 token
    userService.logout()
    
    // 清除用户信息
    setUser(null)
    setIsAuthenticated(false)
    
    console.log('✅ 登出成功')
  }
  
  // 提供给子组件的值
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * 自定义 Hook：使用认证上下文
 * 
 * 在任何组件中调用 useAuth() 获取认证信息
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用')
  }
  
  return context
}

export default AuthContext