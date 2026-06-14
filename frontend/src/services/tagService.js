import api from '../util/api'

const tagService = {
  // 获取所有标签
  getAll: async () => {
    const response = await api.get('/tags')
    return response.data
  },
  
  // 根据 ID 获取标签
  // getById: async (id) => {
  //   const response = await api.get(`/tags/${id}`)
  //   return response.data
  // },
  
  // 创建标签
  // create: async (tagData) => {
  //   const response = await api.post('/tags', tagData)
  //   return response.data
  // },
  
  // 更新标签
  // update: async (id, tagData) => {
  //   const response = await api.put(`/tags/${id}`, tagData)
  //   return response.data
  // },
  
  // 删除标签
  // delete: async (id) => {
  //   const response = await api.delete(`/tags/${id}`)
  //   return response.data
  // },
  
  // 根据名称搜索标签
  // searchByName: async (name) => {
  //   const response = await api.get('/tags/search', {
  //     params: { name }
  //   })
  //   return response.data
  // }
}

export default tagService