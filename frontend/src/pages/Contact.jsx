/**
 * 联系我们组件
 * 
 * 对应路由：/contact
 */

function Contact() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#dc3545' }}>📧 联系我们</h1>
      <p>如果您有任何问题或建议，欢迎联系我们！</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>联系方式：</h3>
        <ul>
          <li>📧 邮箱：contact@example.com</li>
          <li>📱 电话：400-123-4567</li>
          <li>🏢 地址：北京市朝阳区科技园区</li>
        </ul>
      </div>
      
      <form style={{ 
        marginTop: '30px',
        maxWidth: '500px',
        padding: '20px',
        backgroundColor: '#fff5f5',
        borderRadius: '8px'
      }}>
        <h3>在线留言：</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>姓名：</label>
          <input 
            type="text" 
            placeholder="请输入您的姓名"
            style={{ 
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>邮箱：</label>
          <input 
            type="email" 
            placeholder="请输入您的邮箱"
            style={{ 
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>留言：</label>
          <textarea 
            placeholder="请输入您的留言"
            rows="4"
            style={{ 
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          提交留言
        </button>
      </form>
    </div>
  )
}

export default Contact