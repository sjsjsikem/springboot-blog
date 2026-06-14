package com.blog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文章标签关联实体类---即文章本身要加一个主标签（之前的category是一个分类器，之后可能会把文章按照分类标签
 * 分到对应类别中），
 * 然后标签和文章和文章之间的关联又需要一个中间表articletag来标识
 * 对应数据库中的 article_tag 表
 */
/**
 * 文章标签关联实体类
 * 对应数据库中的 article_tag 表
 */
@Entity
@Table(name = "article_tag", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"article_id", "tag_id"}))
@Data
@NoArgsConstructor
public class ArticleTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 文章 ID（添加外键约束）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", foreignKey = @ForeignKey(name = "fk_article_tag_article"))
    private Article article;

    // 标签 ID（添加外键约束）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", foreignKey = @ForeignKey(name = "fk_article_tag_tag"))
    private Tag tag;

    // 创建时间
    @Column(name = "create_time")
    private LocalDateTime createTime;

    // 构造方法
    public ArticleTag(Long articleId, Long tagId) {
        this.article = new Article();
        this.article.setId(articleId);
        this.tag = new Tag();
        this.tag.setId(tagId);
    }

    @PrePersist
    public void prePersist() {
        this.createTime = LocalDateTime.now();
    }
}
