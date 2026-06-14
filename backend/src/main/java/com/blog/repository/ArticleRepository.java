package com.blog.repository;

import com.blog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

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

    List<Article> findByTitleContaining(String keyword);

    Page<Article> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Article> findAllByIdIn(List<Long> articleIds, Pageable pageable);
    

    //List<Article> findAllByIdIn(List<Long> articleIds);
   
    //按照作者查询及其变体逻辑（分页、加入创建时间等）
    // List<Article> findByAuthor(String author);   
    // List<Article> findByAuthor(String author, org.springframework.data.domain.Sort sort);

    // Page<Article> findByAuthorContaining(String author, Pageable pageable);

    // //自定义查询作者逻辑
    // @Query(value = "SELECT * FROM article WHERE author = ?", nativeQuery = true)
    // List<Article> findByAuthorNative(String author);

    //分页查询的高级搜索逻辑（按作者或标题包含关键词）
    //List<Article>findByTitleContaining(String keyword);
    // Page<Article> findByTitleOrContentContaining(String title, String keyword, Pageable pageable);
    // Page<Article> findByAuthorOrTitleContaining(String author, String keyword, Pageable pageable);

    // Page<Article> findByAuthorOrderByCreateTimeDesc(String author, Pageable pageable);
    // Page<Article> findByAuthorOrderByCreateTimeAsc(String author, Pageable pageable);
    
    //按照内容进行查询
    // Page<Article> findByContentContaining(String keyword, Pageable pageable);

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

