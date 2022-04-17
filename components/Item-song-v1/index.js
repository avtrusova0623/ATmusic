// components/Item-song-v1/index.js
import {playerStore} from "../../store/index"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击歌曲
    handleSongClick(e) {
      // 保存歌曲id
      const id = e.currentTarget.dataset.item.id
      // console.log(e.currentTarget.dataset.item);
      // 1. 跳转页面
      wx.navigateTo({
        url: `/pages/song-player/index?id=${id}`,
      })
      // 2. 请求歌曲信息和其他操作
      playerStore.dispatch("playMusicWithSongIdAction", {id})
    }
  }
})
