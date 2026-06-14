/**
 * 博客文章组件
 * 
 * 演示组件嵌套：
 * - Header 组件（文章标题）
 * - Content 组件（文章内容）
 * - Footer 组件（文章元信息）
 */

// 导入 React
import React from 'react'

/**
 * Header 子组件
 */
function Header({ title }) {
  return <h2>{title}</h2>
}

/**
 * Content 子组件
 */
function Content({ children }) {
  return <div className="content">{children}</div>
}

/**
 * Footer 子组件
 */
function Footer({ author, date }) {
  return (
    <div className="footer">
      <p>作者：{author}</p>
      <p>发布日期：{date}</p>
    </div>
  )
}

/**
 * BlogPost 主组件
 */
function BlogPost() {
  return (
    <article className="blog-post">
      <Header title="我的第一篇博客" />
      <Content>
        <p>这是文章的第一段内容...</p>
        <p>这是文章的第二段内容...</p>
      </Content>
      <Footer author="张三" date="2026-05-22" />
    </article>
  )
}

export default BlogPost