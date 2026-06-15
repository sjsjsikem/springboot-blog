//导入状态和作用
import { useState, useEffect } from 'react'
//导入路由和路由参数
import { useParams, useNavigate } from 'react-router-dom'
//导入服务层
import articleService from '../services/articleService'
import categoryService from '../services/CategoryService'
import tagService from '../services/tagService'

function CreateArticle(){

    //加载路由
    const navigate= useNavigate()

    //表单数据---根据渲染的文章类型所需数据而设置的数据变量
    const [formData,setFormData]=useState({
        title: '',
        content: '',
        author: '',
        categoryId: '',
        tagIds: []
    })
    
    //设置创建状态和错误信息---加载过程和加载失败的变量定义
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    //设置分类和标签的状态--分类和标签是已有的类型
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    // 加载分类和标签列表
    useEffect(() => {
        loadCategories()
        loadTags()
    }, [])

    //处理加载分类数据
    const loadCategories = async () => {
    try {
        const response = await categoryService.getAll()
        // CategoryService.getAll() 已经返回 response.data，所以直接使用
        setCategories(Array.isArray(response) ? response : [])
        } catch (err) {
        console.error('加载分类失败', err)
        }
    }

    //处理加载标签数据
    const loadTags = async () => {
    try {
        const response = await tagService.getAll()
        // tagService.getAll() 已经返回 response.data，所以直接使用
        setTags(Array.isArray(response) ? response : [])
        } catch (err) {
        console.error('加载标签失败', err)
        }
    }
    
    //处理变化
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
        ...prev,
        [name]: value
        }))
    }

    //处理提交
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
    //先写return渲染的东西，然后再些前面的定义和规则
    //当前页面没有条件渲染
    return(
        //创建文章总标题
         <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>创建文章</h1>
            
            {error && (
                <div style={{ color: 'red', marginBottom: '20px' }}>
                {error}
                </div>
            )}
            {/* 创建标题模块+输入框 */}
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
                {/* 创建作者模块+输入框 */}
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
                {/* 创建分类模块+选择框 ---分类是在已有的分类分类中选择*/}
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
                {/* 创建标签模块+选择框 ---标签是在已有的标签分类中选择*/}
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
                {/* 创建提交按钮 */}
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
                {/* 取消创建按钮 */}
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