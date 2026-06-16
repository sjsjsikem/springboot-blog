// 导入React核心Hook：useMemo用于性能优化，useState用于状态管理
import { useMemo, useState } from 'react'
// 导入路由导航Hook：用于跳转到文章详情页
import { useNavigate } from 'react-router-dom'
// 导入文章服务：用于调用后端搜索API
import articleService from '../services/articleService'

// 搜索字段选项配置
// 定义支持搜索的字段类型及对应的中文显示名称
const FIELD_OPTIONS = [
  { value: 'title', label: '标题' },
  { value: 'author', label: '作者' },
  { value: 'category', label: '分类' },
  { value: 'content', label: '内容' },
]

// 逻辑运算符选项配置
// 定义支持的逻辑关系：AND（同时满足）/ OR（任一满足）
const LOGIC_OPTIONS = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
]

/**
 * 创建新的搜索筛选器
 * @param {string} field - 搜索字段，默认值为'title'
 * @returns {Object} 新的筛选器对象
 */
function createFilter(field = 'title') {
  return {
    id: crypto.randomUUID(), // 生成唯一ID用于标识每个筛选器
    field, // 搜索字段（title/author/category/content）
    keyword: '', // 搜索关键词
    logic: 'and', // 逻辑运算符（and/or）
  }
}

/**
 * 搜索文章页面组件
 * 功能：提供多条件组合搜索功能，支持标题、作者、分类、内容的组合搜索
 */
function SearchArticle() {
  // 状态管理：搜索筛选器列表，初始值为包含一个默认筛选器的数组
  const [filters, setFilters] = useState([createFilter()])
  // 状态管理：当前打开的下拉菜单ID，用于控制下拉菜单的显示/隐藏
  const [openMenu, setOpenMenu] = useState(null)
  // 状态管理：搜索结果文章列表
  const [articles, setArticles] = useState([])
  // 状态管理：搜索加载状态
  const [loading, setLoading] = useState(false)
  // 状态管理：搜索错误信息
  const [error, setError] = useState(null)
  // 状态管理：是否已经执行过搜索操作
  const [hasSearched, setHasSearched] = useState(false)

  // 路由导航实例：用于跳转到文章详情页
  const navigate = useNavigate()

  /**
   * 性能优化：缓存已选中的字段列表
   * 使用useMemo避免每次渲染都重新计算，只有当filters变化时才重新计算
   * @returns {Array} 已选中的字段值数组
   */
  const selectedFields = useMemo(
    () => filters.map((filter) => filter.field),
    [filters]
  )

  /**
   * 获取字段值对应的中文显示名称
   * @param {string} value - 字段值（title/author/category/content）
   * @returns {string} 字段的中文显示名称
   */
  const getFieldLabel = (value) => {
    return FIELD_OPTIONS.find((option) => option.value === value)?.label || ''
  }

  /**
   * 获取下一个可用的搜索字段（未被选中的字段）
   * @returns {string|null} 可用字段值或null（所有字段都已被选中时）
   */
  const getNextAvailableField = () => {
    return FIELD_OPTIONS.find((option) => !selectedFields.includes(option.value))
      ?.value
  }

  /**
   * 更新指定筛选器的属性
   * @param {string} id - 筛选器ID
   * @param {string} key - 要更新的属性名（field/keyword/logic）
   * @param {string} value - 新的属性值
   */
  const updateFilter = (id, key, value) => {
    setFilters((currentFilters) =>
      currentFilters.map((filter) =>
        filter.id === id ? { ...filter, [key]: value } : filter
      )
    )
  }

  /**
   * 添加新的搜索筛选器
   * 规则：每个字段只能添加一次，最多添加4个筛选器（对应4个搜索字段）
   */
  const addFilter = () => {
    const nextField = getNextAvailableField()

    // 如果没有可用字段，直接返回
    if (!nextField) {
      return
    }

    // 添加新的筛选器到列表中
    setFilters((currentFilters) => [
      ...currentFilters,
      createFilter(nextField),
    ])
    // 关闭所有下拉菜单
    setOpenMenu(null)
  }

  /**
   * 删除指定的搜索筛选器
   * 规则：至少保留一个筛选器，不能删除最后一个
   * @param {string} id - 要删除的筛选器ID
   */
  const removeFilter = (id) => {
    setFilters((currentFilters) => {
      // 如果只剩最后一个筛选器，不允许删除
      if (currentFilters.length === 1) {
        return currentFilters
      }

      // 返回不包含要删除筛选器的新数组
      return currentFilters.filter((filter) => filter.id !== id)
    })
    // 关闭所有下拉菜单
    setOpenMenu(null)
  }

  /**
   * 解析后端返回的文章数据
   * 处理不同格式的响应数据，统一转换为文章数组格式
   * @param {Object|Array} response - 后端返回的响应数据
   * @returns {Array} 文章数组
   */
  const parseArticleResponse = (response) => {
    // 如果响应本身就是数组，直接返回
    if (Array.isArray(response)) {
      return response
    }

    // 如果响应是包含data字段的对象
    if (response?.data) {
      // 如果data字段是数组，直接返回
      if (Array.isArray(response.data)) {
        return response.data
      }

      // 如果data字段是分页对象，返回content数组
      if (Array.isArray(response.data.content)) {
        return response.data.content
      }
    }

    // 如果响应是分页对象，返回content数组
    if (Array.isArray(response?.content)) {
      return response.content
    }

    // 所有情况都不匹配时返回空数组
    return []
  }

  /**
   * 处理文章点击事件
   * 跳转到文章详情页
   * @param {number} id - 文章ID
   */
  const handleArticleClick = (id) => {
    navigate(`/article/${id}`)
  }

  /**
   * 处理搜索按钮点击事件
   * 根据筛选条件调用对应的后端API进行搜索
   */
  const handleSearch = async () => {
    // 格式化搜索条件，添加字段标签
    const searchConditions = filters.map((filter) => ({
      field: filter.field,
      fieldLabel: getFieldLabel(filter.field),
      keyword: filter.keyword.trim(),
      logic: filter.logic,
    }))

    console.log('高级搜索条件:', searchConditions)

    // 提取所有非空关键词
    const validConditions = searchConditions.filter(
      (condition) => condition.keyword
    )

    // 如果没有输入任何关键词，提示错误并返回
    if (validConditions.length === 0) {
      setArticles([])
      setHasSearched(true)
      setError('请输入搜索内容')
      return
    }

    try {
      // 设置加载状态为true
      setLoading(true)
      // 清除之前的错误信息
      setError(null)
      // 标记为已执行搜索
      setHasSearched(true)

      let response

      // 根据搜索条件数量选择不同的API
      if (validConditions.length === 1) {
        // 单条件搜索：使用基础搜索API
        const condition = validConditions[0]
        console.log('单条件搜索:', condition)

        // 根据字段类型调用不同的搜索方法
        switch (condition.field) {
          case 'title':
            response = await articleService.searchByTitle(condition.keyword)
            break
          case 'author':
            response = await articleService.searchByAuthor(condition.keyword)
            break
          case 'content':
            response = await articleService.searchByContent(condition.keyword)
            break
          case 'category':
            response = await articleService.searchByCategoryName(
              condition.keyword
            )
            break
          default:
            response = await articleService.searchArticle(condition.keyword)
        }
      } else {
        // 多条件搜索：使用多字段搜索API
        console.log('多条件搜索:', validConditions)

        // 提取所有关键词
        const keywords = validConditions.map((c) => c.keyword)
        const fields = validConditions.map((c) => c.field)

        // 检查是否包含分类搜索
        const hasCategory = fields.includes('category')

        if (hasCategory) {
          // 包含分类的多字段搜索
          const categoryCondition = validConditions.find(
            (c) => c.field === 'category'
          )
          const otherConditions = validConditions.filter(
            (c) => c.field !== 'category'
          )

          // 使用分类名称搜索
          response = await articleService.searchByCategoryName(
            categoryCondition.keyword,
            0,
            100
          )

          // 如果有其他条件，在客户端过滤
          if (otherConditions.length > 0) {
            const articles = parseArticleResponse(response)
            const filteredArticles = articles.filter((article) => {
              return otherConditions.every((condition) => {
                const keyword = condition.keyword.toLowerCase()
                switch (condition.field) {
                  case 'title':
                    return article.title?.toLowerCase().includes(keyword)
                  case 'author':
                    return article.author?.toLowerCase().includes(keyword)
                  case 'content':
                    return article.content?.toLowerCase().includes(keyword)
                  default:
                    return true
                }
              })
            })
            response = { data: filteredArticles }
          }
        } else {
          // 不包含分类的多字段搜索
          // 检查逻辑关系
          const logic = validConditions[0].logic

          if (logic === 'or') {
            // OR逻辑：任一条件满足即可
            response = await articleService.searchMultiField(keywords[0], 0, 100)
          } else {
            // AND逻辑：所有条件都要满足
            // 使用第一个关键词进行搜索，然后在客户端过滤其他条件
            response = await articleService.searchMultiField(keywords[0], 0, 100)

            const articles = parseArticleResponse(response)
            const filteredArticles = articles.filter((article) => {
              return validConditions.slice(1).every((condition) => {
                const keyword = condition.keyword.toLowerCase()
                switch (condition.field) {
                  case 'title':
                    return article.title?.toLowerCase().includes(keyword)
                  case 'author':
                    return article.author?.toLowerCase().includes(keyword)
                  case 'content':
                    return article.content?.toLowerCase().includes(keyword)
                  default:
                    return true
                }
              })
            })
            response = { data: filteredArticles }
          }
        }
      }

      // 解析响应数据并更新文章列表
      setArticles(parseArticleResponse(response))
    } catch (err) {
      // 捕获错误并记录日志
      console.error('搜索文章失败:', err)
      // 清空文章列表
      setArticles([])
      // 设置错误信息
      setError(err.message || '搜索文章失败')
    } finally {
      // 无论成功还是失败，都设置加载状态为false
      setLoading(false)
    }
  }

  // 计算是否可以添加更多筛选器（是否还有未被选中的字段）
  const canAddFilter = selectedFields.length < FIELD_OPTIONS.length

  return (
    <main className="search-article-page">
      <section className="search-panel">
        <div className="filter-list">
          {filters.map((filter, index) => {
            const fieldMenuId = `${filter.id}-field`
            const logicMenuId = `${filter.id}-logic`

            return (
              <div className="filter-row" key={filter.id}>
                <div className="action-button-wrapper">
                  {index === 0 ? (
                    <button
                      className="add-filter-button"
                      disabled={!canAddFilter}
                      type="button"
                      onClick={addFilter}
                    >
                      添加筛选条件
                    </button>
                  ) : (
                    <button
                      className="remove-filter-button"
                      type="button"
                      onClick={() => removeFilter(filter.id)}
                    >
                      删除
                    </button>
                  )}
                </div>

                <div className="search-input-wrapper">
                  <div className="custom-select field-select">
                    <button
                      className="select-trigger"
                      type="button"
                      onClick={() =>
                        setOpenMenu(openMenu === fieldMenuId ? null : fieldMenuId)
                      }
                    >
                      <span>{getFieldLabel(filter.field)}</span>
                      <span className="select-arrow" aria-hidden="true" />
                    </button>

                    {openMenu === fieldMenuId && (
                      <div className="select-menu">
                        {FIELD_OPTIONS.map((option) => {
                          const isUsedByOtherFilter = filters.some(
                            (item) =>
                              item.id !== filter.id &&
                              item.field === option.value
                          )

                          return (
                            <button
                              className="select-option"
                              disabled={isUsedByOtherFilter}
                              key={option.value}
                              type="button"
                              onClick={() => {
                                updateFilter(filter.id, 'field', option.value)
                                setOpenMenu(null)
                              }}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <input
                    className="search-input"
                    placeholder="请输入搜索内容"
                    type="text"
                    value={filter.keyword}
                    onChange={(event) =>
                      updateFilter(filter.id, 'keyword', event.target.value)
                    }
                  />

                  <div className="custom-select logic-select">
                    <button
                      className="select-trigger"
                      type="button"
                      onClick={() =>
                        setOpenMenu(openMenu === logicMenuId ? null : logicMenuId)
                      }
                    >
                      <span>{filter.logic}</span>
                      <span className="select-arrow" aria-hidden="true" />
                    </button>

                    {openMenu === logicMenuId && (
                      <div className="select-menu">
                        {LOGIC_OPTIONS.map((option) => (
                          <button
                            className="select-option"
                            key={option.value}
                            type="button"
                            onClick={() => {
                              updateFilter(filter.id, 'logic', option.value)
                              setOpenMenu(null)
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button className="search-button" type="button" onClick={handleSearch}>
          <span className="search-icon" aria-hidden="true" />
          <span>搜索</span>
        </button>
      </section>

      <section className="result-area">
        {!hasSearched && <div className="result-placeholder">搜索结果（文章列表形式）显示区</div>}

        {loading && <div className="result-placeholder">搜索中...</div>}

        {!loading && error && <div className="result-message error-message">{error}</div>}

        {!loading && !error && hasSearched && articles.length === 0 && (
          <div className="result-message">暂无匹配文章</div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="article-result-list">
            {articles.map((article) => (
              <article
                className="article-result-item"
                key={article.id}
                onClick={() => handleArticleClick(article.id)}
              >
                <h2>{article.title}</h2>
                <p>
                  {article.content?.substring(0, 160) ||
                    article.summary ||
                    '暂无摘要'}
                  ...
                </p>
                <div className="article-result-meta">
                  <span>作者：{article.author || '未知'}</span>
                  <span>
                    发布：
                    {article.createTime
                      ? new Date(article.createTime).toLocaleDateString('zh-CN')
                      : '未知'}
                  </span>
                  <span className="article-link-text">点击查看详情 →</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .search-article-page {
          box-sizing: border-box;
          width: 100%;
          min-height: calc(100vh - 90px);
          padding: 72px 86px 48px;
          background: #ffffff;
          color: #1f2329;
          text-align: left;
        }

        .search-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 102px;
          align-items: start;
          gap: 0 24px;
          max-width: 940px;
          margin: 0 auto 46px;
        }

        .search-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 96px;
          height: 44px;
          border: 0;
          border-radius: 999px;
          background: #5bd14f;
          color: #ffffff;
          font-size: 16px;
          cursor: pointer;
          margin-top: 0;
          white-space: nowrap;
        }

        .search-icon {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid #d5d5d5;
          border-radius: 50%;
          box-sizing: border-box;
        }

        .search-icon::after {
          content: '';
          position: absolute;
          right: -8px;
          bottom: -5px;
          width: 11px;
          height: 3px;
          background: #d5d5d5;
          border-radius: 3px;
          transform: rotate(45deg);
          transform-origin: left center;
        }

        .filter-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .filter-row {
          display: grid;
          grid-template-columns: 120px 140px minmax(260px, 480px) 78px;
          align-items: start;
          column-gap: 0;
          min-height: 44px;
        }

        .action-button-wrapper {
          grid-column: 1;
          margin-right: 24px;
        }

        .search-input-wrapper {
          grid-column: 2 / 5;
          display: flex;
          align-items: stretch;
        }

        .search-input-wrapper .custom-select {
          flex-shrink: 0;
        }

        .search-input-wrapper .field-select .select-trigger {
          border-right: 0;
          border-radius: 0;
        }

        .search-input-wrapper .search-input {
          flex: 1;
          border-radius: 0;
          border-left: 0;
          border-right: 0;
        }

        .search-input-wrapper .logic-select .select-trigger {
          border-left: 0;
          border-radius: 0;
        }

        .custom-select {
          position: relative;
          height: 44px;
        }

        .select-trigger,
        .search-input,
        .select-option {
          box-sizing: border-box;
          height: 44px;
          border: 1px solid #d2d2d2;
          background: #ffffff;
          color: #1f2329;
          font: inherit;
        }

        .select-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 26px;
          width: 100%;
          cursor: pointer;
        }

        .field-select .select-trigger {
          font-size: 17px;
        }

        .logic-select .select-trigger {
          gap: 12px;
          font-size: 16px;
          text-transform: lowercase;
        }

        .select-arrow {
          width: 17px;
          height: 17px;
          border-right: 4px solid #b7bcc2;
          border-bottom: 4px solid #b7bcc2;
          transform: rotate(45deg) translateY(-4px);
          flex: 0 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 0 48px;
          font-size: 27px;
          color: #1f2329;
          outline: none;
        }

        .search-input::placeholder {
          color: #8f98a3;
        }

        .select-menu {
          position: absolute;
          top: 43px;
          left: 0;
          z-index: 10;
          width: 100%;
          background: #ffffff;
        }

        .select-option {
          display: block;
          width: 100%;
          border-top: 0;
          font-size: 17px;
          cursor: pointer;
        }

        .logic-select .select-option {
          font-size: 17px;
          text-transform: lowercase;
        }

        .select-option:disabled {
          color: #b7bcc2;
          cursor: not-allowed;
          background: #f7f7f7;
        }

        .select-option:not(:disabled):hover,
        .select-trigger:hover {
          background: #f8fbff;
        }

        .add-filter-button,
        .remove-filter-button {
          justify-self: end;
          width: 96px;
          min-height: 44px;
          border: 0;
          border-radius: 999px;
          color: #ffffff;
          font-size: 14px;
          line-height: 1.2;
          cursor: pointer;
          padding: 0 18px;
        }

        .add-filter-button {
          background: #477df3;
        }

        .add-filter-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .remove-filter-button {
          background: #dc3545;
        }

        .result-area {
          box-sizing: border-box;
          max-width: 940px;
          min-height: 590px;
          margin: 0 auto;
          padding: 28px;
          border: 2px solid #c1c6cc;
          background: #f1f2f4;
          color: #1f2329;
          text-align: center;
        }

        .result-placeholder,
        .result-message {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 530px;
          font-size: 34px;
        }

        .error-message {
          color: #dc3545;
        }

        .article-result-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          text-align: left;
        }

        .article-result-item {
          padding: 20px;
          background: #ffffff;
          border: 1px solid #dddddd;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
        }

        .article-result-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .article-result-item h2 {
          margin: 0 0 10px;
          color: #007bff;
          font-size: 20px;
        }

        .article-result-item p {
          margin: 0 0 15px;
          color: #666666;
          line-height: 1.6;
        }

        .article-result-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          color: #999999;
          font-size: 14px;
        }

        .article-link-text {
          color: #007bff;
        }

        @media (max-width: 900px) {
          .search-article-page {
            padding: 32px 18px;
          }

          .search-panel {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .filter-row {
            grid-template-columns: 112px minmax(0, 1fr) 72px;
            row-gap: 12px;
          }

          .search-button {
            width: 104px;
          }

          .add-filter-button,
          .remove-filter-button {
            grid-column: 1 / -1;
            justify-self: start;
            width: 124px;
          }

          .search-input {
            padding: 0 18px;
            font-size: 20px;
          }

          .result-area {
            min-height: 420px;
            padding: 24px;
          }

          .result-placeholder,
          .result-message {
            min-height: 360px;
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  )
}

export default SearchArticle
