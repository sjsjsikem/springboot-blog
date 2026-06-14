package com.blog.controller;

import com.blog.config.AppProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * REST 控制器：处理 HTTP 请求
 * 
 * @RestController = @Controller + @ResponseBody
 * - 标记这是一个控制器类
 * - 所有方法的返回值直接作为 HTTP 响应体（JSON 格式）
 */
@RestController
public class HelloController {
    
    /**
     * 注入配置类 AppProperties
     * 
     * @Autowired 注解的作用：
     * - 告诉 Spring："请自动帮我创建这个对象，并注入到这里"
     * - Spring 会查找容器中类型为 AppProperties 的 Bean
     * - 然后调用 setter 方法或直接设置字段（这里是直接设置字段）
     * 
     * 为什么可以注入？
     * - 因为 AppProperties 类上有 @Component 注解
     * - Spring 启动时会扫描并创建所有带 @Component 的类
     */
    @Autowired
    private AppProperties appProperties;  // Spring 自动注入配置对象
    
    /**
     * 使用 @Value 读取单个配置值
     * 
     * @Value("${server.port}") 的作用：
     * - 读取 application.yml 中的 server.port 配置
     * - 自动转换为 Integer 类型并赋值给 serverPort 字段
     * 
     * 对比：
     * - @Value：适合读取单个配置值
     * - @ConfigurationProperties：适合读取一组相关的配置
     */
    @Value("${server.port}")  // 从配置文件读取端口号
    private Integer serverPort;
    
    /**
     * 首页接口
     * 
     * @GetMapping("/") 的作用：
     * - 映射 HTTP GET 请求到根路径 /
     * - 当访问 http://localhost:8080/ 时，调用这个方法
     * 
     * @return 返回字符串，自动作为 HTTP 响应体
     */
    @GetMapping("/")  // 处理根路径请求
    public String index() {
        // 使用注入的配置对象读取配置值
        return "欢迎访问" + appProperties.getName() +      // 从配置类获取应用名称
               " v" + appProperties.getVersion() +        // 从配置类获取版本号
               "！端口：" + serverPort;                   // 使用 @Value 读取的端口号
    }
    
    /**
     * Hello 接口
     * 
     * @GetMapping("/hello") 的作用：
     * - 映射 HTTP GET 请求到 /hello 路径
     * - 当访问 http://localhost:8080/hello 时，调用这个方法
     * 
     * @return 简单的问候语
     */
    @GetMapping("/hello")  // 处理 /hello 路径请求
    public String hello() {
        return "Hello, Spring Boot!";
    }
    
    /**
     * 应用信息接口
     * 
     * @GetMapping("/info") 的作用：
     * - 映射 HTTP GET 请求到 /info 路径
     * - 返回一个 Map，自动转换为 JSON 格式
     * 
     * @return Map 对象，Spring 自动序列化为 JSON
     * 
     * 返回的 JSON 示例：
     * {
     *   "应用名称": "博客系统",
     *   "版本": "1.0.0",
     *   "端口": 8080,
     *   "Java 版本": "21.0.2"
     * }
     */
    @GetMapping("/info")  // 处理 /info 路径请求
    public Map<String, Object> info() {
        // 创建 Map 用于存储信息
        Map<String, Object> info = new HashMap<>();
        
        // 从配置类中获取应用名称
        info.put("应用名称", appProperties.getName());
        
        // 从配置类中获取应用版本
        info.put("版本", appProperties.getVersion());
        
        // 使用 @Value 读取的端口号
        info.put("端口", serverPort);
        
        // 获取 Java 版本（系统属性）
        info.put("Java 版本", System.getProperty("java.version"));
        
        // 返回 Map，Spring 自动转为 JSON 格式
        return info;
    }
}