package com.blog.service;

import com.blog.dto.LoginRequest;
import com.blog.dto.LoginResponse;
import com.blog.dto.RegisterRequest;
import com.blog.entity.User;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.blog.util.JwtUtil;
import com.blog.util.PasswordValidator;

/**
 * 用户 Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 用户注册
     */
    @Transactional
    public void register(RegisterRequest request) {
        log.info("用户注册请求：username={}", request.getUsername());
        
        // 验证密码强度
        PasswordValidator.PasswordValidationResult passwordResult = 
            PasswordValidator.validate(request.getPassword());
        
        if (!passwordResult.isValid()) {
            log.warn("密码强度不足：{} - {}", request.getUsername(), passwordResult.getMessage());
            throw new IllegalArgumentException(passwordResult.getMessage());
        }
        
        // 检查用户名是否已存在
        boolean exists = userRepository.existsByUsername(request.getUsername());
        log.info("用户名 {} 是否存在：{}", request.getUsername(), exists);
        
        if (exists) {
            log.warn("用户名已存在：{}", request.getUsername());
            throw new RuntimeException("用户名已存在");
        }
        
        // 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setEmail(request.getEmail());
        user.setAvatar(request.getAvatar());
        user.setStatus(1); // 默认正常状态
        
        userRepository.save(user);
        
        log.info("用户注册成功：{}, id={}", request.getUsername(), user.getId());
    }
    
    /**
     * 用户登录
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        log.info("用户登录请求：username={}", request.getUsername());
        
        // 查找用户
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> {
                    log.warn("用户不存在：{}", request.getUsername());
                    return new RuntimeException("用户名或密码错误");
                });
        
        log.info("用户找到：id={}, username={}, status={}", user.getId(), user.getUsername(), user.getStatus());
        
        // 验证密码
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        log.info("密码验证结果：{}", matches);
        
        if (!matches) {
            log.warn("密码不匹配：{}", request.getUsername());
            throw new RuntimeException("用户名或密码错误");
        }
        
        // 检查用户状态
        if (user.getStatus() != 1) {
            log.warn("账号已被禁用：{}", request.getUsername());
            throw new RuntimeException("账号已被禁用");
        }
        
        // 生成 JWT token
        log.info("登录成功，生成 token：{}", user.getUsername());
        String token = JwtUtil.generateToken(user.getUsername(), user.getId());
        
        return new LoginResponse(token, user.getId(), user.getUsername(), user.getNickname());
    }
}
