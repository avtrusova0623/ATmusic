// baseui/nav-bar/index.js
Component({
  options: {
    // 启用多个插槽
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    narBarHeight:  getApp().globalData.narBarHeight
  },

  // 组件生命周期
  // lifetimes: {
  //   ready: function() {
  //     const info  = wx.getSystemInfoSync()
  //     console.log(info);
  //     // statusBarHeight 状态栏的高度
  //   }
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回
    handleLeftClick: function() {
      this.triggerEvent("click")
    }
  }
})
