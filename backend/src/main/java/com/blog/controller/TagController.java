package com.blog.controller;

import com.blog.common.Result;
import com.blog.entity.Tag;
import com.blog.repository.TagRepository;
import com.blog.repository.ArticleTagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 标签控制器
 * 
 * 提供标签的增删改查接口
 */
@Slf4j
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    
    private final TagRepository tagRepository;
    private final ArticleTagRepository articleTagRepository;
    
    /**
     * 获取所有标签
     * GET /api/tags
     * 
     * @return 标签列表
     */
    @GetMapping
    public Result<List<Tag>> getAll() {
        List<Tag> tags = tagRepository.findAll();
        return Result.success(tags);
    }
    
    /**
     * 根据 ID 获取标签
     * GET /api/tags/{id}
     * 
     * @param id 标签 ID
     * @return 标签详情
     */
    @GetMapping("/{id}")
    public Result<Tag> getById(@PathVariable Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("标签不存在，ID = " + id));
        return Result.success(tag);
    }
    
    /**
     * 创建标签
     * POST /api/tags
     * 
     * @param tag 标签对象
     * @return 创建后的标签
     */
    @PostMapping
    public Result<Tag> create(@RequestBody Tag tag) {
        // 检查标签名称是否已存在
        if (tagRepository.findByName(tag.getName()).isPresent()) {
            throw new RuntimeException("标签已存在，名称 = " + tag.getName());
        }
        
        Tag saved = tagRepository.save(tag);
        log.info("标签创建成功，ID = {}, name = {}", saved.getId(), saved.getName());
        return Result.success(saved);
    }
    
    /**
     * 更新标签
     * PUT /api/tags/{id}
     * 
     * @param id 标签 ID
     * @param tag 新的标签信息
     * @return 更新后的标签
     */
    @PutMapping("/{id}")
    public Result<Tag> update(@PathVariable Long id, @RequestBody Tag tag) {
        Tag existing = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("标签不存在，ID = " + id));
        
        // 更新字段
        existing.setName(tag.getName());
        existing.setAlias(tag.getAlias());
        
        // 保存更新
        Tag updated = tagRepository.save(existing);
        return Result.success(updated);
    }
    
    /**
     * 删除标签
     * DELETE /api/tags/{id}
     * 
     * @param id 标签 ID
     * @return 结果
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("标签不存在，ID = " + id));
        
        tagRepository.deleteById(id);
        return Result.success(null);
    }
    
    /**
     * 根据标签名称查询
     * GET /api/tags/search?name=Java
     * 
     * @param name 标签名称
     * @return 标签列表
     */
    @GetMapping("/search")
    public Result<List<Tag>> searchByName(@RequestParam String name) {
        List<Tag> tags = tagRepository.findByNameContaining(name);
        return Result.success(tags);
    }

    /**
     * 获取标签下的文章数量
     * GET /api/tags/{id}/articles/count
     * 
     * @param id 标签 ID
     * @return 文章数量
     */
    // @GetMapping("/{id}/articles/count")
    // public Result<Long> getArticleCount(@PathVariable Long id) {
    //     long count = articleTagRepository.findByTag_Id(id).size();
    //     return Result.success(count);
    // }
}
