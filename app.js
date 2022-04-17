// app.js
import {getLoginCode,codeToToken,checkToken,checkSession} from "./service/login"

import {TOKEN_KEY} from "./constants/token-const"
App({
  // 全局对象
  globalData: {
    // 保存屏幕宽度和高度
    screenWidth: 0,
    screenHeight: 0,
    // 设备导航栏高度
    statusBarHeight: 0,
    // 自定义导航栏高度
    navBarHeight: 44,
    aspectRatio: 0
  },
  /**
   * onLaunch(Object object)
   * 小程序初始化完成时触发，全局只触发一次
   */
  onLaunch: function() {
    // wx.getSystemInfoSync()获取设备信息
    // ================= 1. 获取设备的信息 ====================
    const info = wx.getSystemInfoSync()
    // console.log(info);
    // 保存设备宽高
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    // 导航高度
    this.globalData.statusBarHeight = info.statusBarHeight
    // 设备宽高比
    const aspectRatio = info.screenHeight / info.screenWidth
    this.globalData.aspectRatio = aspectRatio


    //  ==================== 2. 用户进行登录 ===================
    this.handleLogin()
  },

  handleLogin: async function() {
    // 登录前进行判断
    const token = wx.getStorageSync(TOKEN_KEY)
    // token有没有过期
    const checkResult = await checkToken(token)
    console.log(checkResult)
    // 判断session是否过期
    const isSessionExpire = await checkSession()

    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },

  loginAction: async function() {
    // 1. 获取code
    const code = await getLoginCode()
    
    // 2. 将code发送给服务器-生成token
    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
  
})
