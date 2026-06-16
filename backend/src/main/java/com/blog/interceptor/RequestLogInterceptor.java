package com.blog.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * 请求日志拦截器---从目前的名字和webmvcconfig文件对于拦截器的注入来看
 * ---拦截器的作用应该是配合网关拦截住一些数据并记录信息用的。而这个拦截器的作用是记录请求的详细信息，
 * 方便调试和问题排查
 * 的作用应该是拦截所有请求，记录请求的详细信息，包括请求方法、
 * 请求地址、查询参数、客户端 IP、处理类、处理方法等
 * 
 * 作用：
 * 1. 记录所有 HTTP 请求的详细信息
 * 2. 方便调试和问题排查
 * 
 * 执行顺序：
 * 1. preHandle - 请求处理之前（记录请求开始）
 * 2. postHandle - 请求处理之后，视图渲染之前（记录响应）
 * 3. afterCompletion - 完全处理完毕（记录完成）
 */
@Slf4j  // Lombok 注解，自动生成 logger
@Component
public class RequestLogInterceptor implements HandlerInterceptor {
    
    // 使用 ThreadLocal 存储请求开始时间，支持异步请求
    private static final ThreadLocal<Long> START_TIME = new ThreadLocal<>();
    
    /**
     * 在请求处理之前执行
     * 
     * @param request HTTP 请求
     * @param response HTTP 响应
     * @param handler 处理器（Controller 方法）
     * @return true = 继续处理，false = 停止处理
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 记录请求开始时间
        long startTime = System.currentTimeMillis();
        START_TIME.set(startTime);
        
        // 获取请求信息
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String ip = getClientIp(request);
        
        // 记录请求开始日志
        log.info("========== 请求开始 ==========");
        log.info("请求方法：{}", method);
        log.info("请求地址：{}", uri);
        if (queryString != null && !queryString.isEmpty()) {
            log.info("查询参数：{}", queryString);
        }
        log.info("客户端 IP：{}", ip);
        log.info("处理类：{}", handler.getClass().getSimpleName());
        
        // 返回 true，继续处理请求
        return true;
    }
    
    /**
     * 在请求处理之后、视图渲染之前执行
     * 
     * @param request HTTP 请求
     * @param response HTTP 响应
     * @param handler 处理器
     * @param modelAndView 视图模型（如果有的话）
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, 
                          Object handler, ModelAndView modelAndView) {
        // 获取响应状态码
        int status = response.getStatus();
        
        // 计算处理时间
        Long startTime = START_TIME.get();
        long duration = startTime != null ? System.currentTimeMillis() - startTime : 0;
        
        // 记录响应日志
        log.info("响应状态：{}", status);
        log.info("处理耗时：{} ms", duration);
        log.info("========== 请求结束 ==========");
    }
    
    /**
     * 在请求完全处理完毕之后执行
     * 
     * 无论是否成功都会执行
     * 用于清理资源
     * 
     * @param request HTTP 请求
     * @param response HTTP 响应
     * @param handler 处理器
     * @param ex 异常（如果有的话）
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                               Object handler, Exception ex) {
        // 如果有异常，记录错误日志
        if (ex != null) {
            log.error("请求处理异常：{}", ex.getMessage(), ex);
        }
        
        // 清理 ThreadLocal，防止内存泄漏
        START_TIME.remove();
    }
    
    /**
     * 获取客户端真实 IP
     * 
     * 原因：
     * - 如果有反向代理，需要从 X-Forwarded-For 头获取真实 IP
     * - 否则直接获取远程地址
     * 
     * @param request HTTP 请求
     * @return 客户端 IP
     */
    private String getClientIp(HttpServletRequest request) {
        // 优先从 X-Forwarded-For 获取（反向代理场景）
        String ip = request.getHeader("X-Forwarded-For");
        
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            // 其次从 X-Real-IP 获取
            ip = request.getHeader("X-Real-IP");
        }
        
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            // 最后从 remoteAddr 获取
            ip = request.getRemoteAddr();
        }
        
        // 如果是多个 IP（负载均衡场景），取第一个
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
}
