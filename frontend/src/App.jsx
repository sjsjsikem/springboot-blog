/**
 * App 根组件
 * 
 * 配置 React Router 路由
 * 
 * 路由配置说明：
 * 1. BrowserRouter: 路由容器（必须包裹在最外层）
 * 2. Routes: 所有路由的集合
 * 3. Route: 单个路由规则
 *    - path: URL 路径
 *    - element: 要渲染的组件
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import './App.css'

// 导入导航组件
import NavBar from './components/NavBar'

// 导入页面组件
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import ArticleList from './pages/ArticleList'
import ArticleDetail from './pages/ArticleDetail'
import CreateArticle from './pages/CreateArticle'
import CreateCategory from './pages/CreateCategory'
import CategoryDetail from './pages/CategoryDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import CommentList from './pages/CommentList'
import SearchArticle from './pages/SearchArticle'

function App() {
  return (
    // 多层 Provider 包裹（顺序很重要！）
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="app">
              {/* 2. 导航栏 */}
              <NavBar />
              
              {/* 3. 路由集合 */}
              <Routes>
                {/* 公开路由 */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/articles" element={<ArticleList />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/create" element={<CreateArticle />} />
                <Route path="/createCategory" element={<CreateCategory />} />
                <Route path="/category/:id" element={<CategoryDetail />} />
                <Route path="/comments" element={<CommentList/>} />
                <Route path="/search" element={<SearchArticle />} />
                
                {/* 认证路由 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
