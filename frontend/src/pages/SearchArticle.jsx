import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import articleService from '../services/articleService'

const FIELD_OPTIONS = [
  { value: 'title', label: '标题' },
  { value: 'author', label: '作者' },
  { value: 'category', label: '分类' },
  { value: 'content', label: '内容' },
]

const LOGIC_OPTIONS = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
]

function createFilter(field = 'title') {
  return {
    id: crypto.randomUUID(),
    field,
    keyword: '',
    logic: 'and',
  }
}

function SearchArticle() {
  const [filters, setFilters] = useState([createFilter()])
  const [openMenu, setOpenMenu] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const navigate = useNavigate()

  const selectedFields = useMemo(
    () => filters.map((filter) => filter.field),
    [filters]
  )

  const getFieldLabel = (value) => {
    return FIELD_OPTIONS.find((option) => option.value === value)?.label || ''
  }

  const getNextAvailableField = () => {
    return FIELD_OPTIONS.find((option) => !selectedFields.includes(option.value))
      ?.value
  }

  const updateFilter = (id, key, value) => {
    setFilters((currentFilters) =>
      currentFilters.map((filter) =>
        filter.id === id ? { ...filter, [key]: value } : filter
      )
    )
  }

  const addFilter = () => {
    const nextField = getNextAvailableField()

    if (!nextField) {
      return
    }

    setFilters((currentFilters) => [
      ...currentFilters,
      createFilter(nextField),
    ])
    setOpenMenu(null)
  }

  const removeFilter = (id) => {
    setFilters((currentFilters) => {
      if (currentFilters.length === 1) {
        return currentFilters
      }

      return currentFilters.filter((filter) => filter.id !== id)
    })
    setOpenMenu(null)
  }

  const parseArticleResponse = (response) => {
    if (Array.isArray(response)) {
      return response
    }

    if (response?.data) {
      if (Array.isArray(response.data)) {
        return response.data
      }

      if (Array.isArray(response.data.content)) {
        return response.data.content
      }
    }

    if (Array.isArray(response?.content)) {
      return response.content
    }

    return []
  }

  const handleArticleClick = (id) => {
    navigate(`/article/${id}`)
  }

  const handleSearch = async () => {
    const searchConditions = filters.map((filter) => ({
      field: filter.field,
      fieldLabel: getFieldLabel(filter.field),
      keyword: filter.keyword.trim(),
      logic: filter.logic,
    }))

    console.log('高级搜索条件:', searchConditions)

    const keyword = searchConditions
      .map((condition) => condition.keyword)
      .filter(Boolean)
      .join(' ')

    if (!keyword) {
      setArticles([])
      setHasSearched(true)
      setError('请输入搜索内容')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setHasSearched(true)

      const response = await articleService.searchArticle(keyword)
      setArticles(parseArticleResponse(response))
    } catch (err) {
      console.error('搜索文章失败:', err)
      setArticles([])
      setError(err.message || '搜索文章失败')
    } finally {
      setLoading(false)
    }
  }

  const canAddFilter = selectedFields.length < FIELD_OPTIONS.length

  return (
    <main className="search-article-page">
      <section className="search-panel">
        <button className="search-button" type="button" onClick={handleSearch}>
          <span className="search-icon" aria-hidden="true" />
          <span>搜索</span>
        </button>

        <div className="filter-list">
          {filters.map((filter, index) => {
            const fieldMenuId = `${filter.id}-field`
            const logicMenuId = `${filter.id}-logic`

            return (
              <div className="filter-row" key={filter.id}>
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
            )
          })}
        </div>
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
          grid-template-columns: 102px minmax(0, 1fr);
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
          grid-template-columns: 140px minmax(260px, 480px) 78px 104px;
          align-items: start;
          column-gap: 0;
          min-height: 44px;
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
