/**
 * 关于我们组件
 * 
 * 对应路由：/about
 */

function About() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#007bff' }}>📖 关于我们</h1>
      <p>这是一个基于 React + Spring Boot 的博客系统。</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>技术栈：</h3>
        <ul>
          <li><strong>前端：</strong>React 19 + Vite 8</li>
          <li><strong>后端：</strong>Spring Boot 3.2 + Java 17</li>
          <li><strong>数据库：</strong>MySQL 8.0</li>
          <li><strong>路由：</strong>React Router v6</li>
        </ul>
      </div>
      
      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        borderLeft: '4px solid #007bff'
      }}>
        <h3>项目特色：</h3>
        <ul>
          <li>✅ 组件化开发</li>
          <li>✅ 前后端分离</li>
          <li>✅ RESTful API</li>
          <li>✅ JWT 认证</li>
        </ul>
      </div>
    </div>
  )
}

export default About