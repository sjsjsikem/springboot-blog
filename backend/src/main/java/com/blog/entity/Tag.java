package com.blog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 标签实体类
 * 对应数据库中的 tag 表
 */
@Entity
@Table(name = "tag")
@Data
@NoArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 标签名称
    @NotBlank(message = "标签名称不能为空")
    @Size(min = 1, max = 50, message = "标签名称长度必须在 1-50 个字符之间")
    @Column(nullable = false, length = 50)
    private String name;

    // 标签别名（用于 URL）
    @Size(max = 50, message = "标签别名不能超过 50 个字符")
    @Column(length = 50)
    private String alias;

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
