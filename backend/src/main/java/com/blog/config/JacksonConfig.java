package com.blog.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Jackson 配置类
 *
 * 作用：
 * 1. 配置全局日期格式
 * 2. 确保日期序列化/反序列化正确
 * 3. 解决 Java 8 日期时间类型序列化问题
 */
@Configuration
public class JacksonConfig {

    /**
     * 日期时间格式
     */
    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    /**
     * 日期格式
     */
    private static final String DATE_FORMAT = "yyyy-MM-dd";

    /**
     * 创建配置好的 ObjectMapper
     */
    @Bean
    @Primary  // 设置为主要实现，替换 Spring Boot 的默认 ObjectMapper
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();

        // 注册 Java 8 日期时间模块
        JavaTimeModule javaTimeModule = new JavaTimeModule();

        // 配置 LocalDateTime 序列化/反序列化
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DATE_TIME_FORMAT);
        javaTimeModule.addSerializer(LocalDateTime.class,
            new LocalDateTimeSerializer(dateTimeFormatter));
        javaTimeModule.addDeserializer(LocalDateTime.class,
            new LocalDateTimeDeserializer(dateTimeFormatter));

        // 配置 LocalDate 序列化/反序列化
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern(DATE_FORMAT);
        javaTimeModule.addSerializer(LocalDate.class,
            new LocalDateSerializer(dateFormatter));
        javaTimeModule.addDeserializer(LocalDate.class,
            new LocalDateDeserializer(dateFormatter));

        // 注册模块
        objectMapper.registerModule(javaTimeModule);

        // 配置序列化选项
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);  // 不使用时间戳
        objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);          // 空对象不报错

        return objectMapper;
    }
}
