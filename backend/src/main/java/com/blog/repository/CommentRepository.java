package com.blog.repository;

import com.blog.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 评论 Repository
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    /**
     * 根据文章 ID 查询所有评论
     * 
     * @param articleId 文章 ID
     * @return 该文章的所有评论
     */
    List<Comment> findByArticleId(Long articleId);
    
    /**
     * 根据文章 ID 查询顶级评论（没有父评论的评论）
     * 
     * @param articleId 文章 ID
     * @return 顶级评论列表
     */
    List<Comment> findByArticleIdAndParentIdIsNull(Long articleId);
    
    /**
     * 根据根评论 ID 查询所有回复
     * 
     * @param rootId 根评论 ID
     * @return 该根评论下的所有回复
     */
    List<Comment> findByRootId(Long rootId);
    
    /**
     * 根据文章 ID 和状态查询评论
     * 
     * @param articleId 文章 ID
     * @param status 状态（1-通过）
     * @return 符合条件的评论
     */
    List<Comment> findByArticleIdAndStatus(Long articleId, Integer status);
    
    /**
     * 根据文章 ID 查询顶级评论（按创建时间排序）
     * 
     * @param articleId 文章 ID
     * @return 顶级评论列表（按时间正序）
     */
    List<Comment> findByArticleIdAndParentIdIsNullOrderByCreateTimeAsc(Long articleId);

    /**
     * 根据文章 ID 统计评论数量
     * 
     * @param articleId 文章 ID
     * @return 评论总数
     */
    long countByArticleId(Long articleId);

    /**
     * 根据文章 ID 和状态统计评论数量
     * 
     * @param articleId 文章 ID
     * @param status 状态
     * @return 符合条件的评论数量
     */
    long countByArticleIdAndStatus(Long articleId, Integer status);

    /**
     * 查询评论的根 ID（用于级联删除）
     * 
     * @param id 评论 ID
     * @return 根评论 ID
     */
    @Query("SELECT c.rootId FROM Comment c WHERE c.id = :id")
    Long findRootIdById(@Param("id") Long id);
}
