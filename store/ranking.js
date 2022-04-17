// 榜单数据
import {HYEventStore} from 'hy-event-store'

const rankingObject = {0: "newRanking", 1: "hotRanking", 2: "orignRanking", 3: "upRanking"}

// 引入网络请求方法
import {getRankings} from '../service/music'

const rankingStore = new HYEventStore({
  state: {
    // 0: 新歌榜
    newRanking: {},
    // 1: 热歌榜
    hotRanking: {},
    // 2: 原创榜
    orignRanking: {},
    // 3: 飙升榜
    upRanking: {},
  },
  actions: {
    getRankingDataAction(ctx) {
      for(let i = 0; i < 4; i++) {
        getRankings(i).then((res)=> {
          const rankingName = rankingObject[i]
          ctx[rankingName] = res.playlist
          //  console.log(i , res.playlist);
        })
      }
    }
  }
})

export {
  rankingStore,
  rankingObject
}