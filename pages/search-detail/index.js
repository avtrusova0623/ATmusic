// pages/search-detail/index.js
import {getHotSearch, getSuggestions, getSearchResult} from "../../service/search"
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'

const debounceGetSuggestions = debounce( getSuggestions, 300)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 热门搜索
    hotSearch: [],
    keywords: '',
    suggestSongs: [],
    suggestSongsNodes: [],
    searchSongsResult: []
  },

  // 事件处理
  // 输入改变
  handleSearchChange: function(e) {
    // console.log(e.detail);
    // 1. 保存搜索关键词
    const searchValue = e.detail
    this.setData({keywords: searchValue})

    // 2. 判断关键词是否为空
    if(!searchValue.length) {
      this.setData({
        suggestSongs: [],
        searchSongsResult: []
      })
      // 关键词为空时不发送网络请求进行搜索: 这样就会立刻显示搜索建议
      debounceGetSuggestions.cancel()
      return 
    }
     // 3. 搜索建议
     debounceGetSuggestions(searchValue).then(res=> {
      // console.log(res.result.allMatch);
      // 1. 根据关键词搜索
      const suggestSongs = res.result.allMatch
      this.setData({suggestSongs})
      if (!suggestSongs) return
      // 2.转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  // 确定搜索
  handleSearch: function() {
    // 关键词
    const searchValue = this.data.keywords
    // 请求搜索结果数据
    getSearchResult(searchValue).then(res=> {
      // console.log(res.result.songs);
      this.setData({searchSongsResult: res.result.songs})
    })
  },

  // 热门搜索处理
  handleHotSearchClick: function(e) {
    // 被点击的关键词
    const searchKeyword = e.currentTarget.dataset.keyword
    this.setData({keywords: searchKeyword})
    // 调用搜索方法
    this.handleSearch()
  },

    //  请求网络数据
    getPageDatas: function() {
      // 热门搜索数据
      getHotSearch().then(res=> {
        this.setData({hotSearch: res.result.hots})
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageDatas()
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

 
})