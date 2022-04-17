// pages/home-music/index.js
import {rankingStore, rankingObject,playerStore} from '../../store/index'

import {getBanners,  getSongMenu} from '../../service/music'
import  queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
// 节流
const throttleQueryRect = throttle(queryRect, 1000,{trailing: true})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    banners: [],
    // 轮播图高度
    swiperHeight: 0,
    // 歌曲推荐
    recommendSongs: [],
    // 热门歌单 
    hotSongMenu: [],
    // 推荐歌单
    recommendSongMenu: [],
    // 保存新歌、飙升、原创三榜单前3条数据的对象
    rankings: {0: {}, 2: {}, 3: {}},

    playSong: {},
    isPlaying: false,
    // 动画播放状态
    playAnimState: "paused"
  },

  // 事件处理
  // 点击搜索
  handleSearchClick() {
    // 跳转到搜索页面
    wx.navigateTo({
      url: '/pages/search-detail/index',
    })
  },
  // 图片加载完成
  handleSwiperImageLoad() {
    // 因为图片会做适配，所以实际要获取的是image组件的高度
    throttleQueryRect(".swiper-image").then(res=> {
      const rect = res[0]
      this.setData({swiperHeight: rect.height})
      // console.log("图片");
    })
  },

  // 点击更多- 推荐歌曲
  handleMoreClick(e) {
    // console.log(e);
    // wx.navigateTo({url: '/pages/songs-detail/index'})
    this.navigateToSongsDetailPage("hotRanking")
  },

  // 巅峰榜-榜单被点击
  handleRankingClick(e) {
    // console.log(e.currentTarget.dataset.idx);
    const idx = e.currentTarget.dataset.idx
    // console.log(idx, rankingObject);
    const rankingName = rankingObject[idx]
    this.navigateToSongsDetailPage(rankingName)
  },

  // 封装跳转函数
  navigateToSongsDetailPage(rankingName) {
    // 根据点击的区域传递不同参数
    // type 区分是歌单还是榜单
    wx.navigateTo({
      url: `/pages/songs-detail/index?rankingName=${rankingName}&type=rank`,
    })
  },
  // 网络数据
  getPageDatas() {
    // 轮播图数据
    getBanners().then(res=> {
      // setData是同步的还是异步的？
      // setData在设置data数据上，是同步的
      // 通过最新的数据对wxml进行渲染，渲染的过程是异步的
      this.setData({banners: res.banners})
    }),

    // 获取热门歌单数据 6条
    getSongMenu().then((res)=> {
      // console.log(res);
      this.setData({
        hotSongMenu: res.playlists
      })
    }),

    // 获取推荐歌单数据： 这里请求华语
    getSongMenu("华语").then(res=> {
      this.setData({
        recommendSongMenu: res.playlists
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据
    this.getPageDatas()

    // 获取共享数据
    rankingStore.dispatch("getRankingDataAction")

    // 从store获取共享的数据
    this.setupStoreListener()
  },

  /**
 * onUnload	Function	生命周期函数--监听页面卸载
 */
  onUnload: function(options) { 
    // 取消监听，这里不需要取消
    // rankingStore.offState("newRanking", this.getRankingHandler)
  },

  // =============  监听store ==========================
  setupStoreListener: function() {
    // 1. 排行榜监听
    // 从store获取共享数据并保存 : 热歌榜·
    rankingStore.onState("hotRanking", (res)=> {
      // 第一次拿到的是空对象
      // console.log(res);
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)// 只要前6条数据
      this.setData({recommendSongs})
    }),

    // 新歌榜、原创榜、飙升榜首页都只需要3条数据，封装方法获取共享数据
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("orignRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))

    // 2. 播放器监听
    playerStore.onStates(["songInfo","isPlaying"], ({songInfo,isPlaying})=> {
      if(songInfo) {
        this.setData({playSong: songInfo})
      }
      if(isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playAnimState: isPlaying ? "running":"paused"
        })
      }
    })
  },

  // 监听共享数据变化的回调
  getRankingHandler: function(idx) {
    return (res) => {
      // 先判断有无数据
      if(Object.keys(res).length === 0) return
      // console.log("idx", idx);
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankingObj = {...this.data.rankings, [idx]: rankingObj}
      this.setData({rankings: newRankingObj})
      // console.log(this.data.rankings);
    }
  },

  //  事件处理
  // 获取歌曲列表
  //  推荐歌曲-点击歌曲
  handleGetSongList: function(e) {
    // 获取被点击的歌曲索引
    const index = e.currentTarget.dataset.index
    // 把数据传递到共享数据里
    playerStore.setState("playListSongs", this.data.recommendSongs)
    playerStore.setState("playListIndex", index)
  },

  // 播放暂停
  handlePlayBtnClick: function() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },

  // 点击播放栏-进入播放页面
  handlePlayBarClick: function() {
    wx.navigateTo({
      url: '/pages/song-player/index?id=' + this.data.playSong.id,
    })
  }
})

