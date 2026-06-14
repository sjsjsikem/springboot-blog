package com.blog.common;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 统一响应结果封装---次common文件夹和result类封装的是一个统一响应类，用于问题的响应
 * ---common中的result封装的是之后发生异常时给出的响应的统一格式，相当于一个响应类
 * 
 * 作用：
 * 1. 统一所有接口的响应格式
 * 2. 包含状态码、消息、数据、时间戳
 * 3. 前端可以统一处理响应
 * 
 * 泛型<T>：data 字段的类型可以是任意类型
 * 
 * 示例：
 * - 查询列表：Result<List<Article>>
 * - 查询单个：Result<Article>
 * - 创建成功：Result<Article>
 * - 删除成功：Result<Void>
 */
@Data
public class Result<T> {
    
    /**
     * 状态码
     * - 200：成功
     * - 400：参数错误
     * - 404：资源未找到
     * - 500：服务器内部错误
     */
    private Integer code;
    
    /**
     * 响应消息
     * - 成功："success"
     * - 失败：具体的错误信息
     */
    private String message;
    
    /**
     * 响应数据（泛型）--泛型顾名思义代表一个任意的数据类型，之后可以转换成任意类型的数据
     * - 可以是任意类型：Article、List<Article>、Void 等---泛型<T>：data 字段的类型可以是任意类型，根据实际情况指定
     */
    private T data;
    
    /**
     * 响应时间戳
     */
    private LocalDateTime timestamp;
    
    /**
     * 构造器
     */
    public Result() {
        this.timestamp = LocalDateTime.now();
    }
    
    /**
     * 构造器（带参数）
     */
    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }
    
    // ========== 静态工厂方法（简化创建） ==========
    
    /**
     * 成功响应（带数据）
     * 
     * @param data 数据
     * @param <T> 数据类型
     * @return Result<T>
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }
    
    /**
     * 成功响应（带消息和数据）
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }

    /**
     * 成功响应（只有消息，没有数据）
     */
    public static <T> Result<T> success(String message) {
        return new Result<>(200, message, null);
    }
    
    /**
     * 失败响应
     * 
     * @param code 状态码
     * @param message 错误消息
     * @param <T> 数据类型（通常为 null）
     * @return Result<T>
     */
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
    
    /**
     * 失败响应（默认 500）
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null);
    }

     // ========== 便捷方法 ==========
    
    /**
     * 判断是否成功
     */
    public boolean isSuccess() {
        return this.code != null && this.code == 200;
    }
    
    /**
     * 判断是否失败
     */
    public boolean isError() {
        return !isSuccess();
    }
    
    // ========== 链式调用支持（可选） ==========
    
    /**
     * 设置数据
     */
    public Result<T> data(T data) {
        this.data = data;
        return this;
    }
    
    /**
     * 设置消息
     */
    public Result<T> message(String message) {
        this.message = message;
        return this;
    }
}
