package com.blog.dto;

import jakarta.validation.constraints.*;

/**
 * 更新文章请求 DTO
 * 
 * 和创建请求类似，但所有字段都是可选的
 * 因为更新时可以只更新部分字段
 */
public class ArticleUpdateRequest {
    
    /**
     * 标题（可选）
     */
    @Size(min = 1, max = 200, message = "标题长度必须在 1-200 个字符之间")
    private String title;
    
    /**
     * 内容（可选）
     */
    @Size(min = 1, message = "内容不能为空")
    private String content;
    
    /**
     * 作者（可选）
     */
    @Size(max = 50, message = "作者名不能超过 50 个字符")
    private String author;
    
    /**
     * 分类 ID（可选）
     */
    private Long categoryId;
    
    // getter 和 setter
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
