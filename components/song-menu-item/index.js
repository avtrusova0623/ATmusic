// components/song-menu-item/index.js
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
    handleClick() {
      const id = this.properties.item.id
      wx.navigateTo({
        url: `/pages/songs-detail/index?type=menu&id=${id}`,
      })
    }
  }
})
