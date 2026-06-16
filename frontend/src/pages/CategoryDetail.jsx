//导入状态和作用
import { useState, useEffect } from 'react'
//导入路由和路由参数
import { useParams, useNavigate } from 'react-router-dom'
//导入服务层
import categoryService from '../services/CategoryService'

function CategoryDetail() {
    const [articles, setArticles] = useState([])
    const [category, setCategory] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // State: 分页信息---其默认状态是在第一页，之后不断地上下跳转
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    
    // 获取路由参数
    const { id } = useParams()
    const navigate = useNavigate()

    // 组件挂载时加载数据
    useEffect(() => {
        if (id) {
            loadCategoryArticles()
        }
    }, [currentPage, id])

    //调用CategorService中getArticlesByCategory方法，获取文章列表
    const loadCategoryArticles = async () => {
        try {
            // 设置加载状态
            setLoading(true)
            setError(null)
            
            console.log('🔄 正在加载分类文章列表，页码:', currentPage)
            
            // 调用 API 服务
            const response = await categoryService.getArticlesByCategoryPage(id, currentPage, 10)
            
            console.log('✅ 加载成功:', response)
            
            // 处理响应数据
            // 后端返回格式：Result<Page<Article>>
            // { code: 200, data: { content: [...], totalPages: 10, totalElements: 100 } }
            let articlesData = []
            let totalPagesValue = 1
            let totalElementsValue = 0
            
            // CategoryService.getArticlesByCategoryPage 返回 response.data
            // 所以 response 已经是 Result 对象
            if (response && response.data) {
                const pageData = response.data
                if (pageData.content) {
                    articlesData = pageData.content
                    totalPagesValue = pageData.totalPages || 1
                    totalElementsValue = pageData.totalElements || 0
                }
            } else if (response && response.content) {
                // 直接是 Page 对象
                articlesData = response.content
                totalPagesValue = response.totalPages || 1
                totalElementsValue = response.totalElements || 0
            }
            
            console.log('📦 解析后的文章数据:', articlesData)
            
            // 更新状态
            setArticles(articlesData)
            setTotalPages(totalPagesValue)
            setTotalElements(totalElementsValue)
            
        } catch (err) {
            setError(err.response?.data?.message || '加载失败')
        } finally {
            setLoading(false)
        }
    }

    /**
     * 处理文章点击---点击对应文章之后即可路由到对应文章当中
     */
    const handleArticleClick = (id) => {
        navigate(`/article/${id}`)
    }
    
    /**
     * 处理上一页---在文章列表有分页的时候跳转到上一页
     */
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }
    
    /**
     * 处理下一页---在文章列表有分页的时候跳转到下一页
     */
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1)
        }
    }

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
    
    // 条件渲染：错误
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
                    onClick={loadCategoryArticles}
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
    
    // 条件渲染：空数据
    if (articles.length === 0) {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                color: '#666'
            }}>
                <h2 style={{ marginBottom: '15px' }}>📝 暂无文章</h2>
                <p>该分类下还没有任何文章，敬请期待！</p>
            </div>
        )
    }

    // 正常渲染：分类文章列表
    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* 返回按钮 */}
            <button
                onClick={() => navigate('/createCategory')}
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
                ← 返回分类列表
            </button>

            <h1 style={{ marginBottom: '30px' }}>📚 分类文章列表</h1>
            
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
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
                        }}
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

export default CategoryDetail