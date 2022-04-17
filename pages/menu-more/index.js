// pages/menu-more/index.js
import {getSongMenu,getHotMenuCateTags} from "../../service/music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songMenuList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求数据
    this.getPageData()
   
  },

  // 网络数据
  async getPageData() {
    const res = await getHotMenuCateTags()
    const menu_cate = res.tags
    // console.log(menu_cate);
    const songMenuList = []
    const promises = []
    for (const index in menu_cate) {
      const name = menu_cate[index].name
      songMenuList[index] = { name, list: [] }
      const res1 = await getSongMenu(name)
      promises.push(res1)
    }
    // console.log(promises);
    Promise.all(promises).then(menuLists => {
      for (const index in menuLists) {
        const menuList = menuLists[index]
        songMenuList[index].list = menuList.playlists
      }
      // 歌单分类信息
      this.setData({ songMenuList })
    })
   
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

})