package com.blog.repository;

import com.blog.entity.Article;
import com.blog.entity.ArticleCategory;
import com.blog.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    
   //查询逻辑
   //所有文章列举逻辑（普通、分页逻辑）
    Page<Article> findAll(Pageable pageable);

    Optional<Article> findById(Long id);

    Article save(Article article);

    //删除逻辑---按照id删除，用于一个删除容器点击事件
    void deleteById(Long articleId);

    //容器查找逻辑  
    Page<Article> findByCategoryId(Long categoryId, Pageable pageable);

    //搜索逻辑  
    //基础搜索（单元素搜索，只按标题、作者、分类、内容的四者其一搜索）
    Page<Article> findByTitleContaining(String keyword, Pageable pageable);

    Page<Article> findByAuthorContaining(String author, Pageable pageable);

    Page<Article> findByContentContaining(String keyword, Pageable pageable);

    // 按分类名称搜索（需要通过关联查询）
    @Query("SELECT a FROM Article a JOIN ArticleCategory ac ON a.id = ac.article.id JOIN Category c ON ac.category.id = c.id WHERE c.name LIKE %:categoryName%")
    Page<Article> findByCategoryNameContaining(@Param("categoryName") String categoryName, Pageable pageable);

    //复合或逻辑搜索（按标题、作者、分类、内容四者的任一组合逻辑进行或搜索，即包含多个要素搜索的其中一个即可得到文章）
    Page<Article> findByTitleContainingOrContentContaining(String titleKeyword, String contentKeyword, Pageable pageable);

    Page<Article> findByAuthorContainingOrTitleContaining(String authorKeyword, String titleKeyword, Pageable pageable);

    // 多字段或搜索：标题、作者、内容任一包含关键词
    @Query("SELECT a FROM Article a WHERE a.title LIKE %:keyword% OR a.author LIKE %:keyword% OR a.content LIKE %:keyword%")
    Page<Article> findByTitleOrAuthorOrContentContaining(@Param("keyword") String keyword, Pageable pageable);

    //复合搜索且逻辑（按标题、作者、分类、内容四者的任一组合逻辑进行且搜索，即包含多个要素搜索的全部才能得到文章）
    
    Page<Article> findByTitleContainingAndAuthorContainingAndContentContaining(String titleKeyword, String authorKeyword, String contentKeyword, Pageable pageable);

    // 多字段且搜索：标题、作者、内容同时包含对应关键词
    @Query("SELECT a FROM Article a WHERE a.title LIKE %:title% AND a.author LIKE %:author% AND a.content LIKE %:content%")
    Page<Article> findByTitleAndAuthorAndContentContaining(@Param("title") String title, @Param("author") String author, @Param("content") String content, Pageable pageable);

    // 按分类ID和标题搜索
    Page<Article> findByCategoryIdAndTitleContaining(Long categoryId, String titleKeyword, Pageable pageable);
    


    Page<Article> findAllByIdIn(List<Long> articleIds, Pageable pageable);
    
    List<Article> findAllByIdIn(List<Long> articleIds);



    // List<Article> findByCategoryId(Long categoryId);

    // Article DeleteByAuthorContaining(String author);

    // @Query("SELECT a FROM Article a WHERE a.title LIKE %:keyword% OR a.content LIKE %:keyword%")
    // List<Article> searchArticles(@Param("keyword") String keyword);

    // @Query("SELECT a FROM Article a WHERE a.title LIKE %:keyword% OR a.content LIKE %:keyword%")
    // Page<Article> searchArticles(@Param("keyword") String keyword, Pageable pageable);

    // Article findByTitle(String title);
    
    // List<Article> findByTitleStartingWith(String prefix);
    
    // List<Article> findByCreateTimeBetween(LocalDateTime start, LocalDateTime end);



}

