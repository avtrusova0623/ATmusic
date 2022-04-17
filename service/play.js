import atRequest from './index'

// 根据id请求歌曲详情
export function getSongDetail(ids) {
  return atRequest.get("/song/detail", {
    ids
  })
}

// 请求歌词
export function getSongLyric(id) {
  return atRequest.get("/lyric", {
    id
  })
}