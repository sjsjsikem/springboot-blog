package com.blog.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT 工具类
 * 
 * 作用：生成和解析 JWT 令牌
 * 
 * 类比：就像一个"制证中心" + "验证中心"
 * - 制证：根据用户名生成 JWT
 * - 验证：解析 JWT，判断是否有效
 */
public class JwtUtil {
    
    /**
     * 密钥（用于签名和验证）
     * 
     * 通俗理解：这就是"印章"
     * - 生成 JWT 时用密钥盖章
     * - 验证 JWT 时用同样的密钥检查印章是否正确
     * 
     * 注意：
     * - 生产环境应该放到配置文件中，不要写死在代码里
     * - 密钥必须足够长（至少 32 个字符），否则不安全
     */
    private static final String SECRET_STRING = "YourSecretKeyForJWTTokenGenerationMustBeLongEnough12345";
    
    /**
     * 将字符串转换为 SecretKey 对象
     * Keys.hmacShaKeyFor() 会生成一个 HMAC-SHA 密钥
     */
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());
    
    /**
     * 令牌有效期
     * 计算：7 天 × 24 小时 × 60 分钟 × 60 秒 × 1000 毫秒 = 604800000 毫秒
     */
    private static final long EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000L;
    
    /**
     * 生成 JWT 令牌
     * 
     * @param username 用户名
     * @param userId 用户 ID
     * @return JWT 字符串
     * 
     * 通俗理解：这就是"制作身份证"
     * 1. 写入信息（用户名、用户 ID）
     * 2. 写入签发时间
     * 3. 写入过期时间
     * 4. 盖章签名
     * 5. 返回完整的 JWT 字符串
     */
    public static String generateToken(String username, Long userId) {
        return Jwts.builder()
                // 设置主题（sub = subject）
                // 通常放用户名，表示这个 JWT 是属于谁的
                .setSubject(username)
                
                // 设置自定义 claims（附加信息）
                // claim 就是 JWT 中的额外数据
                .claim("userId", userId)
                
                // 设置签发时间（iat = issued at）
                // 表示这个 JWT 是什么时候签发的
                .setIssuedAt(new Date())
                
                // 设置过期时间（exp = expiration）
                // 表示这个 JWT 什么时候失效
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                
                // 签名（盖章）
                // 使用密钥对前面的信息进行签名，防止伪造
                .signWith(SECRET_KEY)
                
                // 生成最终的 JWT 字符串
                .compact();
    }
    
    /**
     * 解析 JWT 令牌
     * 
     * @param token JWT 字符串
     * @return Claims 对象（包含 JWT 中的所有信息）
     * 
     * 通俗理解：这就是"验证身份证并读取信息"
     * 1. 检查印章是否正确（验证签名）
     * 2. 检查是否过期
     * 3. 读取里面的信息（用户名、用户 ID 等）
     * 
     * Claims 就像一个 Map，可以通过 key 获取 value
     */
    public static Claims parseToken(String token) {
        return Jwts.parserBuilder()
                // 设置签名密钥（用于验证签名）
                // 只有用同样的密钥才能验证签名是否正确
                .setSigningKey(SECRET_KEY)
                
                // 构建解析器
                .build()
                
                // 解析令牌
                // parseClaimsJws 会做三件事：
                // 1. 验证签名
                // 2. 检查过期时间
                // 3. 解析载荷
                .parseClaimsJws(token)
                
                // 获取 Claims（载荷）
                // Claims 包含所有信息：用户名、用户 ID、签发时间、过期时间等
                .getBody();
    }
    
    /**
     * 从令牌中获取用户名
     * 
     * @param token JWT 字符串
     * @return 用户名
     * 
     * 通俗理解：从身份证上读取姓名
     */
    public static String getUsername(String token) {
        // getSubject() 获取主题（我们设置的是用户名）
        return parseToken(token).getSubject();
    }
    
    /**
     * 从令牌中获取用户 ID
     * 
     * @param token JWT 字符串
     * @return 用户 ID
     * 
     * 通俗理解：从身份证上读取身份证号
     */
    public static Long getUserId(String token) {
        // get() 方法通过 key 获取 value
        // "userId" 是我们之前用 claim("userId", userId) 设置的
        return parseToken(token).get("userId", Long.class);
    }
    
    /**
     * 验证令牌是否有效
     * 
     * @param token JWT 字符串
     * @return 有效返回 true，无效返回 false
     * 
     * 通俗理解：检查身份证是否有效
     * 1. 检查印章是否正确（签名验证）
     * 2. 检查是否过期
     * 3. 检查格式是否正确
     */
    public static boolean validateToken(String token) {
        try {
            // 尝试解析 token
            // 如果 token 无效（签名错误、过期、格式错误），会抛出异常
            parseToken(token);
            // 没有异常，说明 token 有效
            return true;
        } catch (Exception e) {
            // 捕获任何异常，说明 token 无效
            return false;
        }
    }
}
