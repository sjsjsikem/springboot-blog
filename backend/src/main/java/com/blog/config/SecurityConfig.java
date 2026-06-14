package com.blog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.blog.filter.JwtAuthenticationFilter;

/**
 * Spring Security 配置类--所以可以看出，配置类的文件夹config主要是调用系统中的各项util或者
 * 给系统设置一些安全，跨域之类的安全，异常和基本配置
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    /**
     * 配置密码编码器 Bean
     * 
     * BCrypt 是一种强哈希算法，特点：
     * 1. 自动加盐（salt），防止彩虹表攻击
     * 2. 可调节计算成本（strength）
     * 3. 单向加密，不可逆
     * 
     * @return PasswordEncoder 实例
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * 配置 Security 过滤器链--配置security在每次更新完各种功能的服务和控制器
     * 之后记得要在这里给这些类的api请求鉴权放行。要不然会卡403
     * 
     * @param http HttpSecurity 对象
     * @return SecurityFilterChain 配置
     * @throws Exception 配置异常
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
            // 禁用 CSRF（因为我们是前后端分离，使用 JWT 认证）
            .csrf(AbstractHttpConfigurer::disable)
            // 禁用 Session（使用无状态的 JWT）
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 配置请求授权
            .authorizeHttpRequests(auth -> auth
                // 允许匿名访问认证相关接口
                .requestMatchers("/api/auth/**").permitAll()
                // 允许匿名访问文章相关接口（开发环境临时配置）
                .requestMatchers("/api/articles/**").permitAll()
                // 其他所有请求需要认证
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/tags/**").permitAll()
                .requestMatchers("/api/comments/**").permitAll()
                .anyRequest().authenticated()
            )
            // 添加 JWT 过滤器到 Spring Security 过滤器链中
            // 在 UsernamePasswordAuthenticationFilter 之前执行
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    /**
     * JWT 过滤器 Bean
     * 
     * 作用：将 JwtAuthenticationFilter 注册为 Spring Bean
     * 这样 Spring Security 就可以自动注入并使用它
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
}
