/**
 * 文章详情页组件
 * 
 * 演示动态路由参数 + 真实 API 调用
 * 
 * 动态路由：
 * - 路径：/article/:id
 * - :id 是动态参数
 * - 可以匹配 /article/1, /article/2, /article/123 等
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import articleService from '../services/articleService'
import categoryService from '../services/CategoryService'

function ArticleDetail() {
  /**
   * useParams Hook
   * 
   * 作用：获取 URL 中的动态参数
   * 返回：参数对象
   */
  const { id } = useParams()
  
  /**
   * useNavigate Hook
   * 
   * 作用：编程式导航（代码控制跳转）
   * 返回：导航函数
   */
  const navigate = useNavigate()
  
  // State: 文章数据---文章实体
  const [article, setArticle] = useState(null)
  
  // State: 分类数据
  const [category, setCategory] = useState(null)
  
  // State: 加载状态
  const [loading, setLoading] = useState(true)
  
  // State: 错误信息
  const [error, setError] = useState(null)
  
  /**
   * useEffect: 组件挂载时加载文章详情
   * 
   * 依赖数组：[id] - 当 id 变化时重新加载
   */
  useEffect(() => {
    loadArticle()
  }, [id])
  
  /**
   * 加载文章详情
   */
  const loadArticle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 正在加载文章详情，ID:', id)
      
      // 调用 API 服务，获取文章详情并返回数据
      const response = await articleService.getArticleById(id)
      console.log('✅ 加载成功:', response)
      // 更新文章数据
      const articleData = response.data || response
      setArticle(articleData)

      // 如果文章有分类ID，加载分类信息
      if (articleData.categoryId) {
        try {
          const categoryResponse = await categoryService.getById(articleData.categoryId)
          setCategory(categoryResponse.data || categoryResponse)
        } catch (err) {
          console.error('❌ 加载分类失败:', err)
          setCategory(null)
        }
      } else {
        setCategory(null)
      }

      //对文章浏览量进行增加
      await articleService.incrementViewCount(id)
    } catch (err) {
      console.error('❌ 加载失败:', err)
      setError(err.message || '加载文章失败')
    } finally {
      setLoading(false)
    }
  }
  
  //处理文章点赞行为---》一般handle+行为/指向具体service行为的处理函数，基本山就相当于后端中的controller
  //层的函数，其作用是在前端获取数据，调用行为和更新渲染---区别于后端controller的获取数据和回传响应
  const handleLike=async()=>{
    try {
      await articleService.incrementLikeCount(id)
      // 更新本地状态
      setArticle(prev=>({...prev,likeCount:prev.likeCount+1}))
      alert('点赞成功')
    } catch (err) {
      //控制器异常日志
      console.error('❌ 点赞失败:', err)
      //更新错误信息
      setError(err.message || '点赞失败')
      //弹窗提示错误
      alert('点赞失败')
    }
  }

  // -----------------渲染行为--------------------

  // 条件渲染：加载中
  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center' 
      }}>
        <div style={{ 
          fontSize: '24px',
          color: '#666',
          marginBottom: '20px'
        }}>
          🔄 加载中...
        </div>
      </div>
    )
  }
  
  // 条件渲染：错误
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#dc3545' }}>❌ 加载失败</h1>
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          返回上一页
        </button>
      </div>
    )
  }
  
  // 条件渲染：文章不存在
  if (!article) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#dc3545' }}>❌ 文章不存在</h1>
        <p>抱歉，您访问的文章不存在。</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          返回上一页
        </button>
      </div>
    )
  }
  
  // 渲染文章内容----全局渲染，如果条件渲染不触发，所有操作成功则渲染该页面
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      {/* 返回按钮 */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← 返回
      </button>
      
      {/* 文章标题 */}
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '15px',
        color: '#333'
      }}>
        {article.title}
      </h1>
      
      {/* 文章元信息 */}
      <div style={{ 
        color: '#666', 
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid #ddd'
      }}>
        <span>作者：{article.author || '未知'}</span>
        <span style={{ marginLeft: '20px' }}>发布日期：{article.createTime ? new Date(article.createTime).toLocaleDateString('zh-CN') : '未知'}</span>
        <span style={{ marginLeft: '20px' }}>文章 ID：{article.id || id}</span>
        <span style={{ marginLeft: '20px' }}>点赞数：{article.likeCount || 0}</span>
        <span style={{ marginLeft: '20px' }}>浏览量：{article.viewCount || 0}</span>
      </div>
      
      {/* 分类标签 */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontWeight: 'bold', color: '#333' }}>分类：</span>
        {category ? (
          <span 
            onClick={() => navigate(`/category/${category.id}`)}
            style={{
              padding: '6px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '20px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#007bff'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {category.name}
          </span>
        ) : (
          <span style={{
            padding: '6px 16px',
            backgroundColor: '#ccc',
            color: '#666',
            borderRadius: '20px',
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            无分类
          </span>
        )}
      </div>
      
      {/* 文章内容 */}
      <div style={{ 
        lineHeight: '1.8',
        fontSize: '16px',
        color: '#333'
      }}>
        {article.content}
      </div>
      
      {/* 点赞操作按钮操作按钮 */}
      <div style={{ 
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #ddd'
      }}>
        <button
          onClick={handleLike}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          👍 点赞
        </button>
        {/* 将评论CommentList的内容和文章详情页合并到一起，写在详情页右侧 */}
                  
        

        {/* <button
          onClick={() => alert('分享功能开发中...')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔗 分享
        </button> */}
      </div>
    </div>
  )
}

export default ArticleDetail