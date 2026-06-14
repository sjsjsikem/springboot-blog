import {useState,useEffect} from 'react'
import commentService from '../services/commentService'

function CommentList({articleId}) {
  
  //设置评论，加载和新评论状态
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState({
    commentator: '',
    email: '',
    content: ''
  })
  
  useEffect(() => {
    loadComments()
  }, [articleId])
  
  
  const loadComments = async () => {
    try {
      setLoading(true)
      const response = await commentService.getByArticleId(articleId)
      setComments(response.data || response)
    } catch (err) {
      console.error('加载评论失败', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await commentService.create({
        articleId,
        ...newComment
      })
      
      // 重新加载评论
      loadComments()
      
      // 清空表单
      setNewComment({
        commentator: '',
        email: '',
        content: ''
      })
      
      alert('评论成功！')
    } catch (err) {
      alert('评论失败')
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条评论吗？')) return
    
    try {
      await commentService.delete(id)
      loadComments()
      alert('评论已删除')
    } catch (err) {
      alert('删除失败')
    }
  }
  
  if (loading) {
    return <div>加载评论中...</div>
  }

  return(
    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa' }}>
      {/* 双栏布局容器 */}
      <div style={{ 
        display: 'flex', 
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 左侧栏 - 待加入后续内容 */}
        <div style={{
          width: '300px',
          minHeight: '400px',
          backgroundColor: '#e9ecef',
          borderRadius: '8px',
          padding: '20px',
          flexShrink: 0
        }}>
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d',
            fontSize: '14px',
            textAlign: 'center',
            border: '2px dashed #adb5bd',
            borderRadius: '8px',
            padding: '20px'
          }}>
            📝 左侧栏位<br/>待加入后续内容
          </div>
        </div>
        
        {/* 右侧栏 - 评论区 */}
        <div style={{ flex: 1 }}>
          <h2>评论 ({comments.length})</h2>

             {/* 发表评论表单 */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
            {/* 评论者昵称 */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="昵称"
                value={newComment.commentator}
                onChange={(e) => setNewComment(prev => ({
                  ...prev,
                  commentator: e.target.value
                }))}
                required
                style={{ width: '100%', padding: '10px' }}
              />
            </div>
            {/* 评论者邮箱等信息 */}
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                placeholder="邮箱"
                value={newComment.email}
                onChange={(e) => setNewComment(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                style={{ width: '100%', padding: '10px' }}
              />
            </div>
            {/* 评论内容 */}
            <div style={{ marginBottom: '15px' }}>
              <textarea
                placeholder="评论内容"
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({
                  ...prev,
                  content: e.target.value
                }))}
                required
                style={{ width: '100%', padding: '10px' }}
              />
            </div>
            {/* 提交按钮 */}
            <div style={{ marginBottom: '15px' }}>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
                发表评论
              </button>
            </div>
          </form>

          {/* 评论列表 */}
          <div>
            {comments.map(comment => (
              <div
                key={comment.id}
                style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <strong>{comment.commentator}</strong>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </div>
                
                <p style={{ marginBottom: '10px' }}>{comment.content}</p>
                
                <small style={{ color: '#999' }}>
                  {new Date(comment.createTime).toLocaleString('zh-CN')}
                </small>
                
                {/* 回复列表 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ 
                    marginTop: '15px', 
                    paddingLeft: '20px',
                    borderLeft: '3px solid #007bff'
                  }}>
                    {comment.replies.map(reply => (
                      <div key={reply.id} style={{ 
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        marginBottom: '10px'
                      }}>
                        <strong>{reply.commentator}</strong>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentList