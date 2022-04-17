import atRequest from './index'

// 请求轮播图的数据
export function getBanners() {
  return atRequest.get("/banner", {
    type: 2
  })
}

// 请求榜单的数据
export function getRankings(idx) {
  return atRequest.get("/top/list", {
    idx
  })
}

// 获取全部歌单 - 热门歌单   华语等
export function getSongMenu(cat="全部", limit=6, offset=0) {
  return atRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

// 热门歌单分类
export function getHotMenuCateTags() {
  return atRequest.get("/playlist/hot")
}

// 歌单详情
export function getSongMenuDetail(id) {
  return atRequest.get("/playlist/detail/dynamic", {
    id
  })
}
