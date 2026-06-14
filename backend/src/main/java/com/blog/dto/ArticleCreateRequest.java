package com.blog.dto;

import jakarta.validation.constraints.*;

/**
 * 创建文章请求 DTO---DTO到了服务层就可以看出一般是导入的请求体数据。所以会有注释@RequestBody
 * 
 * 为什么要用 DTO？
 * - 客户端只需要提交标题、内容、作者、分类 ID
 * - 不需要提交 ID（数据库自动生成）
 * - 不需要提交创建时间、更新时间（服务器自动设置）
 * - 不能提交浏览量、点赞数（服务器控制）
 */
public class ArticleCreateRequest {
    
    /**
     * 标题
     * 不能为空，长度 1-200 字符
     */
    @NotBlank(message = "标题不能为空")
    @Size(min = 1, max = 200, message = "标题长度必须在 1-200 个字符之间")
    private String title;
    
    /**
     * 内容
     * 不能为空
     */
    @NotBlank(message = "内容不能为空")
    @Size(min = 1, message = "内容不能为空")
    private String content;
    
    /**
     * 作者
     * 不能为空
     */
    @NotBlank(message = "作者不能为空")
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
