package com.blog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 评论实体类
 * 对应数据库中的 comment 表
 */
@Entity
@Table(name = "comment")
@Data
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 文章 ID
    @Column(name = "article_id", nullable = false)
    private Long articleId;

    // 评论者名称
    @NotBlank(message = "评论者名称不能为空")
    @Size(min = 1, max = 50, message = "评论者名称长度必须在 1-50 个字符之间")
    @Column(nullable = false, length = 50)
    private String commentator;

    // 评论者邮箱
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱不能超过 100 个字符")
    @Column(length = 100)
    private String email;

    // 评论内容
    @NotBlank(message = "评论内容不能为空")
    @Size(min = 1, max = 1000, message = "评论内容长度必须在 1-1000 个字符之间")
    @Column(nullable = false, length = 1000)
    private String content;

    // 父评论 ID（用于回复功能）
    @Column(name = "parent_id")
    private Long parentId;

    // 根评论 ID（用于关联同一对话的所有评论）
    @Column(name = "root_id")
    private Long rootId;

    // 评论状态：0-待审核，1-通过，2-拒绝
    @Column(nullable = false)
    private Integer status = 1;

    // 评论者 IP
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    // 创建时间
    @Column(name = "create_time")
    private LocalDateTime createTime;

    // 更新时间
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @PrePersist
    public void prePersist() {
        this.createTime = LocalDateTime.now();
        this.updateTime = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updateTime = LocalDateTime.now();
    }
}
