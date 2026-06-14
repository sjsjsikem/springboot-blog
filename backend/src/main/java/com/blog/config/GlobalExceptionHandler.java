package com.blog.config;

import com.blog.common.Result;
import com.blog.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;



@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * 处理资源未找到异常
     * 可以从这两个异常处理流程中看出Reource型异常类和全局异常处理的区别。Resource类异常
     * 在controller一般是先导入类，然后再跟随log或者error码一起抛出，针对特定问题
     * 而全局异常则是在这个异常控制器中全局抛出，然后返回异常响应。全局异常处理中可能也会包含异常类
     * 来呈现异常信息
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Result<Void>> handleResourceNotFound(
            ResourceNotFoundException e) {
        
        log.warn("资源未找到：{}", e.getMessage());
        
        Result<Void> result = Result.error(404, e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }
    
    /**
     * 处理参数错误异常（手动抛出的 IllegalArgumentException）
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Result<Void>> handleIllegalArgument(
            IllegalArgumentException e) {
        
        log.warn("参数错误：{}", e.getMessage());
        
        Result<Void> result = Result.error(400, e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    
    /**
     * 处理 Bean Validation 验证失败（@Valid 注解触发）
     * 
     * 当 Controller 参数使用@Valid 注解时，验证失败会抛出此异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Result<Void>> handleValidationException(
            MethodArgumentNotValidException e) {
        
        // 获取第一个验证错误消息
        String errorMessage = e.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(error -> error.getDefaultMessage())
            .orElse("参数验证失败");
        
        log.warn("参数验证失败：{}", errorMessage);
        
        Result<Void> result = Result.error(400, errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    
    /**
     * 处理绑定异常（表单提交验证失败）
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<Result<Void>> handleBindException(
            BindException e) {
        
        String errorMessage = e.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(error -> error.getDefaultMessage())
            .orElse("参数绑定失败");
        
        log.warn("参数绑定失败：{}", errorMessage);
        
        Result<Void> result = Result.error(400, errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    
    /**
     * 处理运行时异常（如登录错误、用户名已存在等）
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Result<Void>> handleRuntimeException(RuntimeException e) {
        log.warn("业务错误：{}", e.getMessage());
        
        Result<Void> result = Result.error(400, e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    
    /**
     * 处理其他所有异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result<Void>> handleException(Exception e) {
        
        // 记录错误日志（ERROR 级别）
        log.error("服务器内部错误：{}", e.getMessage(), e);
        
        Result<Void> result = Result.error(500, "服务器内部错误，请稍后重试");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}
