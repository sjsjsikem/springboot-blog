/**
 * 用户 API 服务
 * 
 * 封装与用户相关的 API 调用
 * - 注册
 * - 登录
 * - 获取用户信息
 */

import api from '../util/api'

/**
 * 用户服务对象
 */
const userService = {
  
  /**
   * 用户注册
   * 
   * @param {Object} userData - 用户数据
   * @returns {Promise} - 返回 Promise 对象
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  /**
   * 用户登录
   * 
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise} - 返回包含 token 的对象
   */
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password
    })
    
    // 如果登录成功，保存 token
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
      console.log('✅ 登录成功，Token 已保存')
    }
    
    return response.data
  },
  
  /**
   * 退出登录
   * 
   * 清除本地存储的 token
   */
  logout: () => {
    localStorage.removeItem('token')
    console.log('✅ 已退出登录')
  },
  
  /**
   * 获取当前用户信息
   * 
   * @returns {Promise} - 返回 Promise 对象
   */
  getCurrentUser: async () => {
    const response = await api.get('/users/me')
    return response.data
  }
}

// 导出服务对象
export default userService