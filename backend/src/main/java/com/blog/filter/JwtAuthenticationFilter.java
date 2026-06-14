package com.blog.filter;

import com.blog.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT 认证过滤器--所以可以看出filter过滤文件夹主要是负责网关过滤的（用JWT等方式）
 * 
 * 作用：拦截每个请求，验证 JWT token 是否有效
 * 
 * 工作流程：
 * 1. 从请求头中获取 Authorization
 * 2. 提取 token（去掉 "Bearer " 前缀）
 * 3. 验证 token 是否有效
 * 4. 如果有效，将用户信息存入请求属性，供后续使用
 * 5. 如果无效，返回 401 错误
 * 
 * 通俗理解：就像大楼的保安
 * - 每个进入大楼的人都要出示证件（token）
 * - 保安验证证件是否有效
 * - 有效就放行，并记录你是谁
 * - 无效就拒绝进入
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * 执行过滤逻辑
     * 
     * @param request HTTP 请求对象（包含请求头、参数等）
     * @param response HTTP 响应对象（用于返回响应）
     * @param filterChain 过滤器链（调用下一个过滤器或目标资源）
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        // ========== 第一步：获取请求头中的 Authorization ==========
        // 
        // 客户端发送请求时，会在 Authorization 头中携带 token
        // 格式：Bearer <token>
        // 例如：Bearer eyJhbGciOiJIUzM4NCJ9.xxx...
        String authHeader = request.getHeader("Authorization");
        
        // ========== 第二步：检查是否有 Authorization 头 ==========
        // 
        // 如果没有 Authorization 头，说明是未登录用户
        // 直接放行，让后续的 Controller 处理
        // （有些接口是公开的，不需要登录）
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // 调用下一个过滤器
            filterChain.doFilter(request, response);
            return;
        }
        
        // ========== 第三步：提取 token ==========
        // 
        // Authorization 头的格式是：Bearer <token>
        // 我们需要去掉 "Bearer " 前缀（7 个字符）
        // substring(7) 表示从第 7 个字符开始截取
        String token = authHeader.substring(7);
        
        // ========== 第四步：验证 token ==========
        try {
            // 调用 JwtUtil 验证 token 是否有效
            if (JwtUtil.validateToken(token)) {
                // ========== token 有效 ==========
                
                // 从 token 中解析出用户信息
                String username = JwtUtil.getUsername(token);
                Long userId = JwtUtil.getUserId(token);
                
                // 将用户信息存入请求属性
                // 这样后续的 Controller 就可以通过 request.getAttribute() 获取
                request.setAttribute("username", username);
                request.setAttribute("userId", userId);
                
                // ========== 关键：设置 Spring Security 上下文 ==========
                // 创建一个 Authentication 对象，表示用户已认证
                // UsernamePasswordAuthenticationToken 是 Spring Security 的认证令牌
                // 参数：principal（用户名）, credentials（密码，这里用 null 因为已验证）, authorities（权限列表，暂时为空）
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                
                // 将 authentication 设置到 SecurityContext 中
                // 这样 Spring Security 就知道这个请求已经认证过了
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // 记录日志（DEBUG 级别）
                log.debug("JWT 验证成功，用户：{}", username);
            } else {
                // ========== token 无效（过期或被篡改） ==========
                
                // 记录警告日志，添加更多调试信息
                log.warn("JWT token 无效，token 长度：{}", token.length());
                
                // 设置 HTTP 状态码为 401（未授权）
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                
                // 设置响应内容类型
                response.setContentType("application/json;charset=UTF-8");
                
                // 返回错误信息
                response.getWriter().write("{\"code\":401,\"message\":\"Token 无效或已过期\"}");
                
                // 直接返回，不调用 filterChain
                return;
            }
        } catch (Exception e) {
            // ========== 解析 token 时发生异常 ==========
            
            // 记录错误日志，添加详细异常信息
            log.error("JWT 解析失败：{}", e.getMessage(), e);
            log.error("失败的 token 长度：{}", token.length());
            
            // 设置 HTTP 状态码为 401
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            
            // 设置响应内容类型
            response.setContentType("application/json;charset=UTF-8");
            
            // 返回错误信息
            response.getWriter().write("{\"code\":401,\"message\":\"Token 解析失败\"}");
            
            // 直接返回
            return;
        }
        
        // ========== 第五步：放行请求 ==========
        // 
        // 如果 token 有效，调用 filterChain.doFilter()
        // 这会让请求继续传递到下一个过滤器或最终的 Controller
        filterChain.doFilter(request, response);
    }
}
