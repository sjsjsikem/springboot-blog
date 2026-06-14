package com.blog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "article_category", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"article_id", "category_id"}))
@Data
@NoArgsConstructor
public class ArticleCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 文章 ID（添加外键约束）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", foreignKey = @ForeignKey(name = "fk_article_tag_article"))
    private Article article;

    // 标签 ID（添加外键约束）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", foreignKey = @ForeignKey(name = "fk_article_tag_tag"))
    private Category category;

    // 创建时间
    @Column(name = "create_time")
    private LocalDateTime createTime;

    // 构造方法
    public ArticleCategory(Long articleId, Long categoryId) {
        this.article = new Article();
        this.article.setId(articleId);
        this.category = new Category();
        this.category.setId(categoryId);
    }

    @PrePersist
    public void prePersist() {
        this.createTime = LocalDateTime.now();
    }
}
