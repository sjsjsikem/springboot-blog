/**
 * 购物车上下文
 * 
 * 作用：
 * 1. 全局管理购物车状态
 * 2. 添加商品、删除商品、更新数量
 * 3. 计算总价
 * 4. 持久化到 localStorage
 */

import { createContext, useContext, useState, useEffect } from 'react'

/**
 * 创建购物车上下文
 */
const CartContext = createContext(null)

/**
 * 购物车提供者组件
 */
export function CartProvider({ children }) {
  // State: 购物车商品列表
  const [cartItems, setCartItems] = useState([])
  
  /**
   * useEffect: 从 localStorage 加载购物车
   */
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])
  
  /**
   * 添加到购物车
   */
  const addToCart = (product) => {
    setCartItems(prev => {
      // 检查是否已存在
      const existing = prev.find(item => item.id === product.id)
      
      let newCart
      if (existing) {
        // 已存在，数量 +1
        newCart = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // 不存在，添加新商品
        newCart = [...prev, { ...product, quantity: 1 }]
      }
      
      // 保存到 localStorage
      localStorage.setItem('cart', JSON.stringify(newCart))
      
      return newCart
    })
    
    console.log('🛒 已添加到购物车:', product.name)
  }
  
  /**
   * 从购物车移除
   */
  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const newCart = prev.filter(item => item.id !== productId)
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
    
    console.log('🗑️ 已从购物车移除:', productId)
  }
  
  /**
   * 更新商品数量
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prev => {
      const newCart = prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }
  
  /**
   * 清空购物车
   */
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
    console.log('🧹 购物车已清空')
  }
  
  /**
   * 计算商品总数
   */
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }
  
  /**
   * 计算总价
   */
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }
  
  // 提供给子组件的值
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    itemCount: getTotalItems(),
    totalPrice: getTotalPrice()
  }
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * 自定义 Hook：使用购物车上下文
 */
export function useCart() {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart 必须在 CartProvider 内部使用')
  }
  
  return context
}

export default CartContext
