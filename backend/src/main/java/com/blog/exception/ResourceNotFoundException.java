package com.blog.exception;

    /**
 * 资源未找到异常
 * 
 * 用于表示请求的资源不存在（如文章、用户等）
 * 
 * 使用场景：
 * - 文章不存在
 * - 用户不存在
 * - 分类不存在
 */
//这是一个自定义的异常处理，处理的是一些系统中个性化定制的异常，比如说文章里的请求资源不存在。
//它是一个较为简化的自定义异常，在之后的表述中，可以看出它差不多承担了全部资源查找异常的处理。
// 例如，在文章服务中，当文章不存在时，会抛出这个异常。
// 同样，在用户服务中，当用户不存在时，也会抛出这个异常。因为它是在通用的runtime异常中改过来的
//一般超时的时候会往这个异常的方向抛出
public class ResourceNotFoundException extends RuntimeException{
 /**
     * 构造器
     * 
     * @param message 异常消息
     */
    public ResourceNotFoundException(String message){
        super(message);
    }
        /**
     * 构造器（带原因）
     * 
     * @param message 异常消息
     * @param cause 异常原因
     */
    public ResourceNotFoundException(String message,Throwable cause){
        super(message,cause);
    }
    
}
