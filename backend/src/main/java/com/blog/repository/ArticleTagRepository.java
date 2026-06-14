package com.blog.repository;

import com.blog.entity.ArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 文章标签关联 Repository
 * 
 * 用于查询文章与标签的关联关系
 */
@Repository
public interface ArticleTagRepository extends JpaRepository<ArticleTag, Long> {


    /**
     * 根据标签 ID 查询所有文章关联
     * 用于获取某个标签下的所有文章
     */
    List<ArticleTag> findByTag_Id(Long tagId);

    /**
     * 根据标签 ID 查询文章 ID 列表
     * 用于按标签筛选文章
     */
    @Query("SELECT at.article.id FROM ArticleTag at WHERE at.tag.id = :tagId")
    List<Long> findArticleIdsByTagId(@Param("tagId") Long tagId);
    
    /**
     * 根据文章 ID 查询所有标签关联
     * 用于获取某篇文章的所有标签
     */
    // List<ArticleTag> findByArticle_Id(Long articleId);
    
    /**
     * 根据标签 ID 删除所有关联
     * 用于删除标签时清理关联关系
     */
    // void deleteByTag_Id(Long tagId);
    
    /**
     * 删除文章内的关联标签
     * 用于删除文章时清理关联关系
     */
    // void deleteByArticle_Id(Long articleId);
    

}
