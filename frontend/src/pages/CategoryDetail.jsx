//导入状态和作用
import { useState, useEffect } from 'react'
//导入路由和路由参数
import { useParams, useNavigate } from 'react-router-dom'
//导入服务层
import articleService from '../services/CategoryService'

function CategoryDetail() {
    const [category,setCategory] = useState({})

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')

    // State: 分页信息---其默认状态是在第一页，之后不断地上下跳转
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    

    //调用CategorService中getArticlesByCategory方法，获取文章列表
    const loadCategoryArticles = async () => {
        

        try {
            // 设置加载状态
            setLoading(true)
            setError(null)
            
            console.log('🔄 正在加载分类文章列表，页码:', currentPage)
            
            // 调用 API 服务
            const response = await articleService.getArticlesByCategory(categoryId, currentPage, 10)
            
            console.log('✅ 加载成功:', response)
            
            // 处理响应数据
            // 后端可能返回两种格式：
            // 1. 分页格式：{ code: 200, data: { content: [...], totalPages: 10, totalElements: 100 } }
            // 2. 数组格式：[...]
            setCategory(response.data)
            setTotalPages(response.data.totalPages)
            setTotalElements(response.data.totalElements)
        } catch (err) {
            setError(err.response?.data?.message || '加载失败')
        } finally {
            setLoading(false)
        }
    }




}