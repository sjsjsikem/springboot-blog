package com.blog.controller;

import com.blog.common.Result;
import com.blog.entity.Article;
import com.blog.entity.ArticleCategory;
import com.blog.entity.Category;
import com.blog.repository.ArticleCategoryRepository;
import com.blog.repository.ArticleRepository;
import com.blog.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器---用RequestMapping映射了全局api为categories
 * 
 * 提供分类的增删改查接口
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryRepository categoryRepository;

    private final ArticleCategoryRepository articleCategoryRepository;

    private final ArticleRepository articleRepository;
    
    @GetMapping
    public Result<List<Category>> getAll() {
        // 按排序序号升序查询
        List<Category> categories = categoryRepository.findAllByOrderBySortOrderAsc();
        return Result.success(categories);
    }
    
    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable Long id) {
        // findById 返回 Optional，需要处理不存在的情况
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("分类不存在，ID = " + id));
        return Result.success(category);
    }
    
    @PostMapping
    public Result<Category> create(@RequestBody Category category) {
        // 直接保存，JPA 会自动生成 ID
        Category saved = categoryRepository.save(category);
        return Result.success(saved);
    }
    
    @PutMapping("/{id}")
    public Result<Category> update(@PathVariable Long id, @RequestBody Category category) {
        // 先查询是否存在
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("分类不存在，ID = " + id));
        
        // 更新字段
        existing.setName(category.getName());
        existing.setAlias(category.getAlias());
        existing.setDescription(category.getDescription());
        existing.setSortOrder(category.getSortOrder());
        
        // 保存更新
        Category updated = categoryRepository.save(existing);
        return Result.success(updated);
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        // 先查询是否存在
        categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("分类不存在，ID = " + id));
        
        // 删除
        categoryRepository.deleteById(id);
        return Result.success(null);
    }

    //根据分类id查询所有文章关联
    @GetMapping("/{id}/articles")
    public Result<List<ArticleCategory>> getArticlesByCategory(@PathVariable Long id) {
        List<ArticleCategory> articles = articleCategoryRepository.findByCategory_Id(id);
        return Result.success(articles);
    }

    // 根据分类ID分页查询文章（使用ArticleService）
    @GetMapping("/{id}/articles/page")
    public Result<Page<Article>> getArticlesByCategoryPage(@PathVariable Long id, 
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Article> articles = articleRepository.findByCategoryId(id, pageable);
        return Result.success(articles);
    }

    


}
