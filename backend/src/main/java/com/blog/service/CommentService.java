package com.blog.service;

import com.blog.dto.CommentCreateRequest;
import com.blog.dto.CommentResponse;
import com.blog.entity.Comment;
import com.blog.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 评论 Service
 * 
 * 处理评论相关的业务逻辑
 * 
 * 改进点：
 * 1. 采用软删除策略：删除评论时只标记状态，不物理删除
 * 2. 保持评论楼结构：父评论删除后，子评论仍然可见
 * 3. 显示删除标记：被删除的评论显示"该评论已被屏蔽/删除"
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final HttpServletRequest request;
    
    /**
     * 创建评论（包括回复）
     * 
     * @param commentRequest 创建评论请求 DTO
     * @return 创建后的评论
     */
    @Transactional
    public Comment create(CommentCreateRequest commentRequest) {
        log.info("创建评论，文章 ID = {}", commentRequest.getArticleId());
        
        // 创建评论对象
        Comment comment = new Comment();
        comment.setArticleId(commentRequest.getArticleId());
        comment.setCommentator(commentRequest.getCommentator());
        comment.setEmail(commentRequest.getEmail());
        comment.setContent(commentRequest.getContent());
        comment.setParentId(commentRequest.getParentId());
        
        // 设置根评论 ID
        // 如果是顶级评论，rootId = null
        // 如果是回复，rootId = 父评论的 rootId（或父评论 ID，如果父评论也是顶级）
        if (commentRequest.getParentId() != null) {
            // 查询父评论
            Comment parentComment = commentRepository.findById(commentRequest.getParentId())
                    .orElseThrow(() -> {
                        log.warn("父评论不存在，ID = {}", commentRequest.getParentId());
                        return new RuntimeException("父评论不存在");
                    });
            
            // 继承父评论的 rootId
            comment.setRootId(parentComment.getRootId() != null 
                ? parentComment.getRootId() 
                : parentComment.getId());
        }
        
        // 设置评论者 IP
        String ipAddress = request.getRemoteAddr();
        comment.setIpAddress(ipAddress);
        
        // 默认状态为通过（实际项目中可能需要审核）
        comment.setStatus(1);
        
        // 保存到数据库
        Comment saved = commentRepository.save(comment);
        
        log.info("评论创建成功，ID = {}", saved.getId());
        return saved;
    }
    
    /**
     * 根据文章 ID 查询所有评论（树形结构）
     * 
     * @param articleId 文章 ID
     * @return 评论列表（包含回复）
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> findByArticleId(Long articleId) {
        log.debug("查询文章评论，文章 ID = {}", articleId);
        
        // 查询所有顶级评论（没有父评论的评论）
        // 包括已删除的评论（前端根据状态决定是否显示）
        List<Comment> rootComments = commentRepository.findByArticleIdAndParentIdIsNullOrderByCreateTimeAsc(articleId);
        
        // 转换为响应 DTO，并填充回复列表
        return rootComments.stream()
                .map(this::convertToResponseWithReplies)
                .collect(Collectors.toList());
    }
    
    /**
     * 将评论转换为响应 DTO（包含回复）
     * 
     * @param comment 评论实体
     * @return 评论响应 DTO（包含回复列表）
     */
    private CommentResponse convertToResponseWithReplies(Comment comment) {
        CommentResponse response = convertToResponse(comment);
        
        // 查询该评论的所有回复
        List<Comment> replies = commentRepository.findByRootId(comment.getId());
        
        // 将回复也转换为响应 DTO
        List<CommentResponse> replyResponses = replies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        response.setReplies(replyResponses);
        
        return response;
    }
    
    /**
     * 将评论转换为响应 DTO（不包含回复）
     * 
     * @param comment 评论实体
     * @return 评论响应 DTO
     */
    private CommentResponse convertToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setArticleId(comment.getArticleId());
        response.setCommentator(comment.getCommentator());
        response.setEmail(comment.getEmail());
        response.setContent(comment.getContent());
        response.setParentId(comment.getParentId());
        response.setRootId(comment.getRootId());
        response.setStatus(comment.getStatus());
        response.setIpAddress(comment.getIpAddress());
        response.setCreateTime(comment.getCreateTime());
        response.setUpdateTime(comment.getUpdateTime());
        
        return response;
    }
    
    /**
     * 删除评论（软删除 - 改进版）
     * 
     * 删除策略：
     * 1. 不物理删除评论，只修改状态为"已删除"（status = -1）
     * 2. 将评论内容修改为"该评论已被屏蔽/删除"
     * 3. 保留评论楼结构，子评论仍然可见
     * 4. 前端根据 status 字段决定是否显示删除标记
     * 
     * @param id 评论 ID
     * @return 删除后的评论（包含删除标记）
     */
    @Transactional
    public CommentResponse delete(Long id) {
        log.info("软删除评论，ID = {}", id);
        
        // 先查询是否存在
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("评论不存在，ID = {}", id);
                    return new RuntimeException("评论不存在，ID = " + id);
                });
        
        // 检查评论是否已被删除
        if (comment.getStatus() == -1) {
            log.info("评论已被删除，ID = {}", id);
            return convertToResponse(comment);
        }
        
        // 修改状态为"已删除"（-1）
        comment.setStatus(-1);
        
        // 保存原始评论者信息（可选，用于日志记录）
        String originalCommentator = comment.getCommentator();
        
        // 将内容修改为删除标记
        comment.setContent("该评论已被屏蔽/删除");
        
        // 清空邮箱（保护隐私）
        comment.setEmail(null);
        
        // 保存修改
        Comment deleted = commentRepository.save(comment);
        
        log.info("评论软删除成功，ID = {}, 原评论者 = {}", id, originalCommentator);
        
        // 返回删除后的评论（前端可以显示删除标记）
        return convertToResponse(deleted);
    }
    
    /**
     * 更新评论状态（审核功能）
     * 
     * @param id 评论 ID
     * @param status 新状态（-1-已删除，0-待审核，1-通过，2-拒绝）
     * @return 更新后的评论
     */
    @Transactional
    public Comment updateStatus(Long id, Integer status) {
        log.info("更新评论状态，ID = {}, status = {}", id, status);
        
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("评论不存在，ID = {}", id);
                    return new RuntimeException("评论不存在，ID = " + id);
                });
        
        comment.setStatus(status);
        Comment updated = commentRepository.save(comment);
        
        log.info("评论状态更新成功，新状态 = {}", status);
        return updated;
    }
    
    /**
     * 根据文章 ID 和状态查询评论
     * 
     * @param articleId 文章 ID
     * @param status 状态（-1-已删除，0-待审核，1-通过，2-拒绝）
     * @return 评论列表
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> findByArticleIdAndStatus(Long articleId, Integer status) {
        log.debug("根据文章 ID 和状态查询评论，articleId = {}, status = {}", articleId, status);
        
        List<Comment> rootComments = commentRepository.findByArticleIdAndStatus(articleId, status)
                .stream()
                .filter(c -> c.getParentId() == null)
                .collect(Collectors.toList());
        
        return rootComments.stream()
                .map(this::convertToResponseWithReplies)
                .collect(Collectors.toList());
    }
    
    /**
     * 分页查询评论
     * 
     * @param articleId 文章 ID
     * @param page 页码
     * @param size 每页大小
     * @return 分页结果
     */
    @Transactional(readOnly = true)
    public List<CommentResponse> findByArticleId(Long articleId, int page, int size) {
        log.debug("分页查询评论，articleId = {}, page = {}, size = {}", articleId, page, size);
        
        // 注意：评论的树形结构不适合简单分页
        // 这里只分页查询根评论，然后加载它们的所有回复
        List<Comment> rootComments = commentRepository.findByArticleIdAndParentIdIsNullOrderByCreateTimeAsc(articleId)
                .stream()
                .skip((long) page * size)
                .limit(size)
                .collect(Collectors.toList());
        
        return rootComments.stream()
                .map(this::convertToResponseWithReplies)
                .collect(Collectors.toList());
    }
    
    /**
     * 恢复已删除的评论（仅管理员可用）
     * 
     * @param id 评论 ID
     * @param originalContent 原始内容（如果无法恢复，使用默认内容）
     * @return 恢复后的评论
     */
    @Transactional
    public CommentResponse restoreDeletedComment(Long id, String originalContent) {
        log.info("恢复已删除的评论，ID = {}", id);
        
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("评论不存在，ID = {}", id);
                    return new RuntimeException("评论不存在，ID = " + id);
                });
        
        // 检查评论是否是已删除状态
        if (comment.getStatus() != -1) {
            throw new RuntimeException("评论未被删除，无法恢复，ID = " + id);
        }
        
        // 恢复状态为"待审核"（需要重新审核）
        comment.setStatus(0);
        
        // 恢复内容（如果提供了原始内容）
        if (originalContent != null && !originalContent.isEmpty()) {
            comment.setContent(originalContent);
        } else {
            comment.setContent("[内容已恢复，请管理员审核]");
        }
        
        Comment restored = commentRepository.save(comment);
        
        log.info("评论恢复成功，ID = {}, 新状态 = {}", id, restored.getStatus());
        
        return convertToResponse(restored);
    }
}
