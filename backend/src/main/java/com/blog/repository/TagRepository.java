package com.blog.repository;

import com.blog.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 标签 Repository
 * 
 * 提供标签数据访问方法
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    /**
     * 根据标签名称查询（精确匹配）
     * 用于检查标签是否已存在
     */
    Optional<Tag> findByName(String name);
    
    /**
     * 根据标签名称模糊查询
     * 用于搜索标签
     */
    List<Tag> findByNameContaining(String keyword);

    void deleteById(Long id);
}