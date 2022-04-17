// pages/home-video/index.js
// 引入请求数据的方法数据
import { getTopMV } from '../../service/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    // 是否刷新数据
    hasMore: true
  },

  // 自定义事件
  // 点击事件的回调
  handleVideoClick(event) {
    // 获取mv的id
    const id = event.target.dataset.item.id
    // console.log(id);
    // 页面跳转
    wx.navigateTo({
      // url: '/pages/video-detail/index?id=' + id
      url: `/pages/video-detail/index?id=${id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function (options) {
    // getTopMV(0).then(res=> {
    //   this.setData({ topMVs: res.data})
    // })
    this.getTopMVData(0)
  },

  // 封装网络请求的方法
  getTopMVData: async function(offset) {
    // 判断是否可以请求
    if (!this.data.hasMore) return

    // 展示加载动画
    wx.showNavigationBarLoading()

    // 真正请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMVs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }

    // 设置数据
    this.setData({ topMVs: newData })
    this.setData({ hasMore: res.hasMore })
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  // 其他的生命周期回调函数
  //  监听用户下拉动作
  onPullDownRefresh: async function() {
    // const res = await getTopMV(0)
    // this.setData({ topMVs: res.data })
    this.getTopMVData(0)
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: async function() {
    // if (!this.data.hasMore) return
    // const res = await getTopMV(this.data.topMVs.length)
    // this.setData({ topMVs: this.data.topMVs.concat(res.data) })
    // this.setData({ hasMore: res.hasMore })
    this.getTopMVData(this.data.topMVs.length)
  }
})