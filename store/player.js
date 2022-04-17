import {HYEventStore} from "hy-event-store"
import {getSongDetail, getSongLyric} from "../service/play"
import {parseLyric} from "../utils/parse-lyric"

// 前台播放器
// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager() // 背景音频管理器,小程序切入后台，如果音频处于播放状态，可以继续播放



const playerStore = new HYEventStore({
  state: {
    id: 0,
    songInfo: {},
    // 歌曲总时长
    durationTime: 0,
    // 歌词信息
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    // 播放模式
    playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放

    // 歌曲是否播放
    isPlaying: false,

    // 播放列表所有歌曲
    playListSongs: [],
    playListIndex: 0,

    // 歌曲是否第一次播放
    isFirstPlay: true,
    // 音乐是否停止
    isStoping: false
  },
  actions: {

    //  ================== 1. 请求数据,播放音乐=====================
    playMusicWithSongIdAction(ctx, {id, isRefresh = false}) {
      // 判断是否同一首歌
      if(ctx.id === id && !isRefresh) {
        // 如果传进来的id与保存的id一致，者两次点击的是同一首
        this.dispatch("changeMusicPlayStatusAction", true)
        return 
      }

      ctx.id = id
      // 0. 播放状态
      // 清空上一首歌曲信息
      ctx.isPlaying = true
      ctx.songInfo = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""

      // 1. 请求数据
      // 请求歌曲数据
      getSongDetail(id).then(res=> {
        ctx.songInfo = res.songs[0],
        ctx.durationTime = res.songs[0].dt
        // 请求到歌曲信息后，把title设置为歌曲名称
        audioContext.title = res.songs[0].name
      })
      // 歌词
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })

      // 2. 根据id播放歌曲
      // 停止前一首
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      // 后台播放音乐，必须设置title
      audioContext.title = id
      // 播放
      audioContext.autoplay = true

      // 3. 监听audioContext
      if(ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
      
    },

    // ==================== 2. 监听播放器事件 ======================
    setupAudioContextListenerAction(ctx) {
      // 1. =============== 监听歌曲可以播放=============
      audioContext.onCanplay(()=> {
        audioContext.play()
      })

      // 2. =============  歌曲当前时间获取:监听时间变化 ===============
     audioContext.onTimeUpdate(()=> {
       //  1. 获取当前时间
       const currentTime = audioContext.currentTime * 1000

       // 2.根据当前时间修改currentTime
       ctx.currentTime = currentTime

       //  3. 根据当前时间查找播放歌词 
       // 遍历所有歌词，比较时间
       if (!ctx.lyricInfos.length) return
       let i = 0
       for (; i < ctx.lyricInfos.length; i++) {
         const lyricInfo = ctx.lyricInfos[i]
         if (currentTime < lyricInfo.time) {
           // 找到比当前时间大的就停止遍历
           break
         }
       }
       // 设置当前歌词的索引和内容
       const currentIndex = i - 1
       if (ctx.currentLyricIndex !== currentIndex) {
         const currentLyricInfo =ctx.lyricInfos [currentIndex]
           ctx.currentLyricText = currentLyricInfo.text
           ctx.currentLyricIndex = currentIndex 
         
       }
     })

      // 3. ===============  监听歌曲播放完成 ================
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })

      // 4 ==================== 监听音乐播放-暂停-停止 ============ 
      // 播放
      audioContext.onPlay(()=> {
        ctx.isPlaying = true
      })
      // 暂停
      audioContext.onPause(()=> {
        ctx.isPlaying = false
      })
      // 停止
      audioContext.onStop(()=> {
        /**
         * 当检测到音乐停止后，再次点击播放按钮，不会在播放音乐
         * 歌曲数据已经被清空
         * 需要在播放歌曲时(changeMusicPlayStatusAction)重新设置src
         */
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },

    // =======================3. 播放-暂停 ============================
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      // 重新设置src
      if(ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = id
        // 重设歌曲播放状态
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play(): audioContext.pause()
    },

    // =========================4. 上一首、下一首 ========================
    // isNext为ture则代表下一首
    changeNewMusicAction(ctx, isNext = true) {
      // 1.获取当前索引
      let index = ctx.playListIndex

      // 2.根据不同的播放模式, 获取下一首歌的索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1: index -1
          if (index === -1) index = ctx.playListSongs.length - 1
          if (index === ctx.playListSongs.length) index = 0
          break
        case 1: // 单曲循环
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }

      // console.log(index)

      // 3.获取歌曲
      let songInfo = ctx.playListSongs[index]
      if (!songInfo) {
        songInfo = ctx.songInfo
      } else {
        // 记录最新的索引
        ctx.playListIndex = index
      }

      // console.log(songInfo);

      // 4.播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", { id: songInfo.id, isRefresh: true })
    }
  }
})

export {
  audioContext,
  playerStore
}