package com.blog.service;

import com.blog.entity.Article;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.ArticleRepository;
import com.blog.repository.ArticleTagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.blog.dto.ArticleCreateRequest;
import com.blog.dto.ArticleUpdateRequest;

import java.util.List;
import java.util.Optional;

/**
 * 文章服务层（重构版）
 * 
 * 改进点：
 * 1. 使用构造器注入（推荐方式）
 * 2. 添加日志记录
 * 3. 使用自定义异常
 * 4. 优化代码结构
 */
@Slf4j  // Lombok 注解，自动生成 logger
@Service
@RequiredArgsConstructor  // Lombok 注解，自动生成构造器
public class ArticleService {

    // final 字段，通过构造器注入
    private final ArticleRepository articleRepository;
    private final ArticleTagRepository articleTagRepository;
    
    // ========== 基础 CRUD ==========
    
    /**
     * 查询所有文章
     */
    @Transactional(readOnly = true)
    public List<Article> findAll() {
        log.debug("查询所有文章");
        List<Article> articles = articleRepository.findAll();
        log.info("查询成功，共 {} 篇文章", articles.size());
        return articles;
    }
    
    /**
      分页查询 + 排序---之后排序的优化方向*/
    // @Transactional(readOnly = true)
    // public Page<Article> findAll(int page, int size, String sortField, boolean ascending) {
    //     log.debug("分页查询 + 排序，page = {}, size = {}, sort = {}, ascending = {}", 
    //               page, size, sortField, ascending);       
    //     // 限制最大每页 100 条
    //     size = Math.min(size, 100);       
    //     // 创建排序对象
    //     Sort sort = ascending ? Sort.by(sortField).ascending() 
    //                          : Sort.by(sortField).descending();       
    //     Pageable pageable = PageRequest.of(page, size, sort);
    //     Page<Article> result = articleRepository.findAll(pageable);       
    //     log.info("分页查询成功，共 {} 篇文章", result.getTotalElements());
    //     return result;
    // }
    
    /**
     * 分页查询(未排序)
     */
    @Transactional(readOnly = true)
    public Page<Article> findAll(int page, int size) {
        log.debug("分页查询，page = {}, size = {}", page, size);
        
        // 限制最大每页 100 条
        size = Math.min(size, 100);
        
        Page<Article> result = articleRepository.findAll(PageRequest.of(page, size));
        log.info("分页查询成功，共 {} 篇文章", result.getTotalElements());
        return result;
    }


    /**
     * 根据 ID 查询文章
     */
    @Transactional(readOnly = true)
    public Article findById(Long id) {
        log.debug("查询文章，ID = {}", id);
        
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> {
                String message = "文章不存在，ID = " + id;
                log.warn(message);
                return new ResourceNotFoundException(message);
            });
        
        log.info("查询成功，文章标题 = {}", article.getTitle());
        return article;
    }
    
    /**
     * 创建文章
     */
    @Transactional
    public Article create(ArticleCreateRequest request) {
        log.info("创建文章：{}", request.getTitle());
        
        // 创建文章对象
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setAuthor(request.getAuthor());
        article.setCategoryId(request.getCategoryId());
        article.setStatus(1); // 默认发布状态
        article.setViewCount(0L); // 初始浏览量为 0
        article.setLikeCount(0L); // 初始点赞数为 0
        
        // 保存到数据库
        Article saved = articleRepository.save(article);
        
        log.info("文章创建成功，ID = {}", saved.getId());
        return saved;
    }

    /**
     * 增加文章浏览量
     * 
     * @param id 文章 ID
     * @return 更新后的文章
     * 
     * 通俗理解：每次有人查看文章，浏览量 +1
     */
    @Transactional
    public Article incrementViewCount(Long id) {
        log.debug("增加文章浏览量，ID = {}", id);
        
        // 查询文章
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("文章不存在，ID = {}", id);
                    return new ResourceNotFoundException("文章不存在，ID = " + id);
                });

        // 增加浏览量
        Long currentCount = article.getViewCount() != null ? article.getViewCount() : 0L;
        article.setViewCount(currentCount + 1);
        
        Article updated = articleRepository.save(article);
        
        log.info("文章浏览量 +1，ID = {}, 新浏览量 = {}", id, updated.getViewCount());
        return updated;
    }

    /**
     * 增加文章点赞数
     * 
     * @param id 文章 ID
     * @return 更新后的文章
     * 
     * 通俗理解：每次有人点赞，点赞数 +1
     */
    @Transactional
    public Article incrementLikeCount(Long id) {
        log.debug("增加文章点赞数，ID = {}", id);
        
        // 查询文章
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("文章不存在，ID = {}", id);
                    return new ResourceNotFoundException("文章不存在，ID = " + id);
                });

        // 增加点赞数
        Long currentCount = article.getLikeCount() != null ? article.getLikeCount() : 0L;
        article.setLikeCount(currentCount + 1);
        
        Article updated = articleRepository.save(article);
        
        log.info("文章点赞数 +1，ID = {}, 新点赞数 = {}", id, updated.getLikeCount());
        return updated;
    }
    
    /**
      根据文章的id和文章请求的数据更新文章字段（只更新非空字段）
     */
    @Transactional
    public Article update(Long id, ArticleUpdateRequest request) {
        log.debug("更新文章，ID = {}", id);
        
        // 查询文章
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("文章不存在，ID = {}", id);
                    return new ResourceNotFoundException("文章不存在，ID = " + id);
                });
        
        // 只更新非空字段
        if (request.getTitle() != null) {
            article.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            article.setContent(request.getContent());
        }
        if (request.getAuthor() != null) {
            article.setAuthor(request.getAuthor());
        }
        if (request.getCategoryId() != null) {
            article.setCategoryId(request.getCategoryId());
        }
        
        // 保存更新
        Article updated = articleRepository.save(article);
        
        log.info("文章更新成功，ID = {}", updated.getId());
        return updated;
    }
    
    /**
     * 删除文章---设计一个点击容器去加载文章的id并调用删除方法
     * 
     * @param id 文章 ID
     * @throws ResourceNotFoundException 文章不存在时抛出
     */
    @Transactional
    public void deleteById(Long id) {
        log.info("删除文章，ID = {}", id);
        
        // 先查询文章是否存在
        findById(id);  // 不存在会抛异常
        
        // 执行删除
        articleRepository.deleteById(id);
        log.info("删除成功，文章 ID = {}", id);
    }
    
      // ========== 搜索功能 ==========
    
    /**
     * 按标题模糊查询
     */
    @Transactional(readOnly = true)
    public List<Article> searchByTitle(String keyword) {
        log.info("按标题搜索，keyword = {}", keyword);
        
        List<Article> articles = articleRepository.findByTitleContaining(keyword);
        log.info("搜索成功，找到 {} 篇文章", articles.size());
        return articles;
    }

    @Transactional(readOnly = true)
    public Page<Article> findByCategoryId(Long categoryId, int page, int size) {
        log.info("按分类查询，categoryId = {}, page = {}, size = {}", categoryId, page, size);
        
        // 限制最大页面大小
        size = Math.min(size, 100);
        
        //Spring Data 分页模块的 标准工厂方法 ！
        Pageable pageable = PageRequest.of(page, size);
        
        return articleRepository.findByCategoryId(categoryId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Article> findByTagId(Long tagId, int page, int size) {
        log.debug("根据标签 ID 分页查询文章，tagId = {}, page = {}, size = {}", tagId, page, size);
        
        // 先查询该标签下的所有文章 ID
        List<Long> articleIds = articleTagRepository.findArticleIdsByTagId(tagId);
        
        if (articleIds.isEmpty()) {
            log.info("该标签下没有文章");
            return Page.empty();
        }
        
        // 根据文章 ID 列表分页查询
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createTime"));
        return articleRepository.findAllByIdIn(articleIds, pageable);
    }

    // @Transactional(readOnly = true)
    // public List<Article> findByCategoryId(Long categoryId) {
    //     log.debug("按分类查询，categoryId = {}", categoryId);       
    //     return articleRepository.findByCategoryId(categoryId);
    // }

    // @Transactional(readOnly = true)
    // public List<Article> findByTagId(Long tagId) {
    //     log.debug("根据标签 ID 查询文章，tagId = {}", tagId);       
    //     // 先查询该标签下的所有文章 ID
    //     List<Long> articleIds = articleTagRepository.findArticleIdsByTagId(tagId);   
    //     if (articleIds.isEmpty()) {
    //         log.info("该标签下没有文章");
    //         return List.of();
    //     }    
    //     // 根据文章 ID 列表查询文章
    //     List<Article> articles = articleRepository.findAllById(articleIds);
    //     log.info("查询成功，共 {} 篇文章", articles.size());
    //     return articles;
    // }
    
    /**
     * 按作者分页查询
     */
    // @Transactional(readOnly = true)
    // public Page<Article> findByAuthor(String author, int page, int size) {
    //     log.debug("按作者查询，author = {}, page = {}, size = {}", author, page, size);
        
    //     size = Math.min(size, 100);
    //     Pageable pageable = PageRequest.of(page, size);
    //     return articleRepository.findByAuthorContaining(author, pageable);
    // }

    // @Transactional(readOnly = true)
    // public List<Article> findByTitleContaining(String keyword) {
    //     log.debug("按标题查询，keyword = {}", keyword);
        
    //     return articleRepository.findByTitleContaining(keyword);
    // }


    /**
     * 按作者和标题查询
     */
    @Transactional(readOnly = true)
    public List<Article> searchByAuthorOrTitle(String author, String keyword) {
        log.info("高级搜索，author = {}, keyword = {}", author, keyword);

        List<Article> articles = articleRepository.findByAuthorContainingOrTitleContaining(author, keyword);
        log.info("搜索成功，找到 {} 篇文章", articles.size());
        return articles;
    }

    /**
     * 多字段模糊搜索：标题、作者、内容任一包含关键词
     */
    @Transactional(readOnly = true)
    public Page<Article> searchByKeyword(String keyword, int page, int size) {
        log.info("多字段搜索，keyword = {}, page = {}, size = {}", keyword, page, size);
        
        size = Math.min(size, 100);
        Pageable pageable = PageRequest.of(page, size);
        
        return articleRepository.findByTitleOrAuthorOrContentContaining(keyword, pageable);
    }

    /**
     * 按分类名称搜索
     */
    @Transactional(readOnly = true)
    public Page<Article> searchByCategoryName(String categoryName, int page, int size) {
        log.info("按分类名称搜索，categoryName = {}, page = {}, size = {}", categoryName, page, size);
        
        size = Math.min(size, 100);
        Pageable pageable = PageRequest.of(page, size);
        
        return articleRepository.findByCategoryNameContaining(categoryName, pageable);
    }
        
    
    // ========== 批量操作 ==========
    
    /**
     * 批量创建文章
     */
    // @Transactional
    // public List<Article> batchCreate(List<Article> articles) {
    //     log.info("批量创建文章，数量 = {}", articles.size());
        
    //     List<Article> created = articles.stream()
    //         .map(article -> {
    //             // 验证标题
    //             if (article.getTitle() == null || article.getTitle().isEmpty()) {
    //                 throw new IllegalArgumentException("文章标题不能为空");
    //             }
    //             return articleRepository.save(article);
    //         })
    //         .toList();
        
    //     log.info("批量创建成功，创建 {} 篇文章", created.size());
    //     return created;
    // }
    
    /**
     * 移动文章作者
     */
    // @Transactional
    // public void transferAuthor(String oldAuthor, String newAuthor) {
    //     log.info("移动作者，oldAuthor = {}, newAuthor = {}", oldAuthor, newAuthor);
        
    //     List<Article> articles = articleRepository.findByAuthorContaining(oldAuthor);
    //     log.debug("找到 {} 篇属于 {} 的文章", articles.size(), oldAuthor);
        
    //     for (Article article : articles) {
    //         article.setAuthor(newAuthor);
    //         articleRepository.save(article);
    //     }
        
    //     log.info("移动成功，共移动 {} 篇文章", articles.size());
    // }
    
    /**
     * 按作者删除
     */
    // @Transactional
    // public void deleteByAuthor(String author) {
    //     log.info("按作者删除，author = {}", author);
        
    //     List<Article> articles = articleRepository.findByAuthorContaining(author);
    //     log.debug("找到 {} 篇属于 {} 的文章", articles.size(), author);
        
    //     // 使用 Repository 的删除方法
    //     articleRepository.deleteByAuthorContaining(author);
        
    //     log.info("删除成功，共删除 {} 篇文章", articles.size());
    // }

 
}
