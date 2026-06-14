package com.blog.config;

import com.blog.interceptor.RequestLogInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC 配置
 * 
 * 作用：
 * 1. 配置拦截器
 * 2. 配置跨域（如果不用 CorsConfig 类，也可以在这里配置）
 * 3. 配置路径映射
 * 
 * @WebMvcConfigurer 的作用：
 * - 提供自定义 Spring MVC 配置的方法
 * - 可以覆盖默认配置
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {
    
    // 注入拦截器
    private final RequestLogInterceptor requestLogInterceptor;
    
    /**
     * 配置拦截器
     * 
     * @param registry 拦截器注册表
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册请求日志拦截器
        registry.addInterceptor(requestLogInterceptor)
            // 拦截所有路径
            .addPathPatterns("/**")
            // 排除不需要记录的路径（如静态资源）
            .excludePathPatterns(
                "/css/**",      // CSS 文件
                "/js/**",       // JavaScript 文件
                "/images/**",   // 图片文件
                "/favicon.ico"  // 网站图标
            );
    }
    
    /**
     * 配置跨域（CORS）
     * 
     * 方式 1：使用 CorsConfig 类（推荐，更灵活）
     * 方式 2：在这里配置（简单场景）
     * 
     * @param registry 跨域注册表
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 匹配所有路径
            .allowedOriginPatterns("*")  // 允许所有来源
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 允许的方法
            .allowedHeaders("*")  // 允许的头
            .exposedHeaders("Authorization")  // 暴露的头
            .allowCredentials(true)  // 允许凭证
            .maxAge(3600);  // 缓存时间
    }
}
