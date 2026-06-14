package com.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 跨域配置（CORS - Cross-Origin Resource Sharing）
 * 简单来说，跨域就是在前端和后端交互的时候，前端不能直接访问后端的资源，需要通过后端的接口来访问
 * 跨域的原因：
 * 1. 前端和后端的域名不同（协议、端口、主机名不同）
 * 2. 前端和后端的协议不同（HTTP、HTTPS）
 * 3. 前端和后端的端口不同（80、8080、8080等）、
 * 4. 前端和后端的主机名不同（localhost、127.0.0.1等）
 * 
 * 作用：
 * 1. 允许前端（http://localhost:3000）访问后端（http://localhost:8080）
 * 2. 配置允许的来源、方法、头部
 * 
 * 比喻：
 * - 就像餐厅的"外卖服务"许可
 * - 允许其他"平台"（不同来源）来"点餐"（调用 API）
 */
@Configuration
public class CorsConfig {
    
    /**
     * 创建 CORS 配置
     * 
     * @Bean 的作用：
     * - 将方法返回的对象注册为 Spring Bean
     * - 可以在其他地方通过 @Autowired 注入使用
     */
    @Bean
    public CorsFilter corsFilter() {
        // 创建 CORS 配置对象
        CorsConfiguration config = new CorsConfiguration();
        
        // ========== 基础配置 ==========
        
        // 是否允许发送 Cookie
        // true = 允许（需要 Access-Control-Allow-Credentials: true）
        // false = 不允许（更安全，减少 CSRF 攻击风险）
        config.setAllowCredentials(true);
        
        // 允许的来源（Origin）
        // "*" = 允许所有来源（生产环境不推荐）
        // "http://localhost:3000" = 只允许指定来源
        // 可以配置多个来源
        config.addAllowedOriginPattern("*");  // 允许所有来源
        
        // ========== HTTP 方法配置 ==========
        
        // 允许的 HTTP 方法
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");  // 预检请求
        
        // ========== 请求头配置 ==========
        
        // 允许的请求头
        config.addAllowedHeader("*");  // 允许所有请求头
        
        // 暴露的响应头（客户端可以访问的响应头）
        // 默认情况下，只有简单的响应头（Cache-Control, Content-Language 等）是可访问的
        // 如果前端需要访问其他响应头，需要在这里暴露
        config.addExposedHeader("Authorization");  // 暴露 Authorization 头（JWT Token）
        
        // ========== 缓存配置 ==========
        
        // 预检请求（OPTIONS）的缓存时间（秒）
        // 在这段时间内，浏览器不会再次发送预检请求
        // 3600 = 1 小时
        config.setMaxAge(3600L);
        
        // ========== 创建配置源并注册 ==========
        
        // 创建基于 URL 的配置源
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        
        // 对所有 API 路径应用 CORS 配置
        // "/**" = 匹配所有路径（包括 /api/**）
        source.registerCorsConfiguration("/**", config);
        
        // 创建并返回 CORS 过滤器
        return new CorsFilter(source);
    }
}
