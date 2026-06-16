package com.blog.controller;

import com.blog.entity.Article;
import com.blog.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.blog.common.Result;
import jakarta.validation.Valid;
import com.blog.dto.ArticleCreateRequest;
import com.blog.dto.ArticleUpdateRequest;

import java.util.List;
import java.util.Optional;


@RestController  // 告诉 Spring：这是一个 REST 控制器，处理 HTTP 请求
@RequestMapping("/api")  // 所有接口都以 /api 开头
@RequiredArgsConstructor  // 自动注入 final 字段，避免 @Autowired
@Slf4j  // Lombok 自动生成 log 对象
public class ArticleController {
    
    private final ArticleService articleService;  // 文章服务（厨师）

    @GetMapping("/articles")
    public ResponseEntity<Result<Page<Article>>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Article> articles = articleService.findAll(page, size);
        return ResponseEntity.ok(Result.success(articles));
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<Result<Article>> getArticleById(@PathVariable Long id) {
        Article article = articleService.findById(id);
        return ResponseEntity.ok(Result.success(article));
    }
    
    // @GetMapping("/articles/page")
    // public ResponseEntity<Result<Page<Article>>> getArticlesByPage(
    //         @RequestParam(defaultValue = "0") int page,
    //         @RequestParam(defaultValue = "10") int size) {        
    //     Page<Article> articlePage = articleService.findAll(page, size);
    //     return ResponseEntity.ok(Result.success(articlePage));
    // }

    // @GetMapping("/articles/page/sort")
    // public ResponseEntity<Result<Page<Article>>> getArticlesByPageWithSort(
    //         @RequestParam(defaultValue = "0") int page,
    //         @RequestParam(defaultValue = "10") int size,
    //         @RequestParam(defaultValue = "createTime") String sortField,
    //         @RequestParam(defaultValue = "false") boolean ascending) {      
    //     Page<Article> articlePage = articleService.findAll(page, size, sortField, ascending);
    //     return ResponseEntity.ok(Result.success(articlePage));
    // }
    
    //获取所有文章
    // @GetMapping("/articles")  // 映射 GET 请求到 /api/articles
    // public ResponseEntity<Result<List<Article>>> getAllArticles() {
    //     List<Article> articles = articleService.findAll();      
    //     return ResponseEntity.ok(Result.success(articles));
    // }
    
    @PostMapping("/articles")
    public Result<Article> create(@Valid @RequestBody ArticleCreateRequest request) {
        log.info("接收到创建文章请求");
        
        Article article = articleService.create(request);
        
        log.info("文章创建成功，ID = {}", article.getId());
        return Result.success(article);
    }

    @PostMapping("/articles/{id}/view")
    public ResponseEntity<Result<Article>> incrementViewCount(@PathVariable Long id) {
        log.info("增加文章浏览量，ID = {}", id);
        
        Article article = articleService.incrementViewCount(id);
        return ResponseEntity.ok(Result.success(article));
    }


    @PostMapping("/articles/{id}/like")
    public ResponseEntity<Result<Article>> incrementLikeCount(@PathVariable Long id) {
        log.info("增加文章点赞数，ID = {}", id);
        
        Article article = articleService.incrementLikeCount(id);
        return ResponseEntity.ok(Result.success(article));
    }

    @PutMapping("/articles/{id}")
    public Result<Article> update(@PathVariable Long id, 
                                @Valid @RequestBody ArticleUpdateRequest request) {
        log.info("接收到更新文章请求，ID = {}", id);
        
        Article article = articleService.update(id, request);
        
        log.info("文章更新成功，ID = {}", article.getId());
        return Result.success(article);
    }

    /**
     * ========== 删除文章 ==========
     */
    @DeleteMapping("/articles/{id}")
    public ResponseEntity<Result<Void>> deleteArticle(@PathVariable Long id) {
        articleService.deleteById(id);
        return ResponseEntity.ok(Result.success("文章删除成功", null));
    }


    @GetMapping("/articles/search")
    public ResponseEntity<Result<List<Article>>> searchArticles(
            @RequestParam String keyword) {
        
        List<Article> articles = articleService.searchByTitle(keyword);
        return ResponseEntity.ok(Result.success(articles));
    }

    @GetMapping("/articles/search/advanced")
    public ResponseEntity<Result<List<Article>>> searchAdvanced(
            @RequestParam String author,
            @RequestParam String keyword) {
        
        List<Article> articles = articleService.searchByAuthorOrTitle(author, keyword);
        return ResponseEntity.ok(Result.success(articles));
    }

    @GetMapping("/articles/search/multi")
    public ResponseEntity<Result<Page<Article>>> searchMultiField(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Article> articlePage = articleService.searchByKeyword(keyword, page, size);
        return ResponseEntity.ok(Result.success(articlePage));
    }

    @GetMapping("/articles/search/category")
    public ResponseEntity<Result<Page<Article>>> searchByCategoryName(
            @RequestParam String categoryName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Article> articlePage = articleService.searchByCategoryName(categoryName, page, size);
        return ResponseEntity.ok(Result.success(articlePage));
    }


    @GetMapping("/articles/category")
    public ResponseEntity<Result<Page<Article>>> getArticlesByCategory(
            @RequestParam Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Article> articlePage = articleService.findByCategoryId(categoryId, page, size);
        return ResponseEntity.ok(Result.success(articlePage));
    }

    @GetMapping("/articles/tag")
    public ResponseEntity<Result<Page<Article>>> getArticlesByTag(
            @RequestParam Long tagId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Article> articlePage = articleService.findByTagId(tagId, page, size);
        log.info("查询标签 ID={} 下的文章，共 {} 篇", tagId, articlePage.getTotalElements());
        Page<Article> resultPage = new org.springframework.data.domain.PageImpl<>(
            articlePage.getContent(),
            articlePage.getPageable(),
            articlePage.getTotalElements()
        );
        
        return ResponseEntity.ok(Result.success(resultPage));
    }

//     @GetMapping("/articles/tag/list")
//     public ResponseEntity<Result<List<Article>>> getArticlesByTagList(
//             @RequestParam Long tagId) {       
//         List<Article> articles = articleService.findByTagId(tagId);
//         log.info("查询标签 ID={} 下的文章，共 {} 篇", tagId, articles.size());
//         return ResponseEntity.ok(Result.success(articles));
//     }


//    @GetMapping("/articles/author/page")
//     public ResponseEntity<Result<Page<Article>>> getArticlesByAuthorPage(
//             @RequestParam String author,
//             @RequestParam(defaultValue = "0") int page,
//             @RequestParam(defaultValue = "10") int size) {
        
//         Page<Article> articlePage = articleService.findByAuthor(author, page, size);
//         return ResponseEntity.ok(Result.success(articlePage));
//     }


//     @GetMapping("/articles/advanced-search")
//     public ResponseEntity<Result<List<Article>>> advancedSearch(
//             @RequestParam String author,
//             @RequestParam String keyword) {
        
//         List<Article> articles = articleService.searchByAuthorOrTitle(author, keyword);
//         return ResponseEntity.ok(Result.success(articles));
//     }

//     @PostMapping("/articles/batch")
//     public ResponseEntity<Result<List<Article>>> batchCreateArticles(
//             @Valid @RequestBody List<Article> articles) {
        
//         List<Article> created = articleService.batchCreate(articles);
//         return ResponseEntity.status(HttpStatus.CREATED)
//                 .body(Result.success("批量创建成功", created));
//     }

//     @PutMapping("/articles/transfer-author")
//     public ResponseEntity<Result<Void>> transferAuthor(
//             @RequestParam String oldAuthor,
//             @RequestParam String newAuthor) {
        
//         articleService.transferAuthor(oldAuthor, newAuthor);
//         return ResponseEntity.ok(Result.success("作者转移成功", null));
//     }


//     @DeleteMapping("/articles/author")
//     public ResponseEntity<Result<Void>> deleteByAuthor(@RequestParam String author) {
//         articleService.deleteByAuthor(author);
//         return ResponseEntity.ok(Result.success("作者文章删除成功", null));
//     }
}
