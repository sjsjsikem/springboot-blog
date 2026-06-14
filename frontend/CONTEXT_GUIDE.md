# React Context 使用指南

## 📚 什么是 Context？

Context 是 React 提供的**全局状态管理方案**，用于解决"props 逐层传递"（Props Drilling）的问题。

**核心思想**：创建一个"数据管道"，让数据可以从顶层直接传递到任何底层组件，无需层层传递。

---

## 🎯 项目中的 Context 示例

### 1️⃣ **AuthContext（用户认证上下文）**
📁 位置：`src/context/AuthContext.jsx`

**作用**：
- 全局管理用户登录状态
- 提供登录、登出方法
- 在任何组件中获取用户信息

**提供的数据**：
```javascript
{
  user,              // 用户信息对象
  isAuthenticated,   // 是否已登录（boolean）
  loading,          // 加载状态
  login,            // 登录方法
  logout,           // 登出方法
  checkAuth         // 检查认证状态
}
```

**使用示例**：
```jsx
import { useAuth } from '../context/AuthContext'

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth()
  
  return (
    <nav>
      {isAuthenticated ? (
        <span>欢迎 {user.nickname}！</span>
      ) : (
        <a href="/login">登录</a>
      )}
    </nav>
  )
}
```

---

### 2️⃣ **ThemeContext（主题上下文）**
📁 位置：`src/context/ThemeContext.jsx`

**作用**：
- 全局管理应用主题（深色/浅色模式）
- 持久化主题设置到 localStorage
- 在任何组件中切换主题

**提供的数据**：
```javascript
{
  theme,      // 'light' 或 'dark'
  isDark,     // 是否为深色模式（boolean）
  toggleTheme // 切换主题方法
}
```

**使用示例**：
```jsx
import { useTheme } from '../context/ThemeContext'

function Header() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <header style={{
      backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#ffffff' : '#333333'
    }}>
      <button onClick={toggleTheme}>
        {isDark ? '☀️ 浅色模式' : '🌙 深色模式'}
      </button>
    </header>
  )
}
```

---

### 3️⃣ **NotificationContext（通知上下文）**
📁 位置：`src/context/NotificationContext.jsx`

**作用**：
- 全局管理应用通知（Toast 消息）
- 提供成功、错误、警告、信息四种通知类型
- 自动消失的消息提示

**提供的数据**：
```javascript
{
  notifications,     // 通知列表
  addNotification,   // 添加通知（通用方法）
  removeNotification,// 移除通知
  success,          // 成功通知
  error,            // 错误通知
  warning,          // 警告通知
  info              // 信息通知
}
```

**使用示例**：
```jsx
import { useNotification } from '../context/NotificationContext'

function CreateArticle() {
  const { success, error } = useNotification()
  
  const handleSubmit = async () => {
    try {
      await api.createArticle(data)
      success('文章创建成功！')
    } catch (err) {
      error('创建失败：' + err.message)
    }
  }
  
  return <button onClick={handleSubmit}>创建</button>
}
```

---

### 4️⃣ **CartContext（购物车上下文）**
📁 位置：`src/context/CartContext.jsx`

**作用**：
- 全局管理购物车状态
- 添加商品、删除商品、更新数量
- 计算总价和商品总数
- 持久化到 localStorage

**提供的数据**：
```javascript
{
  cartItems,      // 购物车商品列表
  addToCart,      // 添加到购物车
  removeFromCart, // 从购物车移除
  updateQuantity, // 更新商品数量
  clearCart,      // 清空购物车
  getTotalItems,  // 获取商品总数
  getTotalPrice,  // 获取总价
  itemCount,      // 商品总数（简写）
  totalPrice      // 总价（简写）
}
```

**使用示例**：
```jsx
import { useCart } from '../context/CartContext'

function ProductList() {
  const { addToCart } = useCart()
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>¥{product.price}</p>
          <button onClick={() => addToCart(product)}>
            加入购物车
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔧 如何配置多个 Context

### 在 App.jsx 中包裹 Provider

```jsx
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    // 多层 Provider 包裹（顺序很重要！）
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              {/* 路由配置 */}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}
```

**⚠️ 注意事项**：
- Provider 的嵌套顺序会影响 Context 的依赖关系
- 被依赖的 Context 应该在外层
- 一般顺序：ThemeProvider → NotificationProvider → AuthProvider → 其他

---

## 📊 Context 使用场景对比

| Context | 适用场景 | 数据特点 | 更新频率 |
|---------|---------|---------|---------|
| **AuthContext** | 用户认证系统 | 用户信息、登录状态 | 低（登录/登出时） |
| **ThemeContext** | 主题切换 | 主题模式 | 低（用户手动切换） |
| **NotificationContext** | 消息通知 | 通知列表 | 中（操作反馈） |
| **CartContext** | 电商购物车 | 商品列表、价格 | 高（频繁添加/删除） |

---

## ✅ 适合使用 Context 的场景

1. **用户认证状态** - 登录/登出、权限控制
2. **主题切换** - 深色/浅色模式
3. **语言切换** - 国际化多语言
4. **购物车** - 电商应用的商品管理
5. **通知系统** - 全局 Toast 消息
6. **侧边栏状态** - 展开/收起
7. **面包屑导航** - 路径记录
8. **表单数据** - 跨组件的表单状态

---

## ⚠️ 不适合使用 Context 的场景

1. **只在一两个组件间传递的数据** - 直接用 props
2. **频繁变化的数据** - 可能导致性能问题（考虑使用状态管理库如 Redux、Zustand）
3. **组件特有的局部状态** - 使用 useState
4. **需要高性能的场景** - Context 更新会触发所有消费者重新渲染

---

## 🎯 最佳实践

### 1. **按功能拆分 Context**
不要把所有状态放在一个 Context 中：

```jsx
// ❌ 不推荐：一个巨大的 Context
const AppContext = createContext({
  user, theme, cart, notifications, ...
})

// ✅ 推荐：按功能拆分
const AuthContext = createContext(...)
const ThemeContext = createContext(...)
const CartContext = createContext(...)
```

### 2. **使用自定义 Hook**
提供简洁的 API：

```jsx
// ✅ 推荐
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用')
  }
  return context
}

// 使用
const { user, login } = useAuth()
```

### 3. **优化性能**
避免不必要的重新渲染：

```jsx
// ✅ 使用 useMemo 优化
const value = useMemo(() => ({
  user,
  isAuthenticated,
  login,
  logout
}), [user, isAuthenticated])

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
)
```

### 4. **持久化状态**
使用 localStorage 保存重要数据：

```jsx
useEffect(() => {
  const saved = localStorage.getItem('theme')
  if (saved) setTheme(saved)
}, [])

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light'
  setTheme(newTheme)
  localStorage.setItem('theme', newTheme)
}
```

---

## 🚀 总结

**Context 的核心价值**：
- ✅ 避免 Props Drilling（逐层传递 props）
- ✅ 全局状态管理
- ✅ 代码更简洁、易维护
- ✅ 组件间解耦

**使用原则**：
1. 只在真正需要全局共享时使用
2. 按功能拆分成多个 Context
3. 使用自定义 Hook 提供简洁 API
4. 注意性能优化

**你的博客项目中已经实现了 4 个 Context**：
- AuthContext - 用户认证
- ThemeContext - 主题切换
- NotificationContext - 通知系统
- CartContext - 购物车（可用于未来电商功能）

现在你可以在任何组件中通过 `useAuth()`、`useTheme()`、`useNotification()` 来获取全局状态！🎉
