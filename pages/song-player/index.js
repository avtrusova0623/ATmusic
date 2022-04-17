// pages/song-player/index.js
import {getSongDetail, getSongLyric} from '../../service/play'
import {audioContext,playerStore} from "../../store/index"
import {parseLyric} from "../../utils/parse-lyric"

// 歌曲模式数组
const playModeNames = ["order", "repeat", "random"]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    // songInfo: {},
    // 歌曲总时长
    // durationTime: 0,
    // 歌词信息
    // lyricInfos: [],

    // 歌曲当前播放时间
    // currentTime: 0,
    // currentLyricIndex: 0,
    // currentLyricText: "",

    // 歌曲模式
    playModeIndex: 0,
    playModeName: "order",

    // 播放状态
    isPlaying: false,
    playingName: "pause", 

    // 播放列表
    playList: [],

    // 当前页数
    currentPage: 0,
    // 内容高度
    contentHeight: 0,
    isShowLyric: true,
    // 进度条当前值
    sliderValue: 0,
    // 进度条是否正在拖动中
    isSliderChanging: false,
    // 歌曲播放时动态计算当前播放的item index乘以文字的高度
    lyricScrollTop: 0,

    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1. 保存歌曲id
    const id = options.id
    this.setData({id})
    // 2.  请求数据
    // this.getPageData(id)
    this.setupPlayerStoreListener()

    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    const aspectRatio = globalData.aspectRatio
    this.setData({ contentHeight,isShowLyric: aspectRatio >= 2 })

    // 4.播放歌曲
    // 停止前一首
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // // 双重保险播放
    // audioContext.autoplay = true


    // 监听歌曲可以播放
    // audioContext.onCanplay(()=> {
    //   audioContext.play()
    // })


    // 5.audioContext的事件监听
    // this.setupAudioContextListener()
  },


  //  ======================== audio监听 ===============================
  // setupAudioContextListener: function() {
  //   // 歌曲当前时间获取:监听时间变化
  //   audioContext.onTimeUpdate(()=> {
  //     //  1. 获取当前时间
  //     const currentTime = audioContext.currentTime * 1000
  //     // 2. 判断： 当进度条没有点击或拖动时,更新播放时间和进度条值
  //     if(!this.data.isSliderChanging) {
  //       // 进度条值更新
  //       const sliderValue = currentTime / this.data.durationTime * 100
  //       this.setData({currentTime, sliderValue})
  //     }

  //     //  3. 根据当前时间查找播放歌词
  //     let i = 0
  //     // 遍历所有歌词，比较时间
  //     for (; i < this.data.lyricInfos.length; i++) {
  //       const lyricInfo = this.data.lyricInfos[i]
  //       if (currentTime < lyricInfo.time) {
  //         // 找到比当前时间大的就停止遍历
  //         break
  //       }
  //     }
  //     // 设置当前歌词的索引和内容
  //     const currentIndex = i - 1
  //     if(!this.data.lyricInfos.length) return 
  //     if (this.data.currentLyricIndex !== currentIndex) {
  //       const currentLyricInfo = this.data.lyricInfos[currentIndex]
  //       this.setData({ 
  //         currentLyricText: currentLyricInfo.text,
  //         currentLyricIndex: currentIndex ,
  //         // 35是设置歌词时固定的值
  //         lyricScrollTop: currentIndex * 35
  //       })
  //     }
  //   })
  // },

  //  ======================== 网络请求 ===============================
  // getPageData: function(id) {
  //   // 请求歌曲数据
  //   getSongDetail(id).then(res=> {
  //     // console.log(res.songs[0]);
  //     this.setData({songInfo: res.songs[0],durationTime: res.songs[0].dt})
  //   })
  //   // 歌词
  //   getSongLyric(id).then(res => {
  //     const lyricString = res.lrc.lyric
  //     const lyrics = parseLyric(lyricString)
  //     // console.log(lyrics)
  //     this.setData({ lyricInfos: lyrics })
  //   })
  // },

  // ======================== 页面左右滑动 ===============================
  handlePageChange: function(e) {
    const current = e.detail.current
    this.setData({currentPage: current})
  },

  // ======================== 进度条点击事件处理 ===============================
  handleSliderChange: function(e) {
    // 1.获取slider变化的值
    const value = e.detail.value

    // 2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100

    // 3.设置context播放currentTime位置的音乐
    // audioContext.pause()// 暂停一下
    audioContext.seek(currentTime / 1000)

    // 4.记录最新的sliderValue, 并且需要讲isSliderChaning设置回false
    this.setData({ sliderValue: value, isSliderChanging: false })
  },

   // ========================  进度条拖动事件--正在拖动中 ===============================
  handleSliderChanging: function(e) {
    // 1.获取slider变化的值
    const value = e.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({isSliderChanging: true, currentTime})
  },

  // ============================ 左边返回事件 ===============================
  handleBackClick: function() {
    wx.navigateBack()
  },

  // ========================== 歌曲模式 ===============================
  handleModeChangeClick: function() {
    // 切换模式
    // 计算新的playModeIndex： 点击一次加1
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    // 设置playerStore中的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex)
  },

  // ========================= 歌曲播放状态 ============================
  handlePlayBtnClick: function() {
    playerStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
  },

  // =========================  上一首 =====================================
  handlePrevBtnClick:function() {
    playerStore.dispatch("changeNewMusicAction", false)
  },
  // =========================  下一首 =====================================
  handleNextBtnClick: function() {
    playerStore.dispatch("changeNewMusicAction")
  },

  // ========================= 显示播放列表 =========================================
  handlePlayListClick: function() {
    this.setData({show: true})
  },
  //  关闭
  onClose: function() {
    this.setData({show: false})
  },
  // ======================== 监听有关playerstore ===============================
  setupPlayerStoreListener: function() {
    // 1. 监听"songInfo","durationTime","lyricInfos"
    playerStore.onStates(["songInfo","durationTime","lyricInfos"], 
    ({songInfo,durationTime,lyricInfos}) => {
      if(songInfo) this.setData({songInfo})
      if(durationTime) this.setData({durationTime})
      if(lyricInfos) this.setData({lyricInfos})
    }),

    // 2.  监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词滚动变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    }),

    // 3. 歌曲模式监听
    playerStore.onStates(["playModeIndex","isPlaying"], ({playModeIndex,isPlaying})=> {
      if (playModeIndex !== undefined) {
        this.setData({ 
          playModeIndex, 
          playModeName: playModeNames[playModeIndex] 
        })
      }
      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying,
          playingName: isPlaying ? "pause": "resume" 
        })
      }
    }),

    // 4. 监听歌曲播放列表
    playerStore.onStates(["playListSongs"],({playListSongs})=> {
      if(playListSongs) {
        this.setData({playList: playListSongs})
      }
    })
  }
})