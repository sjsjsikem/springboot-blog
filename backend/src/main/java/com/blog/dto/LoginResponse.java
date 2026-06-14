package com.blog.dto;

/**
 * 登录响应 DTO
 * 只返回客户端需要的信息
 */
public class LoginResponse {
    
    // 无参构造器（Spring 需要）
    public LoginResponse() {
    }
    
    private String token;
    private Long userId;
    private String username;
    private String nickname;
    
    //参数构造设置用户登录完成之后返回给客户端的信息
    public LoginResponse(String token, Long userId, String username, String nickname) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.nickname = nickname;
    }
    
    // getter 和 setter
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}
