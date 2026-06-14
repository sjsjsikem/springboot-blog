/**
 * Props 高级用法演示
 * 
 * 展示可以传递的各种数据类型
 */

function PropsDemo() {
  // 1. 传递字符串
  const name = "React 教程"
  
  // 2. 传递数字
  const version = 19
  
  // 3. 传递数组
  const tags = ['前端', 'React', 'JavaScript']
  
  // 4. 传递对象
  const config = {
    theme: 'dark',
    language: 'zh-CN',
    fontSize: 14
  }
  
  // 5. 传递函数
  function handleClick() {
    alert('按钮被点击了！')
  }
  
  // 6. 传递 JSX 元素（children）
  const customContent = <p>这是自定义内容</p>
  
  return (
    <div className="props-demo">
      <h2>Props 高级用法</h2>
      
      {/* 传递各种类型的 props */}
      <div className="demo-section">
        <h3>1. 字符串和数字</h3>
        <p>教程名称：{name}</p>
        <p>React 版本：{version}</p>
      </div>
      
      <div className="demo-section">
        <h3>2. 数组</h3>
        <p>标签：{tags.join(', ')}</p>
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>
      
      <div className="demo-section">
        <h3>3. 对象</h3>
        <p>主题：{config.theme}</p>
        <p>语言：{config.language}</p>
        <p>字体大小：{config.fontSize}px</p>
      </div>
      
      <div className="demo-section">
        <h3>4. 函数</h3>
        <button onClick={handleClick}>点击我</button>
      </div>
      
      <div className="demo-section">
        <h3>5. JSX 元素作为 children</h3>
        <div style={{ border: '1px solid blue', padding: '10px' }}>
          {customContent}
        </div>
      </div>
    </div>
  )
}

export default PropsDemo