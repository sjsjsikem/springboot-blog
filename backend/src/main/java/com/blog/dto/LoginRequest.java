package com.blog.dto;

import jakarta.validation.constraints.*;

/**
 * 登录请求 DTO
 */
public class LoginRequest {
    
    // 无参构造器（Spring 需要）
    public LoginRequest() {
    }
    
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    private String password;
    
    // getter 和 setter
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
