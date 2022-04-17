// components/song-menu-v1/index.js
// 获取app实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    songMenu: {
      type: Array,
      value: []
    }
},
  /**
   * 组件的初始数据
   */
  data: {
    // 屏幕宽度
    screenWidth: app.globalData.screenWidth,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 歌单被点击
    handleMenuClick(e) {
      // console.log(e.currentTarget.dataset.item);
      // 传递歌单id
      const item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/songs-detail/index?id=${item.id}&type=menu`,
      })
    },

    // 歌单更多
    handleMenuMoreClick(e) {
      // 跳转
      wx.navigateTo({
        url: `/pages/menu-more/index`,
      })
    }
  }
})
