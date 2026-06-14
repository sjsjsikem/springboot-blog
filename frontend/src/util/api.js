/**
 * Axios API 配置
 * 
 * 创建统一的 Axios 实例，配置：
 * - 基础 URL
 * - 请求头
 * - 请求拦截器
 * - 响应拦截器
 */

import axios from 'axios'

/**
 * 创建 Axios 实例
 * 
 * baseURL: API 的基础地址
 * 所有请求都会自动加上这个前缀
 */
const api = axios.create({
  // 后端 API 地址
  baseURL: 'http://localhost:8080/api',
  
  // 超时时间（毫秒）
  timeout: 10000,
  
  // 默认请求头
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 * 
 * 作用：在请求发送前统一处理
 * 例如：添加 token、日志记录等
 */
api.interceptors.request.use(
  // 成功处理
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 打印请求日志（开发环境）
    console.log('📤 发送请求:', config.method.toUpperCase(), config.url)
    
    return config
  },
  
  // 错误处理
  (error) => {
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 
 * 作用：在接收到响应后统一处理
 * 例如：统一错误处理、数据转换等
 */
api.interceptors.response.use(
  // 成功处理（状态码 2xx）
  (response) => {
    // 打印响应日志
    console.log('📥 接收响应:', response.config.url, response.data)
    
    // 直接返回数据部分
    return response.data
  },
  
  // 错误处理
  (error) => {
    console.error('❌ 响应错误:', error)
    
    // 根据错误状态码处理
    if (error.response) {
      // 服务器返回错误响应
      const status = error.response.status
      
      switch (status) {
        case 400:
          console.error('请求参数错误')
          break
        case 401:
          console.error('未授权，请重新登录')
          // 清除 token
          localStorage.removeItem('token')
          // 跳转到登录页
          window.location.href = '/login'
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(`未知错误：${status}`)
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      console.error('错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// 导出 api 实例
export default api