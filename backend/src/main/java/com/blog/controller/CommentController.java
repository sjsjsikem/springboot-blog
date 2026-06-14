package com.blog.controller;

import com.blog.common.Result;
import com.blog.dto.CommentCreateRequest;
import com.blog.dto.CommentResponse;
import com.blog.dto.CommentUpdateRequest;
import com.blog.entity.Comment;
import com.blog.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import com.blog.repository.CommentRepository;

import java.util.List;

/**
 * 评论控制器
 * 
 * 提供评论的增删改查接口
 */
@Slf4j  // Lombok 自动生成 log 对象
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    
    private final CommentService commentService;

    private final CommentRepository commentRepository;
    
    /**
     * 创建评论（包括回复）
     * POST /api/comments
     * 
     * @param commentRequest 创建评论请求 DTO
     * @return 创建后的评论
     */
    @PostMapping
    public Result<CommentResponse> create(@Valid @RequestBody CommentCreateRequest commentRequest) {
        log.info("接收到创建评论请求");
        
        Comment comment = commentService.create(commentRequest);
        CommentResponse response = convertToResponse(comment);
        
        return Result.success(response);
    }
    
    /**
     * 根据文章 ID 查询所有评论
     * GET /api/comments?articleId=1
     * 
     * @param articleId 文章 ID
     * @return 评论列表（树形结构）
     */
    @GetMapping
    public Result<List<CommentResponse>> getByArticleId(@RequestParam Long articleId) {
        log.info("查询文章评论，文章 ID = {}", articleId);
        
        List<CommentResponse> comments = commentService.findByArticleId(articleId);
        
        return Result.success(comments);
    }
    
    /**
     * 删除评论
     * DELETE /api/comments/{id}
     * 
     * @param id 评论 ID
     * @return 结果
     */
    @DeleteMapping("/{id}")
    public Result<CommentResponse> delete(@PathVariable Long id) {
        log.info("删除评论，ID = {}", id);
        CommentResponse deleted = commentService.delete(id);  // ✅ 返回删除后的评论
        return Result.success(deleted);
    }
    
    /**
     * 将评论实体转换为响应 DTO（辅助方法）
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
        response.setReplies(null);
        
        return response;
    }

    /**
     * 更新评论状态（审核功能）
     * PUT /api/comments/{id}/status
     * 
     * @param id 评论 ID
     * @param status 新状态（0-待审核，1-通过，2-拒绝）
     * @return 更新后的评论
     */
    @PutMapping("/{id}/status")
    public Result<CommentResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        log.info("更新评论状态，ID = {}, status = {}", id, status);
        
        // 验证状态值
        if (status < 0 || status > 2) {
            throw new RuntimeException("无效的状态值，必须是 0、1 或 2");
        }
        
        Comment comment = commentService.updateStatus(id, status);
        return Result.success(convertToResponse(comment));
    }

    /**
     * 根据文章 ID 和状态查询评论
     * GET /api/comments/status?articleId=1&status=1
     * 
     * @param articleId 文章 ID
     * @param status 状态（1-通过）
     * @return 评论列表
     */
    @GetMapping("/status")
    public Result<List<CommentResponse>> getByArticleIdAndStatus(
            @RequestParam Long articleId,
            @RequestParam Integer status) {
        log.info("根据文章 ID 和状态查询评论，articleId = {}, status = {}", articleId, status);
        
        List<CommentResponse> comments = commentService.findByArticleIdAndStatus(articleId, status);
        
        return Result.success(comments);
    }

    /**
     * 分页查询评论
     * GET /api/comments/page?articleId=1&page=0&size=10
     * 
     * @param articleId 文章 ID
     * @param page 页码
     * @param size 每页大小
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<List<CommentResponse>> getByArticleIdWithPage(
            @RequestParam Long articleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("分页查询评论，articleId = {}, page = {}, size = {}", articleId, page, size);
        
        List<CommentResponse> comments = commentService.findByArticleId(articleId, page, size);
        
        return Result.success(comments);
    }

    /**
     * 更新评论内容
     * PUT /api/comments/{id}
     * 
     * @param id 评论 ID
     * @param request 更新请求
     * @return 更新后的评论
     */
    @PutMapping("/{id}")
    public Result<CommentResponse> update(
            @PathVariable Long id,
            @RequestBody CommentUpdateRequest request) {
        log.info("更新评论，ID = {}", id);
        
        // 查询评论
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("评论不存在，ID = " + id));
        
        // 更新字段
        if (request.getContent() != null) {
            comment.setContent(request.getContent());
        }
        if (request.getEmail() != null) {
            comment.setEmail(request.getEmail());
        }
        
        Comment updated = commentRepository.save(comment);
        
        return Result.success(convertToResponse(updated));
    }
}
