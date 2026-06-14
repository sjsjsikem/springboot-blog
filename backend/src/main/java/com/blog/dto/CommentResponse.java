package com.blog.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 评论响应 DTO
 * 
 * 用于返回评论数据给客户端
 * 包含评论的所有信息，以及回复列表
 */
public class CommentResponse {
    
    private Long id;
    private Long articleId;
    private String commentator;
    private String email;
    private String content;
    private Long parentId;
    private Long rootId;
    private Integer status;
    private String ipAddress;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    /**
     * 回复列表
     * 如果这个评论有回复，会在这里显示
     */
    private List<CommentResponse> replies;
    
    // getter 和 setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Long getRootId() { return rootId; }
    public void setRootId(Long rootId) { this.rootId = rootId; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
    public List<CommentResponse> getReplies() { return replies; }
    public void setReplies(List<CommentResponse> replies) { this.replies = replies; }
}