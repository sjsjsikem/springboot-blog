package com.blog.dto;

import jakarta.validation.constraints.*;

/**
 * 注册请求 DTO
 * 只包含客户端需要提交的字段
 */
public class RegisterRequest {
    
    // 无参构造器（Spring 需要）
    public RegisterRequest() {
    }
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在 3-50 个字符之间")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 100, message = "密码长度必须在 6-100 个字符之间")
    private String password;
    
    @Size(max = 100, message = "昵称不能超过 100 个字符")
    private String nickname;
    
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱不能超过 100 个字符")
    private String email;
    
    @Size(max = 255, message = "头像地址不能超过 255 个字符")
    private String avatar;
    
    // getter 和 setter
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
}
