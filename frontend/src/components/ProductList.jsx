/**
 * 商品列表组件
 * 
 * 综合演示 Props 和 State 的配合使用
 */

import { useState } from 'react'

/**
 * 商品卡片子组件
 * 
 * 接收 props:
 * - product: 商品对象
 * - onAddToCart: 添加到购物车的回调函数
 */
function ProductCard({ product, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '10px',
        backgroundColor: isHovered ? '#f9f9f9' : 'white',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{product.name}</h3>
      <p style={{ color: '#666' }}>{product.description}</p>
      <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#e74c3c' }}>
        ¥{product.price}
      </p>
      <button
        onClick={() => onAddToCart(product)}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        加入购物车
      </button>
    </div>
  )
}

/**
 * 商品列表主组件
 */
function ProductList({ products }) {
  // State: 购物车
  const [cart, setCart] = useState([])
  
  /**
   * 添加到购物车
   */
  const handleAddToCart = (product) => {
    // 方式 1：展开运算符
    // setCart([...cart, product])
    
    // 方式 2：push 后重新创建数组
    const newCart = [...cart]
    newCart.push(product)
    setCart(newCart)
    
    // 显示提示
    alert(`${product.name} 已加入购物车`)
  }
  
  /**
   * 清空购物车
   */
  const handleClearCart = () => {
    setCart([])
  }
  
  /**
   * 计算总价
   */
  const totalPrice = cart.reduce((sum, product) => sum + product.price, 0)
  
  return (
    <div className="product-list">
      <h2>商品列表</h2>
      
      {/* 购物车区域 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>购物车 ({cart.length} 件商品)</h3>
        {cart.length === 0 ? (
          <p style={{ color: '#666' }}>购物车是空的</p>
        ) : (
          <>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>{item.name} - ¥{item.price}</li>
              ))}
            </ul>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
              总价：¥{totalPrice}
            </p>
            <button
              onClick={handleClearCart}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              清空购物车
            </button>
          </>
        )}
      </div>
      
      {/* 商品列表 */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductList