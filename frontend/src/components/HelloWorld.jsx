/**
 * HelloWorld 组件
 * 
 * 这是我们的第一个 React 组件
 * 作用：在页面上显示"Hello, World!"
 * 
 * 组件命名规范：
 * - 文件名使用大驼峰命名（PascalCase）
 * - 组件名与文件名一致
 * - .jsx 后缀表示这是 React 组件文件
 */

// 导入 React（必须，因为 JSX 会被编译成 React.createElement）
import React from 'react'

/**
 * HelloWorld 函数组件
 * 
 * 组件本质上就是一个函数
 * 返回值：JSX（会被 React 渲染成 HTML）
 */
function HelloWorld() {
  // 组件内部可以写 JavaScript 代码
  const greeting = 'Hello, World!'
  const author = '来自 React 的问候'
  
  // 返回 JSX（看起来像 HTML，但实际是 JavaScript）
  return (
    <div className="hello-world">
      <h1>{greeting}</h1>
      <p>{author}</p>
      <p>欢迎来到 React 的世界！🚀</p>
    </div>
  )
}

// 导出组件（让其他文件可以使用）
export default HelloWorld
