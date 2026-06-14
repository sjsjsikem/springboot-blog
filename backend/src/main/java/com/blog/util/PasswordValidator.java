package com.blog.util;

import java.util.regex.Pattern;

/**
 * 密码强度验证工具类
 * 
 * 密码要求：
 * 1. 长度至少 8 个字符
 * 2. 包含至少一个大写字母
 * 3. 包含至少一个小写字母
 * 4. 包含至少一个数字
 * 5. 包含至少一个特殊字符（可选）
 */
public class PasswordValidator {
    
    // 密码正则表达式
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])" +          // 至少一个数字
        "(?=.*[a-z])" +           // 至少一个小写字母
        "(?=.*[A-Z])" +           // 至少一个大写字母
        "(?=.*[@#$%^&+=!])" +     // 至少一个特殊字符（可选，先注释掉）
        "(?=\\S+$)" +             // 不能包含空格
        ".{8,}$"                  // 至少 8 个字符
    );
    
    // 简化版密码模式（不要求特殊字符）
    private static final Pattern SIMPLE_PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])" +          // 至少一个数字
        "(?=.*[a-z])" +           // 至少一个小写字母
        "(?=.*[A-Z])" +           // 至少一个大写字母
        "(?=\\S+$)" +             // 不能包含空格
        ".{8,}$"                  // 至少 8 个字符
    );
    
    /**
     * 验证密码强度
     * 
     * @param password 密码
     * @return 验证结果（包含是否有效和错误消息）
     */
    public static PasswordValidationResult validate(String password) {
        if (password == null || password.isEmpty()) {
            return new PasswordValidationResult(false, "密码不能为空");
        }
        
        if (password.length() < 8) {
            return new PasswordValidationResult(false, "密码长度至少为 8 个字符");
        }
        
        if (password.contains(" ")) {
            return new PasswordValidationResult(false, "密码不能包含空格");
        }
        
        if (!SIMPLE_PASSWORD_PATTERN.matcher(password).matches()) {
            return new PasswordValidationResult(
                false, 
                "密码必须包含至少一个大写字母、一个小写字母和一个数字"
            );
        }
        
        return new PasswordValidationResult(true, "密码强度合格");
    }
    
    /**
     * 密码验证结果类
     */
    public static class PasswordValidationResult {
        private final boolean valid;
        private final String message;
        
        public PasswordValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }
        
        public boolean isValid() {
            return valid;
        }
        
        public String getMessage() {
            return message;
        }
    }
}
