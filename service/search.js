import atRequest from './index'

// 请求热门的数据
export function getHotSearch() {
  return atRequest.get("/search/hot")
}

// 请求搜索建议的接口
export function getSuggestions(keywords) {
  return atRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

// 请求搜索结果
export function getSearchResult(keywords) {
  return atRequest.get("/search", {
    keywords
  })
}