package com.blog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 分类实体类
 * 对应数据库中的 category 表
 */
@Entity
@Table(name = "category")
@Data
@NoArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 分类名称
    @NotBlank(message = "分类名称不能为空")
    @Size(min = 1, max = 50, message = "分类名称长度必须在 1-50 个字符之间")
    @Column(nullable = false, length = 50)
    private String name;

    // 分类别名（用于 URL）
    @Size(max = 50, message = "分类别名不能超过 50 个字符")
    @Column(length = 50)
    private String alias;

    // 分类描述
    @Size(max = 500, message = "分类描述不能超过 500 个字符")
    @Column(length = 500)
    private String description;

    // 排序序号
    @Column(name = "sort_order")
    private Integer sortOrder = 0;

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
