package com.blog.dto;

import jakarta.validation.constraints.*;

/**
 * 更新评论请求 DTO
 * 
 * 用于更新评论内容（只能修改自己的评论）
 */
public class CommentUpdateRequest {
    
    /**
     * 评论内容（可选）
     * 如果提供，必须满足长度要求
     */
    @Size(min = 1, max = 1000, message = "评论内容长度必须在 1-1000 个字符之间")
    private String content;
    
    /**
     * 评论者邮箱（可选）
     */
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱不能超过 100 个字符")
    private String email;
    
    // getter 和 setter
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
