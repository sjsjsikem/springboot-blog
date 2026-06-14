package com.blog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户实体类
 * 对应数据库中的 user 表--注意每一个实体中用lombok构造的NoArgsConstructor，它
 * 的功能非常强大，其在编译时已经基本上帮实体构造好了无参构造器，之后不管在DTO还是在service里
 * 都可以自动调用这些实体中每一个数据的get和set方法。所以现在在实体中要导入lombok套件
 */
@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 用户名（唯一）
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在 3-50 个字符之间")
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    // 密码
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 100, message = "密码长度必须在 6-100 个字符之间")
    @Column(nullable = false, length = 100)
    private String password;

    // 昵称
    @Size(max = 100, message = "昵称不能超过 100 个字符")
    @Column(length = 100)
    private String nickname;

    // 邮箱
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱不能超过 100 个字符")
    @Column(length = 100)
    private String email;

    // 头像 URL
    @Column(length = 500)
    private String avatar;

    // 用户状态：0-禁用，1-正常
    @Column(nullable = false)
    private Integer status = 1;

    // 创建时间
    @Column(name = "create_time")
    private LocalDateTime createTime;

    // 更新时间
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    // 保存前自动设置时间
    @PrePersist
    public void prePersist() {
        this.createTime = LocalDateTime.now();
        this.updateTime = LocalDateTime.now();
    }

    // 更新前自动设置时间
    @PreUpdate
    public void preUpdate() {
        this.updateTime = LocalDateTime.now();
    }
}
