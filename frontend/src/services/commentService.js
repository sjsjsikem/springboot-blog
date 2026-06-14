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