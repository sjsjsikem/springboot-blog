/**
 * 文章 API 服务
 * 
 * 封装与文章相关的所有 API 调用
 */

import api from '../util/api'

/**
 * 文章服务对象
 */
const articleService = {

  
  getArticles: async (page = 0, size = 10) => {
    const response = await api.get('/articles', {
      params: { page, size }
    })
    return response.data
  },
  

  getArticleById: async (id) => {
    const response = await api.get(`/articles/${id}`)
    return response.data
  },
  

  createArticle: async (articleData) => {
    const response = await api.post('/articles', articleData)
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
  },
  

  // updateArticle: async (id, articleData) => {
  //   const response = await api.put(`/articles/${id}`, articleData)
  //   return response.data
  // }, 

  // deleteArticle: async (id) => {
  //   const response = await api.delete(`/articles/${id}`)
  //   return response.data
  // },
  
  
  //*搜索文章，由于参数page和size是从request传入，所以在controller中方法只传入keyword
  searchArticle: async (keyword, page = 0, size = 10) => {
    const response = await api.get('/articles/search', {
      params: { keyword, page, size }
    })
    return response.data
  },

  //按分类查询文章
  getArticlesByCategory: async (categoryId, page = 0, size = 10) => {
    const response = await api.get('/articles/category', {
      params: { categoryId, page, size }
    })
    return response.data
  },
  
  //按标签查询文章
  // getArticlesByTag: async (tagId, page = 0, size = 10) => {
  //   const response = await api.get('/articles/tag', {
  //     params: { tagId, page, size }
  //   })
  //   return response.data
  // },
  

}

// 导出服务对象
export default articleService