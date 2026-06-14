/**
 * 主题上下文
 * 
 * 作用：
 * 1. 全局管理应用主题（深色/浅色模式）
 * 2. 在任何组件中都可以切换主题
 * 3. 持久化主题设置到 localStorage
 */

import { createContext, useContext, useState, useEffect } from 'react'

/**
 * 创建主题上下文
 */
const ThemeContext = createContext(null)

/**
 * 主题提供者组件
 */
export function ThemeProvider({ children }) {
  // State: 当前主题（'light' 或 'dark'）
  const [theme, setTheme] = useState('light')
  
  /**
   * useEffect: 组件挂载时从 localStorage 读取主题
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
      // 应用主题到 body
      document.body.style.backgroundColor = savedTheme === 'dark' ? '#1a1a2e' : '#ffffff'
      document.body.style.color = savedTheme === 'dark' ? '#ffffff' : '#333333'
    }
  }, [])
  
  /**
   * 切换主题
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // 应用新主题
    document.body.style.backgroundColor = newTheme === 'dark' ? '#1a1a2e' : '#ffffff'
    document.body.style.color = newTheme === 'dark' ? '#ffffff' : '#333333'
    
    console.log(`🎨 主题已切换为：${newTheme}`)
  }
  
  // 提供给子组件的值
  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * 自定义 Hook：使用主题上下文
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内部使用')
  }
  
  return context
}

export default ThemeContext
