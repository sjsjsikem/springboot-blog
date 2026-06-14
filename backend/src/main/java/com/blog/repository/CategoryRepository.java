package com.blog.repository;

import com.blog.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * 分类 Repository
 * 
 * 继承 JpaRepository，自动获得基本的增删改查方法
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * 按排序序号升序查询所有分类
     * 
     * @return 分类列表（按 sortOrder 从小到大排序）
     * 
     * 方法命名规则：
     * findAll - 查询所有
     * By - 条件（这里没有条件）
     * OrderBySortOrderAsc - 按 sortOrder 字段升序排序
     */
    List<Category> findAllByOrderBySortOrderAsc();
}
