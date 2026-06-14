/**
 * JavaScript 表达式演示组件
 * 
 * 展示如何在 JSX 中使用 JavaScript 表达式
 */

function JSDemo() {
  // 变量
  const name = '张三'
  const age = 25
  
  // 计算
  const doubleAge = age * 2
  
  // 函数
  function getGreeting() {
    return '你好，' + name + '！'
  }
  
  // 数组
  const hobbies = ['编程', '阅读', '音乐']
  
  return (
    <div className="js-demo">
      {/* 1. 直接显示变量 */}
      <h1>{name}</h1>
      <p>年龄：{age}</p>
      
      {/* 2. 使用表达式 */}
      <p>双倍年龄：{doubleAge}</p>
      <p>明年年龄：{age + 1}</p>
      
      {/* 3. 调用函数 */}
      <p>{getGreeting()}</p>
      
      {/* 4. 三元表达式 */}
      <p>状态：{age >= 18 ? '成年' : '未成年'}</p>
      
      {/* 5. 数组方法 */}
      <div>
        <h3>爱好列表：</h3>
        <ul>
          {hobbies.map((hobby, index) => (
            <li key={index}>{hobby}</li>
          ))}
        </ul>
      </div>
      
      {/* 6. 条件渲染 */}
      {hobbies.length > 0 && (
        <p>共有 {hobbies.length} 个爱好</p>
      )}
    </div>
  )
}

export default JSDemo