package com.blog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 配置类：用于读取 application.yml 中的配置信息
 * 
 * 工作原理：
 * 1. @Component：把这个类交给 Spring 管理（成为 Bean）
 * 2. @ConfigurationProperties(prefix = "app")：
 *    - 自动读取配置文件中以 "app:" 开头的所有配置
 *    - 自动匹配到类的属性上（name → app.name, version → app.version）
 * 
 * 好处：
 * - 不需要手动写 @Value 读取每个配置
 * - 配置集中管理，方便使用
 * - 类型安全，有代码提示
 */
@Component
@ConfigurationProperties(prefix = "app")  // 绑定配置文件中 app: 开头的配置
public class AppProperties {
    
    /**
     * 应用名称
     * 对应配置文件：app.name
     */
    private String name;
    
    /**
     * 应用版本
     * 对应配置文件：app.version
     */
    private String version;
    
    // ========== getter 和 setter 方法 ==========
    // 为什么需要 getter/setter？
    // 因为 Spring 通过 setter 注入配置值，通过 getter 读取配置值
    
    /**
     * 获取应用名称
     * @return 应用名称
     */
    public String getName() {
        return name;
    }
    
    /**
     * 设置应用名称（Spring 自动调用，注入配置值）
     * @param name 应用名称
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /**
     * 获取应用版本
     * @return 应用版本
     */
    public String getVersion() {
        return version;
    }
    
    /**
     * 设置应用版本（Spring 自动调用，注入配置值）
     * @param version 应用版本
     */
    public void setVersion(String version) {
        this.version = version;
    }
}