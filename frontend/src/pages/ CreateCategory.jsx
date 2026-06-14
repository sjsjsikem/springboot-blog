//导入状态和作用
import { useState, useEffect } from 'react'
//导入路由和路由参数
import { useParams, useNavigate } from 'react-router-dom'
//导入服务层
import articleService from '../services/CategoryService'

function CreateCategory() {
    const [categories,setCategories] = useState([])

    const [loading,setLoading] = useState(false)

    const[error,setError] = useState('')

    // State: 分页信息---其默认状态是在第一页，之后不断地上下跳转
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    // Hook: 导航
    const navigate = useNavigate()

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            const response = await articleService.getCategories({
                page: currentPage,
                size: 10,
                sort: 'id,asc'
            })
            console.log('加载分类成功:', response)
            setCategories(response.data)
            setTotalPages(response.totalPages)
            setTotalElements(response.totalElements)

        } catch (err) {
            console.error('❌ 加载失败:', err)
            setError(err.message || '加载分类失败')
        } finally {
            setLoading(false)
        }
    }

// 条件渲染：加载中---如果页面处在加载状态的时候，则渲染加载中函数（长期处于加载状态的时候，会一直渲染加载中函数）
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
        <div style={{ 
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
      </div>
    )
  }
  
  // 条件渲染：错误---如果加载文章失败，抛出错误状态的时候。会渲染错误函数（长期处于错误状态的时候，会一直渲染错误函数）
  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        color: '#dc3545'
      }}>
        <h2 style={{ marginBottom: '15px' }}>❌ 加载失败</h2>
        <p>{error}</p>
        <button
          onClick={loadCategories}
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
          重新加载
        </button>
      </div>
    )
  }
  
  // 条件渲染：空数据---如果没有分类数据，会渲染空数据函数（长期处于空数据状态的时候，会一直渲染空数据函数）
  if (categories.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        color: '#666'
      }}>
        <h2 style={{ marginBottom: '15px' }}>📝 暂无文章</h2>
        <p>还没有任何文章，敬请期待！</p>
      </div>
    )
  }
  
  // 正常渲染：文章列表---如果有文章数据，会渲染文章列表函数（长期处于文章列表状态的时候，会一直渲染文章列表函数）
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>📚 分类文件夹</h1>
      
      {/* 统计信息 */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>共 {totalElements} 篇文章</span>
        <span>第 {currentPage + 1} / {totalPages} 页</span>
      </div>
      
      {/* 文章列表 */}
      <div>
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => handleArticleClick(article.id)}
            style={{
              padding: '20px',
              marginBottom: '15px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            // 鼠标移动到文章块上的时候元素的渲染
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }}
            // 鼠标离开文章块的时候元素的渲染
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ 
              fontSize: '20px', 
              marginBottom: '10px',
              color: '#007bff'
            }}>
              {article.title}
            </h2>
            
            <p style={{ 
              color: '#666',
              lineHeight: '1.6',
              marginBottom: '15px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {article.content?.substring(0, 200) || article.summary}...
            </p>
            
            <div style={{ 
              color: '#999',
              fontSize: '14px'
            }}>
              <span>作者：{article.author || '未知'}</span>
              <span style={{ marginLeft: '20px' }}>
                发布：{new Date(article.createTime).toLocaleDateString('zh-CN')}
              </span>
              <span style={{ 
                marginLeft: '20px', 
                color: '#007bff' 
              }}>
                点击查看详情 →
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* 分页控件 */}
      <div style={{ 
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
        {/* 上一页按钮 */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: currentPage === 0 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 0 ? 0.6 : 1
          }}
        >
          上一页
        </button>
        
        <span style={{ 
          padding: '10px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          第 {currentPage + 1} / {totalPages} 页
        </span>
        
        {/* 下一页按钮 */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          style={{
            padding: '10px 20px',
            backgroundColor: currentPage >= totalPages - 1 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages - 1 ? 0.6 : 1
          }}
        >
          下一页
        </button>

          

      </div>
    </div>
  )

}

export default CreateCategory
