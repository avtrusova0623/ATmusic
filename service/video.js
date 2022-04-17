import atRequest from './index'

// 请求mv数据
export function getTopMV(offset, limit = 10) {
  return atRequest.get("/top/mv", {
    offset,
    limit
  })
}

/**
 * 请求mv的播放地址
 * @param {number} id  mv对应的id
 */
export function getMVURL(id) {
  return atRequest.get("/mv/url",{
    id
  })
}
/**
 * 请求mv的详情
 * @param {number} mvid 
 */
export function getMVDetail(mvid) {
  return atRequest.get("/mv/detail",{
    mvid
  })
}
/**
 * 请求mv相关视频
 * @param {number} id  number是id类型
 */
export function getRelatedVideo(id) {
  return atRequest.get("/related/allvideo",{
    id
  })
}
