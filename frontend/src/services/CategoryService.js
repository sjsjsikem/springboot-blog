import api from '../util/api'

/**
 * 分类服务对象---引入backend中articlecontroller里面有关分类的全部方法
 */
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
  },

  //根据分类id查询所有文章关联（不分页）
  getArticlesByCategory: async (id) => {
    const response = await api.get(`/categories/${id}/articles`)
    return response.data
  },

  //根据分类id分页查询文章
  getArticlesByCategoryPage: async (id, page, size) => {
    const response = await api.get(`/categories/${id}/articles/page`, { 
      params: { page, size } 
    })
    return response.data
  }
}

export default categoryService