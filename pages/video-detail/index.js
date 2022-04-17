// pages/video-detail/index.js
import {getMVURL,getMVDetail,getRelatedVideo} from '../../service/video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 视频播放地址
    videoURLs: [],
    // 视频详细数据
    videoDtail: [],
    // 相关视频
    relatedVideos: []
  },

  // 请求数据的方法
  getVideoDatas(id) {
    // 请求播放地址
    getMVURL(id).then(res=> {
      this.setData({
        videoURLs: res.data
      })
    })
    // 请求视频信息
    getMVDetail(id).then(res=> {
      this.setData({
        videoDtail: res.data
      })
    })
    // 请求相关视频
    getRelatedVideo(id).then(res=> {
      this.setData({
        relatedVideos: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options包含页面跳转传进来的参数
    // 获取传入的id
    const id = options.id
    // 获取页面的数据
    this.getVideoDatas(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})