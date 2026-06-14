/**
 * 文章列表页组件
 * 
 * 展示文章列表，点击可查看详情
 */

import { useNavigate } from 'react-router-dom'

function Articles() {
  const navigate = useNavigate()
  
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>📚 文章列表</h1>
      
      {/* 文章列表 */}
      <div>
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => navigate(`/article/${article.id}`)}
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
            {/* 文章标题 */}
            <h2 style={{ 
              fontSize: '20px', 
              marginBottom: '10px',
              color: '#007bff'
            }}>
              {article.title}
            </h2>
            
            {/* 文章摘要 */}
            <p style={{ 
              color: '#666',
              lineHeight: '1.6',
              marginBottom: '15px'
            }}>
              {article.summary}
            </p>
            
            {/* 文章元信息 */}
            <div style={{ 
              color: '#999',
              fontSize: '14px'
            }}>
              <span>作者：{article.author}</span>
              <span style={{ marginLeft: '20px' }}>发布日期：{article.date}</span>
              <span style={{ marginLeft: '20px', color: '#007bff' }}>
                点击查看详情 →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Articles