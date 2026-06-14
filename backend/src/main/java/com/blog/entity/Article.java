package com.blog.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
/**
 * 文章实体类
 * 对应数据库中的 article 表
 */
//这个文章实体类的主要操作是对应文章及文章本身信息的增删查改操作（数据库操作） 
//5190954-目前的操作是让该实体变成数据库真正的实体实现持久化操作 
@Entity
@Table(name = "article")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Article {
    
    // 文章 ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 标题 - 先检查@NotBlank，再检查@Size
    @NotBlank(message = "标题不能为空")
    @Size(min = 1, max = 200, message = "标题长度必须在 1-200 个字符之间")
    @Column(nullable = false, length = 200)
    private String title;
    
    // 内容
    @NotBlank(message = "内容不能为空")
    @Size(min = 1, message = "内容不能为空")
    @Column(nullable = false,columnDefinition = "TEXT")
    private String content;

    //作者
    @NotBlank(message = "作者不能为空")
    @Size(max = 50, message = "作者名不能超过 50 个字符")
    private String author;

    // 分类 ID（关联分类表）
    @Column(name = "category_id")
    private Long categoryId;

    // 文章状态：0-草稿，1-已发布
    @Column(nullable = false)
    private Integer status = 1;

    // 浏览量
    @Column(name = "view_count")
    private Long viewCount = 0L;

    // 点赞数
    @Column(name = "like_count")
    private Long likeCount = 0L;
    
    // 摘要
    //private String summary;
    
    // // 作者 ID
    //private Long authorId;
    
    // 创建时间
    @Column(name = "create_time")
    private LocalDateTime createTime;
    
    // 更新时间
    @Column(name = "update_time")
    private LocalDateTime updateTime;
    
    // ========== 构造器（无参构造，因为是自动构建的实体） ==========
    
    public Article() {
    }
    
    //有参构造器，之前模拟的时候使用
    // public Article(Long id, String title, String content) {
    //     this.id = id;
    //     this.title = title;
    //     this.content = content;
    //     this.createTime = LocalDateTime.now();
    //     this.updateTime = LocalDateTime.now();
    // }
    
    // ========== getter 和 setter ==========
    
    //获取id信息
    public Long getId() {
        return id;
    }
    //更改id信息
    public void setId(Long id) {
        this.id = id;
    }
    //获取标题信息
    public String getTitle() {
        return title;
    }
    //更改标题信息
    public void setTitle(String title) {
        this.title = title;
    }
    //获取内容信息
    public String getContent() {
        return content;
    }
    //更改内容信息
    public void setContent(String content) {
        this.content = content;
    }
    //获取作者信息
     public String getAuthor() {
        return author;
    }
    //更改作者信息
    public void setAuthor(String author) {
        this.author = author;
    }
    
    //获取创建时间信息
    public LocalDateTime getCreateTime() {
        return createTime;
    }
    //更改创建时间信息
    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }
    //获取更新时间信息
    public LocalDateTime getUpdateTime() {
        return updateTime;
    }
    //更改更新时间信息
    //更改更新时间信息
    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    // 获取分类 ID
    public Long getCategoryId() {
        return categoryId;
    }

    // 设置分类 ID
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    // 获取文章状态
    public Integer getStatus() {
        return status;
    }

    // 设置文章状态
    public void setStatus(Integer status) {
        this.status = status;
    }

    // 获取浏览量
    public Long getViewCount() {
        return viewCount;
    }

    // 设置浏览量
    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }

    // 获取点赞数
    public Long getLikeCount() {
        return likeCount;
    }

    // 设置点赞数
    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

    // ========== JPA 生命周期回调 ==========
    
    /**
     * 持久化之前自动调用（保存前）
     * 自动设置创建时间和更新时间
     */
    @PrePersist
    public void prePersist() {
        this.createTime = LocalDateTime.now();
        this.updateTime = LocalDateTime.now();
    }
    
    /**
     * 更新之前自动调用
     * 自动更新更新时间
     */
    @PreUpdate
    public void preUpdate() {
        this.updateTime = LocalDateTime.now();
    }

    // ========== toString 方法（override指的是重写父类（超类）的toString方法） ==========
    
    @Override
    public String toString() {
        return "Article{" +
               "id=" + id +
               ", title='" + title + '\'' +
               ", content='" + content + '\'' +
               ", author='" + author + '\'' +
               ", createTime=" + createTime +
               ", updateTime=" + updateTime +
               '}';
    }
}
