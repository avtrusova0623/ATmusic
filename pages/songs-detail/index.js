// pages/songs-detail/index.js
import {rankingStore,playerStore} from "../../store/index"
import {getSongMenuDetail} from "../../service/music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 保存榜单名称
    rankingName: '',
    // 歌曲信息
    songInfo: {},
    // 歌单or榜单
    type: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断被点击的是哪个榜单,请求保存榜单数据并展示
    const type = options.type
    this.setData({type})
    // 判断
    if(type === "rank") {
      const rankingName = options.rankingName
      this.setData({rankingName})
      // 请求数据，store共享数据
      rankingStore.onState(rankingName, this.getRankingNameDatas)
    } else if(type === "menu") {
      const id = options.id
      // 请求歌单详情数据
      getSongMenuDetail(id).then(res=> {
        this.setData({songInfo: res.playlist})
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面关闭时，取消共享数据的监听
    if(this.data.type === "rank") {
      rankingStore.offState(this.data.rankingName, this.getRankingNameDatas)
    }
    
  },

  // 事件处理
  getRankingNameDatas: function(res) {
    // 保存榜单数据
    this.setData({songInfo: res})
  },

  // 获取歌曲列表
  handleGetSongList:function(e) {
    // 获取被点击的歌曲索引
    const index = e.currentTarget.dataset.index
    // 把数据传递到共享数据里
    playerStore.setState("playListSongs", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)
  }
})