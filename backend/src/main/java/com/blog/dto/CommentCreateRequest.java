package com.blog.dto;

import jakarta.validation.constraints.*;

/**
 * 创建评论请求 DTO
 * 
 * 为什么要用 DTO？
 * - 客户端只需要提交评论内容、评论者信息等
 * - 不需要提交 ID（数据库自动生成）
 * - 不需要提交创建时间、更新时间（服务器自动设置）
 * - 不能直接提交状态（需要审核流程）
 */
public class CommentCreateRequest {
    
    /**
     * 文章 ID
     * 评论必须关联一篇文章
     */
    @NotNull(message = "文章 ID 不能为空")
    private Long articleId;
    
    /**
     * 评论者名称
     * 不能为空，长度 1-50 字符
     */
    @NotBlank(message = "评论者名称不能为空")
    @Size(min = 1, max = 50, message = "评论者名称长度必须在 1-50 个字符之间")
    private String commentator;
    
    /**
     * 评论者邮箱（可选）
     */
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱不能超过 100 个字符")
    private String email;
    
    /**
     * 评论内容
     * 不能为空，长度 1-1000 字符
     */
    @NotBlank(message = "评论内容不能为空")
    @Size(min = 1, max = 1000, message = "评论内容长度必须在 1-1000 个字符之间")
    private String content;
    
    /**
     * 父评论 ID（可选）
     * 如果是回复评论，需要填写此项
     * 如果是顶级评论，为 null
     */
    private Long parentId;
    
    // getter 和 setter
    public Long getArticleId() { return articleId; }
    public void setArticleId(Long articleId) { this.articleId = articleId; }
    public String getCommentator() { return commentator; }
    public void setCommentator(String commentator) { this.commentator = commentator; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}