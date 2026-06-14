/**
 * 通知上下文
 * 
 * 作用：
 * 1. 全局管理应用通知（成功、错误、警告等）
 * 2. 在任何组件中都可以发送通知
 * 3. 自动消失的 Toast 消息
 */

import { createContext, useContext, useState, useEffect } from 'react'

/**
 * 创建通知上下文
 */
const NotificationContext = createContext(null)

/**
 * 通知提供者组件
 */
export function NotificationProvider({ children }) {
  // State: 通知列表
  const [notifications, setNotifications] = useState([])
  
  /**
   * 添加通知
   * @param {string} type - 通知类型：'success' | 'error' | 'warning' | 'info'
   * @param {string} message - 通知内容
   * @param {number} duration - 持续时间（毫秒），默认 3000ms
   */
  const addNotification = (type, message, duration = 3000) => {
    const id = Date.now()
    
    // 添加到列表
    setNotifications(prev => [
      ...prev,
      { id, type, message, duration }
    ])
    
    console.log(`🔔 [${type.toUpperCase()}] ${message}`)
    
    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }
  
  /**
   * 移除通知
   */
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  /**
   * 便捷方法
   */
  const success = (message, duration) => addNotification('success', message, duration)
  const error = (message, duration) => addNotification('error', message, duration)
  const warning = (message, duration) => addNotification('warning', message, duration)
  const info = (message, duration) => addNotification('info', message, duration)
  
  // 提供给子组件的值
  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* 通知容器 - 固定在右上角 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            style={{
              padding: '12px 20px',
              borderRadius: '4px',
              color: 'white',
              minWidth: '250px',
              maxWidth: '400px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              animation: 'slideIn 0.3s ease-out',
              backgroundColor: {
                success: '#28a745',
                error: '#dc3545',
                warning: '#ffc107',
                info: '#17a2b8'
              }[notification.type]
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {{
                  success: '✅',
                  error: '❌',
                  warning: '⚠️',
                  info: 'ℹ️'
                }[notification.type]}{' '}
                {notification.message}
              </span>
              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  marginLeft: '10px'
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

/**
 * 自定义 Hook：使用通知上下文
 */
export function useNotification() {
  const context = useContext(NotificationContext)
  
  if (!context) {
    throw new Error('useNotification 必须在 NotificationProvider 内部使用')
  }
  
  return context
}

export default NotificationContext
