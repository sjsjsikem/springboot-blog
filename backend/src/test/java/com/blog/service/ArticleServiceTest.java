package com.blog.service;

import com.blog.entity.Article;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.ArticleRepository;
import com.blog.dto.ArticleCreateRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * 文章 Service 层单元测试
 *
 * 测试目标：
 * 1. 测试 Service 层业务逻辑
 * 2. 使用 Mockito 模拟 Repository
 * 3. 不需要真实数据库
 *
 * 核心注解：
 * - @ExtendWith(MockitoExtension)：启用 Mockito
 * - @Mock：创建模拟对象
 * - @InjectMocks：创建被测试对象并注入模拟依赖
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("文章 Service 层测试")
class ArticleServiceTest {

    /**
     * 模拟的 Repository
     *
     * @Mock 的作用：
     * - 创建一个 ArticleRepository 的模拟对象
     * - 所有方法调用都不会真正执行
     * - 可以通过 when().thenReturn() 定义行为
     */
    @Mock
    private ArticleRepository articleRepository;

    /**
     * 被测试的 Service
     *
     * @InjectMocks 的作用：
     * - 创建 ArticleService 实例
     * - 自动将@Mock 标注的对象注入到 Service 中
     * - 相当于：new ArticleService(articleRepository)
     */
    @InjectMocks
    private ArticleService articleService;

    /**
     * 测试数据
     */
    private Article testArticle;

    /**
     * 每个测试方法之前执行
     *
     * @BeforeEach 的作用：
     * - 初始化测试数据
     * - 确保每个测试方法都在相同的环境下运行
     */
    @BeforeEach
    void setUp() {
        // 创建测试文章
        testArticle = new Article();
        testArticle.setId(1L);
        testArticle.setTitle("测试文章");
        testArticle.setContent("这是测试内容");
        testArticle.setAuthor("测试作者");
    }

    /**
     * 测试：查询所有文章
     */
    @Test
    @DisplayName("查询所有文章 - 返回文章列表")
    void testFindAll() {
        // 准备测试数据
        List<Article> articles = new ArrayList<>();
        articles.add(testArticle);
        articles.add(new Article());

        // 定义模拟行为：当调用 repository.findAll() 时，返回 articles 列表
        when(articleRepository.findAll()).thenReturn(articles);

        // 执行测试
        List<Article> result = articleService.findAll();

        // 验证结果
        assertNotNull(result);
        assertEquals(2, result.size());

        // 验证 repository.findAll() 方法被调用了一次
        verify(articleRepository, times(1)).findAll();
    }

    /**
     * 测试：根据 ID 查询文章 - 成功
     */
    @Test
    @DisplayName("根据 ID 查询文章 - 文章存在")
    void testFindById_Success() {
        // 定义模拟行为：当调用 repository.findById(1L) 时，返回 testArticle
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));

        // 执行测试
        Article result = articleService.findById(1L);

        // 验证结果
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("测试文章", result.getTitle());

        // 验证 repository.findById() 方法被调用了一次
        verify(articleRepository, times(1)).findById(1L);
    }

    /**
     * 测试：根据 ID 查询文章 - 文章不存在
     */
    @Test
    @DisplayName("根据 ID 查询文章 - 文章不存在，抛出异常")
    void testFindById_NotFound() {
        // 定义模拟行为：当调用 repository.findById(999L) 时，返回空 Optional
        when(articleRepository.findById(999L)).thenReturn(Optional.empty());

        // 执行测试并验证异常
        ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> articleService.findById(999L)
        );

        // 验证异常消息
        assertEquals("文章不存在，ID = 999", exception.getMessage());

        // 验证 repository.findById() 方法被调用了一次
        verify(articleRepository, times(1)).findById(999L);
    }

    /**
     * 测试：创建文章 - 成功
     */
    @Test
    @DisplayName("创建文章 - 成功")
    void testCreate_Success() {
        // 准备测试数据
        ArticleCreateRequest request = new ArticleCreateRequest();
        request.setTitle("新文章");
        request.setContent("新内容");
        request.setAuthor("新作者");

        // 准备保存后的文章对象
        Article savedArticle = new Article();
        savedArticle.setId(2L);
        savedArticle.setTitle("新文章");
        savedArticle.setContent("新内容");
        savedArticle.setAuthor("新作者");

        // 定义模拟行为：当调用 repository.save(any()) 时，返回保存后的文章
        // any() 表示匹配任意参数
        when(articleRepository.save(any(Article.class))).thenReturn(savedArticle);

        // 执行测试
        Article result = articleService.create(request);

        // 验证结果
        assertNotNull(result);
        assertEquals("新文章", result.getTitle());
        assertEquals(2L, result.getId());

        // 验证 repository.save() 方法被调用了一次
        verify(articleRepository, times(1)).save(any(Article.class));
    }

    /**
     * 测试：创建文章 - 标题为空
     */
    @Test
    @DisplayName("创建文章 - 标题为空，抛出异常")
    void testCreate_EmptyTitle() {
        // 准备测试数据（标题为空）
        ArticleCreateRequest request = new ArticleCreateRequest();
        request.setTitle("");
        request.setContent("内容");
        request.setAuthor("作者");

        // 执行测试并验证异常
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> articleService.create(request)
        );

        // 验证异常消息
        assertEquals("文章标题不能为空", exception.getMessage());

        // 验证 repository.save() 方法从未被调用（因为验证失败就抛异常了）
        verify(articleRepository, never()).save(any());
    }

    /**
     * 测试：删除文章 - 成功
     */
    @Test
    @DisplayName("删除文章 - 成功")
    void testDeleteById_Success() {
        // 定义模拟行为：先查询到文章，然后删除
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));
        doNothing().when(articleRepository).deleteById(1L);

        // 执行测试
        articleService.deleteById(1L);

        // 验证 repository.deleteById() 方法被调用了一次
        verify(articleRepository, times(1)).deleteById(1L);
    }
}
