// pages/home-profile/index.js 
import {getUserInfo} from "../../service/login"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  handleGetUser: async function(event) {
    const result = await getUserInfo()
    console.log(result.userInfo)
    this.setData({userInfo: result.userInfo})
  },
  handleGetPhoneNumber: function(event) {
    console.log(event)
  }
})