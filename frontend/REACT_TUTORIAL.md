# React + Vite 博客前端开发教程

## 教程概述

本教程将**手把手**带你从零开始，使用 React + Vite 开发一个完整的博客前端系统，与后端 Spring Boot API 完美对接。

### 后端功能模块总览

根据已开发的后端代码，我们的博客系统包含以下核心功能模块：

1. **用户认证模块** (`/api/auth`)
   - 用户注册 (`POST /api/auth/register`)
   - 用户登录 (`POST /api/auth/login`)

2. **文章管理模块** (`/api/articles`)
   - 获取所有文章（分页、排序）
   - 根据 ID 获取文章详情
   - 创建文章
   - 更新文章
   - 删除文章
   - 按分类查询文章
   - 按标签查询文章
   - 搜索文章
   - 增加浏览量和点赞数

3. **分类管理模块** (`/api/categories`)
   - 获取所有分类
   - 根据 ID 获取分类详情
   - 创建分类
   - 更新分类
   - 删除分类

4. **标签管理模块** (`/api/tags`)
   - 获取所有标签
   - 根据 ID 获取标签详情
   - 创建标签
   - 更新标签
   - 删除标签
   - 根据标签名称搜索

5. **评论管理模块** (`/api/comments`)
   - 创建评论（包括回复）
   - 根据文章 ID 查询评论（树形结构）
   - 删除评论（软删除）
   - 更新评论状态（审核功能）
   - 更新评论内容

### 前端技术栈

- **React 19** - 最新版本，使用函数组件和 Hooks
- **Vite** - 快速构建工具
- **React Router DOM** - 路由管理
- **Axios** - HTTP 请求库
- **Context API** - 全局状态管理

---

## 第一阶段：项目基础架构

### 第 1 步：理解 React 分层架构

#### 1.1 什么是分层架构？

在我们的博客系统中，分层架构如下：

```
用户界面层 (Pages/Components)
        ↓
状态管理层 (Context/Hooks)
        ↓
服务调用层 (Services)
        ↓
API 配置层 (Axios Config)
        ↓
后端 API 层 (Spring Boot)
```

**每一层的职责：**

1. **用户界面层**：负责展示数据和接收用户输入
2. **状态管理层**：管理全局状态（如用户登录状态）
3. **服务调用层**：封装 API 调用逻辑
4. **API 配置层**：配置 Axios 实例、请求拦截器等
5. **后端 API 层**：处理业务逻辑和数据持久化

#### 1.2 数据流向说明

以**用户登录**为例：

```
1. 用户在 Login 页面输入用户名和密码
2. 点击登录按钮，调用 userService.login()
3. userService 调用 api.post('/auth/login', data)
4. Axios 拦截器自动添加请求头
5. 后端 UserController 接收请求
6. UserService 处理登录逻辑
7. 返回 JWT Token
8. Axios 响应拦截器处理响应
9. userService 保存 Token 到 localStorage
10. 更新 AuthContext 中的用户状态
11. NavBar 组件检测到登录状态变化，显示用户信息
12. 页面跳转到首页
```

---

## 第二阶段：用户认证模块

### 第 2 步：完善用户服务层

#### 2.1 理解 API 层的结构

查看 `src/util/api.js`：

**作用：** 创建统一的 Axios 实例，配置请求和响应拦截器

**核心原理：**

```javascript
// 1. 创建 Axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // 所有请求的基础路径
  timeout: 10000,  // 超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 2. 请求拦截器：在发送请求前统一处理
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

// 3. 响应拦截器：在接收响应后统一处理
api.interceptors.response.use(
  (response) => {
    // 直接返回数据部分
    return response.data
  },
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // Token 过期，清除并跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

**与后端联动：**

- 后端使用 JWT 进行认证
- 前端在请求头中携带 `Authorization: Bearer <token>`
- 后端的 `JwtAuthenticationFilter` 会验证 token

#### 2.2 完善用户服务

查看 `src/services/userService.js`：

**作用：** 封装与用户相关的 API 调用

**需要添加的功能：**

```javascript
/**
 * 用户 API 服务
 */
import api from '../util/api'

const userService = {
  // 用户注册
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  // 用户登录
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password
    })
    
    // 保存 token
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    
    return response.data
  },
  
  // 退出登录
  logout: () => {
    localStorage.removeItem('token')
  },
  
  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
  
  // TODO: 获取用户详情（根据 ID）
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  
  // TODO: 更新用户信息
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  }
}

export default userService
```

---

### 第 3 步：认证上下文（AuthContext）

#### 3.1 理解 Context 的作用

**问题：** 如何在任何组件中都能访问用户登录状态？

**解决方案：** 使用 React Context

**原理：**

```
AuthProvider (提供者)
    ↓
创建 Context (数据容器)
    ↓
所有子组件都可以 useContext() 获取数据
```

#### 3.2 AuthContext 详解

查看 `src/context/AuthContext.jsx`：

```javascript
// 1. 创建 Context
const AuthContext = createContext(null)

// 2. 创建 Provider 组件
export function AuthProvider({ children }) {
  // 用户信息状态
  const [user, setUser] = useState(null)
  // 是否已登录
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // 登录方法
  const login = async (username, password) => {
    const response = await userService.login(username, password)
    setUser(response.data)
    setIsAuthenticated(true)
  }
  
  // 登出方法
  const logout = () => {
    userService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }
  
  // 提供给子组件的值
  const value = {
    user,
    isAuthenticated,
    login,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. 自定义 Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用')
  }
  return context
}
```

**在组件中使用：**

```javascript
function NavBar() {
  const { isAuthenticated, user, logout } = useAuth()
  
  return (
    <nav>
      {isAuthenticated ? (
        <span>欢迎，{user.username}！</span>
      ) : (
        <Link to="/login">登录</Link>
      )}
    </nav>
  )
}
```

---

### 第 4 步：登录页面

#### 4.1 登录页面完整实现

查看 `src/pages/Login.jsx`：

**功能分层说明：**

1. **UI 层**：表单输入框、按钮
2. **状态层**：管理表单数据、加载状态、错误信息
3. **服务层**：调用 userService.login()
4. **路由层**：登录成功后跳转

**核心代码解析：**

```javascript
function Login() {
  // 1. 状态管理
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // 2. 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // 3. 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault()  // 阻止默认提交
    
    try {
      setLoading(true)
      setError('')
      
      // 调用服务层
      await userService.login(formData.username, formData.password)
      
      // 登录成功，跳转
      navigate('/')
    } catch (err) {
      setError('用户名或密码错误')
    } finally {
      setLoading(false)
    }
  }
  
  // 4. 渲染 UI
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}
```

#### 4.2 数据流转全过程

```
1. 用户输入用户名和密码
   ↓
2. handleChange 更新 formData 状态
   ↓
3. 点击登录，触发 handleSubmit
   ↓
4. 调用 userService.login()
   ↓
5. api.post('/auth/login', { username, password })
   ↓
6. 后端 UserController.login() 处理
   ↓
7. UserService 验证用户名密码
   ↓
8. 生成 JWT Token 并返回
   ↓
9. 前端保存 Token 到 localStorage
   ↓
10. AuthContext 更新用户状态
   ↓
11. navigate('/') 跳转到首页
   ↓
12. NavBar 检测到登录状态，显示用户信息
```

---

### 第 5 步：注册页面

#### 5.1 注册页面实现

创建 `src/pages/Register.jsx`：

```javascript
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import userService from '../services/userService'

function Register() {
  const navigate = useNavigate()
  
  // 表单数据
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }
  
  // 处理提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 验证表单
    if (!formData.username || !formData.password) {
      setError('请填写必填项')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      // 调用注册 API
      await userService.register({
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname,
        email: formData.email
      })
      
      alert('注册成功！请登录')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px'
      }}>
        <h1>用户注册</h1>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>用户名 *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label>昵称</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label>邮箱</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label>密码 *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label>确认密码 *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          已有账号？{' '}
          <Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
```

---

## 第三阶段：文章管理模块

### 第 6 步：文章服务层

#### 6.1 完善文章服务

查看 `src/services/articleService.js`：

**需要添加的完整功能：**

```javascript
import api from '../util/api'

const articleService = {
  // 获取文章列表（分页）
  getArticles: async (page = 0, size = 10) => {
    const response = await api.get('/articles', {
      params: { page, size }
    })
    return response.data
  },
  
  // 根据 ID 获取文章
  getArticleById: async (id) => {
    const response = await api.get(`/articles/${id}`)
    return response.data
  },
  
  // 创建文章
  createArticle: async (articleData) => {
    const response = await api.post('/articles', articleData)
    return response.data
  },
  
  // 更新文章
  updateArticle: async (id, articleData) => {
    const response = await api.put(`/articles/${id}`, articleData)
    return response.data
  },
  
  // 删除文章
  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`)
    return response.data
  },
  
  // 搜索文章
  searchArticles: async (keyword, page = 0, size = 10) => {
    const response = await api.get('/articles/search', {
      params: { keyword, page, size }
    })
    return response.data
  },
  
  // 按分类查询文章
  getArticlesByCategory: async (categoryId, page = 0, size = 10) => {
    const response = await api.get('/articles/category', {
      params: { categoryId, page, size }
    })
    return response.data
  },
  
  // 按标签查询文章
  getArticlesByTag: async (tagId, page = 0, size = 10) => {
    const response = await api.get('/articles/tag', {
      params: { tagId, page, size }
    })
    return response.data
  },
  
  // 增加浏览量
  incrementViewCount: async (id) => {
    const response = await api.post(`/articles/${id}/view`)
    return response.data
  },
  
  // 增加点赞数
  incrementLikeCount: async (id) => {
    const response = await api.post(`/articles/${id}/like`)
    return response.data
  }
}

export default articleService
```

---

### 第 7 步：文章列表页面

#### 7.1 理解文章列表的数据流

**完整流程：**

```
1. ArticleList 组件挂载
   ↓
2. useEffect 调用 loadArticles()
   ↓
3. articleService.getArticles(page, size)
   ↓
4. api.get('/articles', { params: { page, size } })
   ↓
5. 后端 ArticleController.getAllArticles()
   ↓
6. ArticleService.findAll(page, size)
   ↓
7. ArticleRepository.findAll(PageRequest.of(page, size))
   ↓
8. 返回 Page<Article> 对象
   ↓
9. 前端解析分页数据
   ↓
10. 更新 articles 状态
   ↓
11. 渲染文章列表
```

#### 7.2 文章列表完整实现

查看 `src/pages/ArticleList.jsx`（已实现）

**关键知识点：**

1. **useEffect 依赖数组**：
   - `[]`：只在首次渲染时执行
   - `[currentPage]`：每次 currentPage 变化时执行

2. **分页处理**：
   ```javascript
   // 后端返回的分页格式
   {
     "content": [...],      // 文章数组
     "totalPages": 10,      // 总页数
     "totalElements": 100,  // 总记录数
     "number": 0,           // 当前页码
     "size": 10             // 每页大小
   }
   ```

3. **条件渲染**：
   - 加载中：显示 loading 动画
   - 错误：显示错误信息和重试按钮
   - 空数据：显示空状态提示
   - 正常：显示文章列表

---

### 第 8 步：文章详情页面

#### 8.1 创建文章详情页面

创建 `src/pages/ArticleDetail.jsx`：

```javascript
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import articleService from '../services/articleService'

function ArticleDetail() {
  const { id } = useParams()  // 从 URL 获取文章 ID
  const navigate = useNavigate()
  
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadArticle()
  }, [id])
  
  const loadArticle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 获取文章详情
      const response = await articleService.getArticleById(id)
      setArticle(response.data || response)
      
      // 增加浏览量
      await articleService.incrementViewCount(id)
    } catch (err) {
      setError('文章加载失败')
    } finally {
      setLoading(false)
    }
  }
  
  const handleLike = async () => {
    try {
      await articleService.incrementLikeCount(id)
      // 更新本地状态
      setArticle(prev => ({
        ...prev,
        likeCount: (prev.likeCount || 0) + 1
      }))
      alert('点赞成功！')
    } catch (err) {
      alert('点赞失败')
    }
  }
  
  if (loading) {
    return <div>加载中...</div>
  }
  
  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate('/articles')}>返回文章列表</button>
      </div>
    )
  }
  
  if (!article) {
    return <div>文章不存在</div>
  }
  
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/articles')}>← 返回列表</button>
      
      <article style={{ marginTop: '20px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
          {article.title}
        </h1>
        
        <div style={{ 
          color: '#666', 
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <span>作者：{article.author}</span>
          <span style={{ marginLeft: '20px' }}>
            发布时间：{new Date(article.createTime).toLocaleDateString('zh-CN')}
          </span>
          <span style={{ marginLeft: '20px' }}>
            浏览量：{article.viewCount || 0}
          </span>
          <span style={{ marginLeft: '20px' }}>
            点赞数：{article.likeCount || 0}
          </span>
        </div>
        
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <button
            onClick={handleLike}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            👍 点赞 ({article.likeCount || 0})
          </button>
        </div>
        
        <div style={{ 
          lineHeight: '1.8',
          fontSize: '16px'
        }}>
          {article.content}
        </div>
      </article>
    </div>
  )
}

export default ArticleDetail
```

---

### 第 9 步：创建文章页面

#### 9.1 创建文章表单页面

创建 `src/pages/CreateArticle.jsx`：

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import articleService from '../services/articleService'
import categoryService from '../services/categoryService'
import tagService from '../services/tagService'

function CreateArticle() {
  const navigate = useNavigate()
  
  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    categoryId: '',
    tagIds: []
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  
  // 加载分类和标签列表
  useEffect(() => {
    loadCategories()
    loadTags()
  }, [])
  
  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll()
      setCategories(response.data || response)
    } catch (err) {
      console.error('加载分类失败', err)
    }
  }
  
  const loadTags = async () => {
    try {
      const response = await tagService.getAll()
      setTags(response.data || response)
    } catch (err) {
      console.error('加载标签失败', err)
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.author) {
      setError('请填写必填项')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      // 准备提交数据
      const submitData = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        categoryId: formData.categoryId ? Number(formData.categoryId) : null
      }
      
      await articleService.createArticle(submitData)
      
      alert('文章创建成功！')
      navigate('/articles')
    } catch (err) {
      setError(err.response?.data?.message || '创建失败')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>创建文章</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>标题 *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label>作者 *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label>分类</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
          >
            <option value="">选择分类</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label>内容 *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '创建中...' : '创建文章'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/articles')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateArticle
```

---

## 第四阶段：分类和标签模块

### 第 10 步：分类服务

#### 10.1 创建分类服务

创建 `src/services/categoryService.js`：

```javascript
import api from '../util/api'

const categoryService = {
  // 获取所有分类
  getAll: async () => {
    const response = await api.get('/categories')
    return response.data
  },
  
  // 根据 ID 获取分类
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },
  
  // 创建分类
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData)
    return response.data
  },
  
  // 更新分类
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response.data
  },
  
  // 删除分类
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  }
}

export default categoryService
```

---

### 第 11 步：标签服务

#### 11.1 创建标签服务

创建 `src/services/tagService.js`：

```javascript
import api from '../util/api'

const tagService = {
  // 获取所有标签
  getAll: async () => {
    const response = await api.get('/tags')
    return response.data
  },
  
  // 根据 ID 获取标签
  getById: async (id) => {
    const response = await api.get(`/tags/${id}`)
    return response.data
  },
  
  // 创建标签
  create: async (tagData) => {
    const response = await api.post('/tags', tagData)
    return response.data
  },
  
  // 更新标签
  update: async (id, tagData) => {
    const response = await api.put(`/tags/${id}`, tagData)
    return response.data
  },
  
  // 删除标签
  delete: async (id) => {
    const response = await api.delete(`/tags/${id}`)
    return response.data
  },
  
  // 根据名称搜索标签
  searchByName: async (name) => {
    const response = await api.get('/tags/search', {
      params: { name }
    })
    return response.data
  }
}

export default tagService
```

---

## 第五阶段：评论模块

### 第 12 步：评论服务

#### 12.1 创建评论服务

创建 `src/services/commentService.js`：

```javascript
import api from '../util/api'

const commentService = {
  // 创建评论
  create: async (commentData) => {
    const response = await api.post('/comments', commentData)
    return response.data
  },
  
  // 根据文章 ID 获取评论
  getByArticleId: async (articleId) => {
    const response = await api.get('/comments', {
      params: { articleId }
    })
    return response.data
  },
  
  // 删除评论
  delete: async (id) => {
    const response = await api.delete(`/comments/${id}`)
    return response.data
  },
  
  // 更新评论状态
  updateStatus: async (id, status) => {
    const response = await api.put(`/comments/${id}/status`, null, {
      params: { status }
    })
    return response.data
  },
  
  // 更新评论内容
  update: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData)
    return response.data
  }
}

export default commentService
```

---

### 第 13 步：评论组件

#### 13.1 创建评论列表组件

创建 `src/components/CommentList.jsx`：

```javascript
import { useState, useEffect } from 'react'
import commentService from '../services/commentService'

function CommentList({ articleId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState({
    commentator: '',
    email: '',
    content: ''
  })
  
  useEffect(() => {
    loadComments()
  }, [articleId])
  
  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await commentService.getByArticleId(articleId)
      setComments(response.data || response)
    } catch (err) {
      console.error('加载评论失败', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await commentService.create({
        articleId,
        ...newComment
      })
      
      // 重新加载评论
      loadComments()
      
      // 清空表单
      setNewComment({
        commentator: '',
        email: '',
        content: ''
      })
      
      alert('评论成功！')
    } catch (err) {
      alert('评论失败')
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条评论吗？')) return
    
    try {
      await commentService.delete(id)
      loadComments()
      alert('评论已删除')
    } catch (err) {
      alert('删除失败')
    }
  }
  
  if (loading) {
    return <div>加载评论中...</div>
  }
  
  return (
    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h2>评论 ({comments.length})</h2>
      
      {/* 发表评论表单 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="昵称"
            value={newComment.commentator}
            onChange={(e) => setNewComment(prev => ({
              ...prev,
              commentator: e.target.value
            }))}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="邮箱"
            value={newComment.email}
            onChange={(e) => setNewComment(prev => ({
              ...prev,
              email: e.target.value
            }))}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <textarea
            placeholder="评论内容"
            value={newComment.content}
            onChange={(e) => setNewComment(prev => ({
              ...prev,
              content: e.target.value
            }))}
            required
            rows="4"
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          发表评论
        </button>
      </form>
      
      {/* 评论列表 */}
      <div>
        {comments.map(comment => (
          <div
            key={comment.id}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <strong>{comment.commentator}</strong>
              <button
                onClick={() => handleDelete(comment.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                删除
              </button>
            </div>
            
            <p style={{ marginBottom: '10px' }}>{comment.content}</p>
            
            <small style={{ color: '#999' }}>
              {new Date(comment.createTime).toLocaleString('zh-CN')}
            </small>
            
            {/* 回复列表 */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ 
                marginTop: '15px', 
                paddingLeft: '20px',
                borderLeft: '3px solid #007bff'
              }}>
                {comment.replies.map(reply => (
                  <div key={reply.id} style={{ 
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    marginBottom: '10px'
                  }}>
                    <strong>{reply.commentator}</strong>
                    <p>{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentList
```

---

## 第六阶段：完整功能整合

### 第 14 步：更新路由配置

#### 14.1 在 App.jsx 中添加所有路由

更新 `src/App.jsx`：

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './App.css'

// 导航组件
import NavBar from './components/NavBar'

// 页面组件
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import ArticleList from './pages/ArticleList'
import ArticleDetail from './pages/ArticleDetail'
import CreateArticle from './pages/CreateArticle'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <NavBar />
          
          <Routes>
            {/* 首页 */}
            <Route path="/" element={<Home />} />
            
            {/* 文章相关 */}
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/articles/create" element={<CreateArticle />} />
            
            {/* 认证相关 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 其他页面 */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
```

---

### 第 15 步：导航栏组件

#### 15.1 更新导航栏，显示登录状态

更新 `src/components/NavBar.jsx`：

```javascript
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <nav style={{
      padding: '20px',
      backgroundColor: '#333',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          🏠 首页
        </Link>
        <Link to="/articles" style={{ color: 'white', textDecoration: 'none' }}>
          📚 文章列表
        </Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>
          ℹ️ 关于
        </Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>
          📧 联系
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span>👤 {user.username}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              退出登录
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              登录
            </Link>
            <Link
              to="/register"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              注册
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar
```

---

## 总结：前后端联动完整流程

### 以"创建文章并显示"为例

#### 完整数据流：

```
【前端】
1. 用户在 CreateArticle 页面填写表单
   ↓
2. 点击"创建文章"按钮
   ↓
3. handleSubmit 调用 articleService.createArticle()
   ↓
4. articleService 调用 api.post('/articles', data)
   ↓
5. Axios 请求拦截器添加 Token 到请求头
   ↓
6. 发送 HTTP POST 请求到 http://localhost:8080/api/articles

【后端】
7. CorsConfig 允许跨域请求
   ↓
8. JwtAuthenticationFilter 验证 Token
   ↓
9. ArticleController.create() 接收请求
   ↓
10. @Valid 验证请求体数据
   ↓
11. ArticleService.create() 处理业务逻辑
   ↓
12. ArticleRepository.save() 保存到数据库
   ↓
13. 返回创建后的 Article 对象
   ↓
14. Result.success(article) 包装响应

【前端】
15. Axios 响应拦截器接收响应
   ↓
16. articleService 返回 Promise.resolve(response.data)
   ↓
17. CreateArticle 组件收到成功响应
   ↓
18. alert('文章创建成功！')
   ↓
19. navigate('/articles') 跳转到文章列表
   ↓
20. ArticleList 组件的 useEffect 触发
   ↓
21. loadArticles() 重新加载文章列表
   ↓
22. 用户看到新创建的文章
```

---

## 下一步学习建议

1. **样式优化**：学习使用 Tailwind CSS、styled-components
2. **状态管理**：学习 Redux、Zustand 等状态管理库
3. **表单验证**：学习 React Hook Form、Formik
4. **UI 组件库**：学习 Ant Design、Material-UI
5. **TypeScript**：为项目添加类型安全
6. **单元测试**：学习 Jest、React Testing Library
7. **部署**：学习 Vercel、Netlify、Docker 部署

---

## 常见问题解答

### Q1: 为什么使用 Context 而不是 Props？

**A:** 当数据需要在多个层级的组件间共享时（如用户登录状态），使用 Context 可以避免"props drilling"（逐层传递 props）。

### Q2: Axios 拦截器的作用是什么？

**A:** 
- 请求拦截器：统一添加 Token、日志记录
- 响应拦截器：统一错误处理、数据转换

### Q3: 如何处理跨域问题？

**A:** 后端配置 CorsConfig，允许前端端口的跨域请求。

### Q4: 为什么要分层？

**A:** 
- **可维护性**：每层职责清晰，易于修改
- **可测试性**：各层可独立测试
- **可复用性**：服务层可被多个组件复用
- **解耦**：UI 层不直接依赖 API 细节

---

祝你学习顺利！🎉
