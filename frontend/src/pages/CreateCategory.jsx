import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import categoryService from '../services/CategoryService'

function CreateCategory() {

    //状态设置原则：处理数据的状态+处理操作的状态
    //加载数据类型的状态（数据）
    const [categories, setCategories] = useState([])
    //处理加载和加载中的状态（操作+数据）
    const [loading, setLoading] = useState(false)
    //处理错误的状态（操作+数据）
    const [error, setError] = useState('')
    
    //处理分页的状态（操作）
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
     
    //加载路由
    const navigate = useNavigate()

    //分类填写数据
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    })

    
    
    //作用：在组件挂载时加载分类列表---一般是处理下面的加载操作用的，处理的时候会导入下面的相关函数
    //副作用的依据一般是数据类型
    useEffect(() => {
        loadCategories()
    }, [currentPage])
    
    //处理加载的函数-加载数据类型
    const loadCategories = async () => {
        setLoading(true)
        try {
            const response = await categoryService.getAll()
            console.log('加载分类成功:', response)
            setCategories(response)
            setTotalPages(1)
            setTotalElements(response.length)
        } catch (err) {
            console.error('❌ 加载失败:', err)
            setError(err.message || '加载分类失败')
        } finally {
            setLoading(false)
        }
    }
    
    //处理分类点击导航的操作
    const handleCategoryClick = (id) => {
        navigate(`/category/${id}`)
    }
     
    //处理上一业点击的函数
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }
    
    //处理下一页点击的函数
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1)
        }
    }

    //处理变化handleChange
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    //处理分类数据的提交handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.description) {
            setError('请输入分类名称和描述')
            return
        }

        try {
            setLoading(true)
            setError('')

            const category = {
                name: formData.name,
                description: formData.description
            }

            await categoryService.create(category)
            setFormData({ name: '', description: '' })
            loadCategories()
        } catch (err) {
            console.error('❌ 创建分类失败:', err)
            setError(err.message || '创建分类失败')
        } finally {
            setLoading(false)
        }
    }

    //--页面渲染---元素区。根据元素性质，调用上面方法实现正确渲染。又根据方法的性质，来
    //确定元素的基本设计
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
    
    if (categories.length === 0) {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                color: '#666'
            }}>
                <h2 style={{ marginBottom: '15px' }}>📝 暂无分类</h2>
                <p style={{ marginBottom: '20px' }}>还没有任何分类，快来创建第一个吧！</p>
                <form onSubmit={handleSubmit} style={{
                    textAlign: 'left',
                    maxWidth: '500px',
                    margin: '0 auto',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                }}>
                    <h3 style={{ marginBottom: '15px' }}>➕ 创建新分类</h3>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="请输入分类名称"
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="请输入分类描述"
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? '提交中...' : '提交分类'}
                    </button>
                </form>
            </div>
        )
    }
    
    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>📚 分类列表</h1>
            
            {/* 创建分类表单 */}
            <form onSubmit={handleSubmit} style={{
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <h3 style={{ marginBottom: '15px' }}>➕ 创建新分类</h3>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入分类名称"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxSizing: 'border-box'
                    }}
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="请输入分类描述"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxSizing: 'border-box'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '提交中...' : '提交分类'}
                </button>
            </form>

            <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>共 {totalElements} 个分类</span>
                <span>第 {currentPage + 1} / {totalPages} 页</span>
            </div>
            
            <div>
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
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
                            {category.name}
                        </h2>
                        
                        <p style={{ 
                            color: '#666',
                            lineHeight: '1.6',
                            marginBottom: '15px'
                        }}>
                            {category.description || '暂无描述'}
                        </p>
                        
                        <div style={{ 
                            color: '#999',
                            fontSize: '14px'
                        }}>
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
            
            <div style={{ 
                marginTop: '30px',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
            }}>
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
