

# ATmusic

## ATmusic-DAY01

- setData是同步的还是异步的？
- setData在设置data数据上，是同步的
- 通过最新的数据对wxml进行渲染，渲染的过程是异步的  

### 1. 搭建基本结构

- 1. 首页主要是音乐和视频两个切换栏: app.json

```js
"tabBar": {
    "list": [
      {
        "pagePath": "pages/home-music/index",
        "text": "音乐",
        "iconPath": "./assets/images/tabbar/music_normal.png",
        "selectedIconPath": "./assets/images/tabbar/music_active.png"
      },
      {
        "pagePath": "pages/home-video/index",
        "text": "视频",
        "iconPath": "./assets/images/tabbar/video_normal.png",
        "selectedIconPath": "./assets/images/tabbar/video_active.png"
      }
    ]
  }
```

- 2.  视频页面，封装Item-video-v1组件：新建components文件夹，右键新建component

```wxml
// 1. 组件结构
<view class="item">
  <view class="album">
    <image class="image" src="{{item.cover}}" mode="widthFix">			  </image>
    <view class="info">
      <view class="count">{{item.playCount}}</view>
      <view class="duration">{{item.mv.videos[0].duration}}</view>
    </view>
  </view>
  <view class="content">
    {{item.name}} - {{item.artistName}}
  </view>
</view>
```

```wcss
// 2. 组件样式
/* components/Item-video-v1/index.wxss */
.item {
  width: 100%;
  margin-bottom: 30rpx;
}

.album {
  position: relative;
  border-radius: 12rpx;
  overflow: hidden;
  display: flex;
}

.album .image {
  width: 100%;
}

.info {
  position: absolute;
  padding: 0 10rpx;
  box-sizing: border-box;
  width: 100%;
  bottom: 8rpx;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 24rpx;
}

.info .count {
  padding-left: 36rpx;
  position: relative;
}

.info .count::before {
  content: "";
  position: absolute;
  left: -2rpx;
  top: 4rpx;
  width: 30rpx;
  height: 24rpx;
  background-size: cover;
  background-image: url("data:image/jpeg;base64,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");
}

.content {
  margin-top: 10rpx;
  font-size: 28rpx;
  
  /* 显示两行 */
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -moz-box;
  -moz-line-clamp: 2;
  -moz-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  overflow: hidden;
}
```

- 3. 使用组件

​		- 3.1在要使用该组件的页面json文件中注册

```json
"usingComponents": {
    "Item-video-v1": "/components/Item-video-v1/index"
  }
```



​	- 3.2 父组件使用该组件并传递参数

```wxml
 <Item-video-v1 item="{{item}}">
 </Item-video-v1>
```



​	- 3.3 该组件在js文件中的properties属性接收参数

```js
	properties: {
 	   item: {
 	     type: Object,
         value: {}
       }
    }
```

- 4. 自定义方法格式化播放量和视频秒数，新建utils/format.wxs文件，wxs是小程序的脚本语言,不可以使用let

  ```wxs
  // 格式化播放量
  function formatCount(count) {
    var counter = parseInt(count)
    if(counter > 100000000) {
      // toFixed() 取小数点后位数
      return (counter / 100000000).toFixed(1) + "亿"
    } else if(counter > 10000) {
      return (counter / 10000).toFixed(1) + "万"
    } else {
      return counter + ""
    }
  }
  
  // 12 -> 12
  // 5 -> 05
  function padLeftZero(time) {
    time = time + ""
    return ("00" + time).slice(time.length)
  }
  
  // 格式化视频秒数
  function formatDuration(duration) {
    duration = duration / 1000
    // 488s / 60 = 8.12
    // Math.floor向下取整
    var minute = Math.floor(duration / 60)
    // 488s % 60
    var second = Math.floor(duration) % 60
  
    return padLeftZero(minute) + ":" + padLeftZero(second)
  }
  
  // commonjs
  module.exports = {
    formatCount: formatCount,
    formatDuration: formatDuration
  }
  ```

  

- 5. 在组件中使用wxs文件

  ```wxml
  <wxs src="../../utils/format.wxs" module="format"></wxs>
  <view class="count">{{format.formatCount(item.playCount)}}</view>
  <view class="duration">{{format.formatDuration(item.mv.videos[0].duration)}}</view>
  ```

  

### 2. 视频-详情页面数据请求

- 1. 点击Item进入详情页，把item参数传入点击事件，给组件一个属性data-Item="{{item}}"，点击事件用event.target.dataset.item获取该参数

  ```js
  handleVideoClick(event) {
      // 获取mv的id
      const id = event.target.dataset.item.id
      console.log(id);
   }
  ```

- 2. 根据id跳转到详情页

  ```js
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
  ```

- 3. 详情页接收参数id并请求数据

  ```js
  onLoad: function (options) {
      // options包含页面跳转传进来的参数
      const id = options.id
      console.log(id);
      // 
   },
  ```

- 4. 添加编译模式方便编译

  - 添加编译模式，不用频繁切换页面编译，启动参数id=14487937

- 5. 写数据请求的接口(video.js)

  ```js
  /**
   * 请求mv的播放地址
   * @param {number} id  mv对应的id
   */
  export function getMVURL(id) {
    return atRequest.get("/mv/url",{
      id
    })
  }
  /**
   * 请求mv的详情
   * @param {number} mvid 
   */
  export function getMVDetail(mvid) {
    return atRequest.get("/mv/detail",{
      mvid
    })
  }
  /**
   * 请求mv相关视频
   * @param {number} id  number是id类型
   */
  export function getRelatedVideo(id) {
    return atRequest.get("/related/allvideo",{
      id
    })
  }
  
  ```

- 6. 把请求三个数据的方法封装成一个方法(不是所有请求网络都要使用异步，这里直接使用promise，因为三个请求不依赖彼此)

  ```js
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
    }
  ```

###  3. 视频-详情页面布局

#### 1. 视频播放布局

- 1. 视频播放-小程序原生组件video

- 2. video组件开启固定定位，下面的内容向上滑动，video不动，另一种方法下面的内容包裹在滑动组件中，video不需要定位，这里使用定位

    ```wxml
    <!-- video组件默认宽度 300px、高度 225px
          autoplay 是否默认播放
          loop是否循环播放
          referrer-policy： 视频缓存问题
     -->
    <video class="video"
      src="{{videoURLs.url}}"
      autoplay loop
      referrer-policy="origin"
      >
    </video>
    <block wx:for="{{100}}" wx:key="*this">
      <view>列表数据{{item}}</view>
    </block>
    ```

- 3. video组件开启固定定位后，下面的内容向上滑动要从从头开始，给page页面一个padding-top(值为video组件高度)，video组件top为0

    ```wcss
    page {
      padding-top: 225px;
    }
    .video {
      width: 100%;
      position: fixed;
      top: 0;
    }
    ```

####  2. 视频介绍和推荐视频

##### 1. 视频介绍展示

1. 结构

   ```wxml
   <!-- 视频介绍 -->
   <view class="info">
     <view class="title">{{videoDtail.name}}</view>
     <view class="desc">{{videoDtail.artistName}} - {{videoDtail.desc}}</view>
     <view class="other">
       <text class="play-count">{{format.formatCount(videoDtail.playCount)}}次播放 - </text>
       <text class="publish-time">{{videoDtail.publishTime}}</text>
     </view>
   </view>
   ```

2. 样式

   ```wcss
   /* 视频介绍 */
   .info {
     padding: 30rpx;
   }
   .info .title {
     font-weight: 700;
   }
   
   .info .desc {
     /* 隐藏多余部分 */
     overflow: hidden;
     /* 强制不换行 */
     white-space: nowrap;
     /* 显示省略号 */
     text-overflow: ellipsis;
   }
   
   .info .desc, .info .other {
     font-size: 24rpx;
     margin-top: 10rpx;
     color: #666;
   }
   ```

   

##### 2. 推荐视频展示

1. 结构

   ```wxml
   <!-- 推荐视频 -->
   <view class="recommend">
     <view class="title">推荐视频</view>
     <view class="recommend-list">
       <block wx:for="{{relatedVideos}}" wx:key="vid">
         <recommend-list-item item="{{item}}"></recommend-list-item>
       </block>
     </view>
   </view>
   ```

   - 封装的组件结构(recommend-list-item)

     ```wxml
     <!--components/recommend-list-item/index.wxml-->
     <wxs src="../../utils/format.wxs" module="format"></wxs>
     <view class="item">
       <view class="album">
         <image class="image" mode="widthFix" src="{{item.coverUrl}}"></image>
         <view class="info">
           <text class="count">{{format.formatCount(item.playTime)}}</text>
         </view>
       </view>
       <view class="content">
         <view class="title">{{item.title}}</view>
         <view class="nickname">{{item.creator[0].userName}}</view>
       </view>
     </view>
     ```

   - 封装的组件样式

     ```wcss
     /* components/recommend-list-item/index.wxss */
     .item {
       display: flex;
       align-items: center;
       margin-top: 30rpx;
     }
     
     .album {
       width: 230rpx;
       position: relative;
       display: flex;
     }
     
     .image {
       width: 100%;
       border-radius: 10rpx;
     }
     
     .info {
       display: flex;
       position: absolute;
       bottom: 6rpx;
       right: 10rpx;
       color: #fff;
       font-size: 24rpx;
     }
     
     .info .count {
       padding-left: 36rpx;
     }
     
     .info .count::before {
       content: "";
       position: absolute;
       left: -2rpx;
       top: 4rpx;
       width: 30rpx;
       height: 24rpx;
       background-size: cover;
       background-image: url("data:image/jpeg;base64,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");
     }
     
     .content {
       flex: 1;
       padding: 0 20rpx;
     }
     
     .content .title {
       font-size: 28rpx;
       font-weight: 600;
     }
     
     .content .nickname {
       font-size: 24rpx;
       color: #555;
     }
     ```

     

2. 样式

   ```wcss
   .info, .recommend{
     padding: 30rpx;
   }
   .info .title, .recommend .title {
     font-weight: 700;
   }
   ```

   

#### 3. 出现bug

- 问题：完成推荐视频后，向上滑动页面，发现推荐视频的图片会覆盖住上面播放的视频

- 解决：给上面的视频添加绝对显示权z-index

  ```wcss
  /* 视频播放 */
  .video {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 999;
  }
  ```

  

###  4. 音乐-页面布局

- 搜索框使用了vant组件库， Vant 官方提供了 [Vue 2 版本](https://vant-contrib.gitee.io/vant/v2)、[Vue 3 版本](https://vant-contrib.gitee.io/vant)和[微信小程序版本]

##### 1. npm安装第三方库(搜索框)

```html
// 1. 进入终端：npm init -y 生成package.json
// 2. 安装vant: npm i @vant/weapp
// 3. 工具-构建npm 生成了miniprogram_npm文件夹
// 4. 在要使用该组件的页面json文件中引入搜索组件
// 5. 重新编译有报错，重启项目报错消失，有警告，降低调试基础库版本到2.18.0
```

#####  2. 调整搜索框样式

- 把所有页面背景色及导航栏背景色设为#fafafa：app.json(navigationBarBackgroundColor)、app.wcss

- 根据搜索组件具备的属性更改样式，也可wcss覆盖样式，又是需加!important

- 首页的搜索框不需要互动功能，只需要监听点击事件跳转到搜索页面即可

  ```wxml
  <!-- 搜索框 
    disabled: 是否禁用输入框
    background:	搜索框背景色
    shape:	形状，默认值square，可选值为 round
    placeholder：	输入框为空时占位符
    bind:click-input:	点击搜索区域时触发
  -->
  <van-search
  disabled
  background="#fafafa"
  shape="round"
  placeholder="输入歌曲名称"
  bind:click-input="handleSearchClick"
  />
  ```

  ```js
  handleSearchClick() {
      // 跳转到搜索页面
      wx.navigateTo({
        url: '/pages/search-detail/index',
      })
   },
  ```

  

##### 3. 轮播图(小程序原生组件swiper)

- 先封装方法请求数据： service/music.js

  ```js
  // 请求轮播图的数据
  export function getBanners() {
    return atRequest.get("/banner", {
      type: 2
    })
  }
  ```

  

- 封装音乐页面所有数据请求的方法

  ```js
  // 网络数据
    getPageDatas() {
      // 轮播图数据
      getBanners().then(res=> {
        this.setData({banners: res.banners})
      })
    },
  ```

  

- 轮播图初始

  ```wxml
  <!-- 轮播图 
     默认高度： 150px
     indicator-dots	： 是否显示面板指示点
     indicator-color： 	指示点颜色
     indicator-active-color： 当前选中的指示点颜色
     autoplay:	是否自动切换
     circular		是否采用衔接滑动
  -->
  <swiper class="swiper"
  indicator-dots
  indicator-active-color="#fff"
  autoplay
  circular
  >
  <block wx:for="{{banners}}" wx:key="bannerId">
    <swiper-item class="swiper-item">
      <image class="swiper-image" src="{{item.pic}}" mode="widthFix"></image>
    </swiper-item>
  </block>
  </swiper>
  ```

  

- 问题：轮播图固定高度150px，当机型发生变化宽度随之变化，高度也改变，指示点的位置不合适

- 解决： 把图片的高度给swiper

- 过程： 图片的高度由图片的宽度决定(mode: widthFix),重点在于如何获取一张网络图片的宽度，而图片会做适配，所以最终要获取的是image组件的高度

  ```js
  // 当图片加载完成
  // wx.createSelectorQuery() 返回一个 SelectorQuery 对象实例,查询image组件的高度
  // 图片加载完成
    handleSwiperImageLoad() {
      // 因为图片会做适配，所以实际要获取的是image组件的高度
      const query = wx.createSelectorQuery()
      query.select('.swiper-image').boundingClientRect()
      query.exec((res)=> {
       const rect = res[0]
       this.setData({swiperHeight: rect.height})
      })
    }
  ```

- 封装查询方法createSelectorQuery： utils/query-rect.js

  ```js
  export default function (selector) {
    return new Promise((resolve) => {
      const query = wx.createSelectorQuery()
      query.select(selector).boundingClientRect()
      // query.exec(resolve)
      query.exec((res) => {
        resolve(res)
      })
    })
  }
  ```

- 图片加载完成

  ```js
  // 图片加载完成
    handleSwiperImageLoad() {
      // 因为图片会做适配，所以实际要获取的是image组件的高度
      queryRect(".swiper-image").then(res=> {
        const rect = res[0]
        this.setData({swiperHeight: rect.height})
      })
  ```

  

- 频繁的加载图片，使用节流(直接把老师的节流js文件拿过来使用)

  ```js
  import throttle from '../../utils/throttle'
  // 节流
  const throttleQueryRect = throttle(queryRect, 1000)
  handleSwiperImageLoad() {
      // 因为图片会做适配，所以实际要获取的是image组件的高度
      throttleQueryRect(".swiper-image").then(res=> {
        const rect = res[0]
        this.setData({swiperHeight: rect.height})
        // console.log("图片");
      })
    },
  ```

##### 4.  轮播图优化

###### 1. 轮播图左右间距

- 需求： 给轮播图左右两边留间距

- 想法： 因为所有模块左右最好都留些间距，所以直接在音乐页面page中添加padding

- 问题：  

  			1. 搜索框原本就有左右间距，现在左右间距更大了
  			1. 直接添加padding后，发现轮播图左边有间距，右边没有

- 问题解决： 

  1. 把搜索框原本的左右间距去掉

  2. 这是因为添加padding后，页面被放大了，需要添加box-sizing: border-box,以防其他页面需要，设置在全局样式中

     ```wcss
     // home-music/index.wcss
     page {
       padding: 0 20rpx;
       /* box-sizing: border-box; */
     }
     .van-search {
       padding: 10px 0 !important;
     }
     ```

     

###### 2. 轮播图圆角问题

* 需求： 给轮播图添加圆角

* 想法： 直接给swiper组件添加圆角

* 问题： 某些机型圆角设置不显示(webview)

* 问题解决： transform: translateY(0);

  ```wcss
  // home-music/index.wcss
  .swiper {
    border-radius: 10rpx;
    overflow: hidden;
    transform: translateY(0);
  }
  ```

  



##### 5. 歌曲推荐组件封装(area-header)

###### 1. 初始版本： 注册使用

- 组件结构、样式、参数传递

```wxml
<!-- components/area-header/index.wxml-->
<view class="header">
  <view class="title">{{title}}</view>
  <view class="right">
    <text>{{rightText}}</text>
    <image class="icon" src="/assets/images/icons/arrow-right.png"></image>
  </view>
</view>
```

```wcss
/* 样式： components/area-header/index.wxss */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
}

.header .title {
  font-size: 36rpx;
  font-weight: 700;
}

.header .right {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #777;
}

.header .right .icon {
  width: 50rpx;
  height: 50rpx;
}
```

```js
// 参数传递 components/area-header/index.js
properties: {
    title: {
      type: String,
      value: "默认标题"
    },
    rightText: {
      type: String,
      value: "更多"
    }
  },
```

- 组件使用

  ```wxml
  <!--pages/home-music/index.wxml-->
  <view class="recommend-song">
    <area-header title="歌曲推荐"></area-header>
  </view>
  ```

  

###### 2. 小程序插槽设置默认值

- 小程序不能像vue中设置插槽默认值

- 解决方法：两个view组件，一个放置插槽，一个放置默认内容 使用css伪类判断元素是否为空，再用 + 连接器

- 需求1： header组件右边的数据控制显示

  ```wxml
  <!--components/area-header/index.wxml-->
  <view class="header">
    <view class="title">{{title}}</view>
    <view class="right" wx:if="{{showRight}}">
      <text>{{rightText}}</text>
      <image class="icon" src="/assets/images/icons/arrow-right.png"></image>
    </view>
  </view>
  ```

  ```js
  // components/area-header/index.js
  showRight: {
        type: Boolean,
        value: true
  }
  ```

  ```wxml
  <!--pages/home-music/index.wxml-->
  <view class="recommend-song">
    <area-header title="歌曲推荐" showRight="{{false}}"></area-header>
  </view> 
  ```

- 需求2： 右边数据类似vue插槽功能

  1. 两个view组件，一个放置插槽，一个放置默认内容，样式对应更改

  2. 使用css3伪类:empty: 该伪类选择器，当元素为空时可设置样式

  3. 使用 + 选择器，当某元素为空时，选择其他元素设置样式

     ```wxml
     <!--components/area-header/index.wxml-->
     <view class="header">
       <view class="title">{{title}}</view>
       <view class="right" wx:if="{{showRight}}">
         <view class="right-slot"><slot></slot></view>
         <view class="right-default">
           <text>{{rightText}}</text>
           <image class="icon" src="/assets/images/icons/arrow-right.png"></image>
         </view>
       </view>
     </view>
     ```

     ```wcss
     /* components/area-header/index.wxss */
     .header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       height: 88rpx;
     }
     
     .header .title {
       font-size: 36rpx;
       font-weight: 700;
     }
     
     /* right-default的display默认设置为none
         判断插槽是否为空
         插槽若为空
         right-default的display设置为flex
         css3伪类选择器:empty: 判断元素是否为空
         +  表示若为空，则给right-default代表的元素设置样式
         */
     .header .right-slot:empty +  .right-default{
       display: flex;
     }
     
     .header .right-default {
       display: none;
       align-items: center;
       font-size: 28rpx;
       color: #777;
     }
     
     .header .right-default .icon {
       width: 50rpx;
       height: 50rpx;
     }
     ```

     ```wxml
     <!--pages/home-music/index.wxml-->
     <view class="recommend-song">
       <area-header title="歌曲推荐">
         <text>详情</text>
       </area-header>
     </view>
     ```

##### 6. coderwhy全局状态管理工具

- hy-event-store： 一个基于事件的全局状态管理工具，可以在Vue、React、小程序等任何地方使用

- npm安装依赖

  ```js
  npm install hy-event-store
  ```

##### 7. 歌曲推荐

- 小程序每次安装库后都要构建npm

- 歌曲推荐使用的接口： /top/list  热门榜单

###### 1. 先写好请求榜单歌曲数据的接口

  ```js
  // service/music.js
  // 请求榜单的数据
  export function getRankings(idx) {
    return atRequest.get("/top/list", {
      idx
    })
  }
  ```

  

  ###### 2. 新建store/index.js， store/ranking.js

  - 把有关榜单的共享数据写在ranking.js中

    ```js
    // 榜单数据
    import {HYEventStore} from 'hy-event-store'
    
    // 引入网络请求方法
    import {getRankings} from '../service/music'
    
    const rankingStore = new HYEventStore({
      state: {
        hotRanking: {}
      },
      actions: {
        getRankingDataAction(ctx) {
          getRankings(1).then((res)=> {
            // console.log(res);
            ctx.hotRanking = res.playlist
          })
        }
      }
    })
    
    export {
      rankingStore
    }
    ```

    

  - 再引入index.js，再统一导出使用

    ```js
    import {rankingStore} from "./ranking"
    // 统一导出
    export {
      rankingStore
    }
    ```


###### 3. 当音乐页面加载完成，请求共享数据并保存

```js
import {rankingStore} from '../../store/index'

onLoad: function (options) {
    // 获取页面数据
    this.getPageDatas()

    // 获取共享数据
    rankingStore.dispatch("getRankingDataAction")
    // 从store获取共享数据并保存
    rankingStore.onState("hotRanking", (res)=> {
      // 第一次拿到的是空对象
      // console.log(res);
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)// 只要前6条数据
      this.setData({recommendSongs})
    })
  }
})
```

###### 4. 在页面中展示数据

- 封装组件：Item-song-v1

  ```wxml
  <!--components/Item-song-v1/index.wxml-->
  <view class="item">
    <image class="image" src="{{item.al.picUrl}}"></image>
    <view class="content">
      <view class="name">{{item.name}}</view>
      <view class="source">{{item.ar[0].name}}·{{item.al.name}}</view>
    </view>
    <view class="arrow">
      <image class="icon" src="/assets/images/icons/arrow-right.png"></image>
    </view>
  </view>
  ```

- 组件样式

  ```wcss
  /* components/Item-song-v1/index.wxss */
  .item {
    display: flex;
    padding: 16rpx 0;
    align-items: center;
  }
  
  .image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 16rpx;
  }
  
  .content {
    margin-left: 16rpx;
    flex: 1;
  }
  
  .content .name {
    font-size: 32rpx;
    color: #555;
  }
  
  .content .source {
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #999;
  }
  
  .arrow .icon {
    width: 50rpx;
    height: 50rpx;
  }
  ```

- 注册使用

  ```wxml
  <!-- 歌曲推荐 -->
  <view class="recommend-song">
    <area-header title="歌曲推荐"></area-header>
    <view class="song-list">
      <block wx:for="{{recommendSongs}}" wx:key="id">
        <Item-song-v1 item="{{item}}"></Item-song-v1>
      </block>
    </view>
  </view>
  ```

##### 8. 热门歌单、歌单推荐

- 两个部分结构相似，封装一个组件复用

###### 1. 封装组件(song-menu-v1)

  1. 组件版本v1

     ```wxml
     <!--components/song-menu-v1/index.wxml-->
     <!-- 头部标题 -->
     <area-header title="{{title}}"></area-header>
     <!-- 滑动组件
       scroll-x:	允许横向滚动
      -->
     <scroll-view scroll-x class="menu_list">
       <block wx:for="{{6}}" wx:key="*this">
         <view class="menu_item">
           {{item}} 
         </view>
       </block>
     </scroll-view>
     ```

     ```wcss
     /* components/song-menu-v1/index.wxss */
     .menu_list {
       /* 禁止换行 */
       white-space: nowrap;
     }
     
     .menu_item {
       display: inline-block;
       /* 真机测试中，有些机型这些item无法对齐，需统一设置顶部对齐 */
       vertical-align: top;
       width: 220rpx;
       height: 220rpx;
       margin-left: 20rpx;
       background-color: #bfa
     }
     ```

     - 问题：

       1. 真机测试中，某些机型中view无法对齐

          - 原因： 与css样式有关

          - 解决：设置每个盒子顶部对齐

            ```wcss
            vertical-align: top;
            ```

       2. 第一个view盒子没有和热门歌单对齐显示，左边有空白

          - 原因：每个盒子设置了padding-left为20rpx
          - 解决： 暂时不处理，先解决第三个问题

       3. 需要的效果，左右滑动时，是从屏幕滑入滑出，而不是从空白滑入滑出，滑到最后一个view右边需要保留空白部分

          - 原因： 左右的空白是page页面设置的padding值，不打算更改

          - 疑问： 如何做出需要的效果？

          - 解决： 两种思路

            - 思路一：直接获取当前屏幕宽度，把宽度赋给scroll-view

            - 实现： 直接在全局app.js中获取屏幕宽度

              ```js
              // app.js
              App({
                /**
                 * onLaunch(Object object)
                 * 小程序初始化完成时触发，全局只触发一次
                 */
                onLaunch: function() {
                  // wx.getSystemInfoSync()获取设备信息
                  // 获取设备的信息
                  const info = wx.getSystemInfoSync()
                  // 保存设备宽高
                  this.globalData.screenWidth = info.screenWidth
                  this.globalData.screenHeight = info.screenHeight
                },
                // 全局对象
                globalData: {
                  // 保存屏幕宽度和高度
                  screenWidth: 0,
                  screenHeight: 0
                }
              })
              ```

            - song-menu-v1中保存宽度并赋值给scrool-view

              ```js
              // 获取app实例
              const app = getApp()
              data: {
                  // 屏幕宽度
                  screenWidth: app.globalData.screenWidth
              },
              ```

              ```wxml
              <scroll-view scroll-x class="menu_list" style="width: {{screenWidth}}px">
                <block wx:for="{{6}}" wx:key="*this">
                  <view class="menu_item">
                    {{item}} 
                  </view>
                </block>
              </scroll-view>
              ```

            - 此时满足从屏幕滑入滑出的效果，但左边item没有与标题对齐且右边无空白，进行样式微调

              ```wcss
              /* components/song-menu-v1/index.wxss */
              .menu_list {
                /* 禁止换行 */
                white-space: nowrap;
                /* 由于item设置了padding-left左边无法与标题对齐 */
                position: relative;
                /* 20是item设置的padding-left*/
                left: -20rpx;
              }
              .menu_item {
                display: inline-block;
                /* 真机测试中，有些机型这些item无法对齐，需统一设置顶部对齐 */
                vertical-align: top;
                width: 220rpx;
                height: 220rpx;
                margin-left: 20rpx;
                background-color: #bfa
              }
              
              /* 给最后一个item右边留空白 */
              .menu_item:last-of-type {
                margin-right: 20rpx;
              }
              ```

            - 以上满足效果的同时，解决了问题2

            - 思路2(推荐)： scroll-view宽度采用视口宽度vw，不需要获取屏幕宽度

              ```wcss
              /* components/song-menu-v1/index.wxss */
              .menu_list {
                /* 宽度与视口宽度一致 */
                width: 100vw;
                /* 禁止换行 */
                white-space: nowrap;
                /* 由于item设置了padding-left左边无法与标题对齐 */
                position: relative;
                /* 20是item设置的padding-left*/
                left: -20rpx;
              }
              
              .menu_item {
                display: inline-block;
                /* 真机测试中，有些机型这些item无法对齐，需统一设置顶部对齐 */
                vertical-align: top;
                width: 220rpx;
                height: 220rpx;
                margin-left: 20rpx;
                background-color: #bfa
              }
              
              /* 给最后一个item右边留空白 */
              .menu_item:last-of-type {
                margin-right: 20rpx;
              }
              ```

 

​     

###### 2. 封装组件(song-menu-item)
- 把song-menu-v1里滑动组件里的item也封装成组件

  1. 定义接口，请求数据

     ```js
     // service/music.js
     // 获取全部歌单
     export function getSongMenu(cat="全部", limit=6, offset=0) {
       return atRequest.get("/top/playlist", {
         cat,
         limit,
         offset
       })
     }
     ```

  2. 在home-music页面中请求、保存并传递数据给song-menu-v1

     ```js
      // 网络数据
       getPageDatas() {
         // 轮播图数据
         getBanners().then(res=> {
           // setData是同步的还是异步的？
           // setData在设置data数据上，是同步的
           // 通过最新的数据对wxml进行渲染，渲染的过程是异步的
           this.setData({banners: res.banners})
         }),
     
         // 获取歌单数据
         getSongMenu().then((res)=> {
           // console.log(res);
           this.setData({hotSongMenu: res.playlists})
         })
       },
     ```

     ```wxml
     <!--components/song-menu-v1/index.wxml-->
     <!-- 头部标题 -->
     <area-header title="{{title}}"></area-header>
     <!-- 滑动组件
       scroll-x:	允许横向滚动
      -->
     <!-- <scroll-view scroll-x class="menu_list" style="width: {{screenWidth}}px"> -->
     <scroll-view scroll-x class="menu_list">
       <block wx:for="{{songMenu}}" wx:key="id">
         <view class="menu_item">
           {{item.name}} 
         </view>
       </block>
     </scroll-view>
     ```

     

  3. 封装组件song-menu-item

     - 结构

       ```wxml
       <!--components/song-menu-item/index.wxml-->
       <wxs src="../../utils/format.wxs" module="format"></wxs>
       <view class="item">
         <view class="top">
         <!-- 封面图片 -->
           <image class="image" src="{{item.coverImgUrl}}" mode="widthFix"></image>
           <!-- 播放量 -->
           <view class="play-counter">{{format.formatCount(item.playCount)}}</view>
         </view>
         <!-- 文字描述 -->
         <view class="bottom">{{item.name}}</view>
       </view>
       ```

       

     - 样式

       ```wcss
       /* components/song-menu-item/index.wxss */
       .item {
         display: inline-block;
         width: 100%;
       }
       
       .top {
         position: relative;
       }
       
       .top .image {
         width: 100%;
         border-radius: 12rpx;
         background-size: cover;
       }
       
       .top .play-counter {
         position: absolute;
         right: 0;
         bottom: 10rpx;
         color: #fff;
         font-size: 22rpx;
         border-radius: 12rpx;
         padding: 6rpx 10rpx;
         background: rgba(0,0,0,.5);
       }
       
       .item .bottom {
         width: 100%;
         font-size: 26rpx;
       
         /* 显示两行 */
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
         display: -moz-box;
         -moz-line-clamp: 2;
         -moz-box-orient: vertical;
         word-wrap: break-word;
         word-break: break-all;
         white-space: normal;
         overflow: hidden;
       }
       ```

##### 9. 热门歌单、歌曲/单推荐优化

- 当数据还没请求到时对应模块不显示，wx-if判断

  ```wxml
  <!--pages/home-music/index.wxml-->
  <!-- 歌曲推荐 -->
  <view class="recommend-song" wx:if="{{recommendSongs.length > 0}}">
    <area-header title="歌曲推荐"></area-header>
    <view class="song-list">
      <block wx:for="{{recommendSongs}}" wx:key="id">
        <Item-song-v1 item="{{item}}"></Item-song-v1>
      </block>
    </view>
  </view>
  <!-- 热门歌单 -->
  <song-menu-v1 title="热门歌单" 
      songMenu="{{hotSongMenu}}"
      wx:if="{{hotSongMenu.length > 0}}"
  ></song-menu-v1>
  <!-- 推荐歌单 :华语-->
  <song-menu-v1 title="歌单推荐"
      songMenu="{{recommendSongMenu}}"
      wx:if="{{recommendSongMenu.length > 0}}"
  ></song-menu-v1>
  ```

  

##### 10. 巅峰榜

- 有新歌榜(2)、飙升榜(0)、原创榜(3)单个表单

- 事实上这三个表单和推荐歌曲(1)用的接口是同一个

- 由于多处用到数据，所以在store请求数据并共享

  ```md
  0 飙升 
  1 热门 
  2 新歌 
  3 原创
  **接口地址 :** `/top/list`
  **调用例子 :** `/top/list?idx=0`
  ```

- 请求数据

  ```js
  // store/ranking.js
  // 对象映射
  const rankingObject = {0: "newRanking", 1: "hotRanking", 2: "orignRanking", 3: "upRanking"}
  getRankingDataAction(ctx) {
        for(let i = 0; i < 4; i++) {
          getRankings(i).then((res)=> {
            // console.log(res);
            const rankingName = rankingObject[i]
            ctx[rankingName] = res.playlist
          })
        }
  }
  ```

- home-music音乐页面从store获取数据

  ```js
  onLoad: function (options) {
      // 获取页面数据
      this.getPageDatas()
  
      // 获取共享数据
      rankingStore.dispatch("getRankingDataAction")
      // 从store获取共享数据并保存 : 热歌榜·
      rankingStore.onState("hotRanking", (res)=> {
        // 第一次拿到的是空对象
        // console.log(res);
        if(!res.tracks) return
        const recommendSongs = res.tracks.slice(0, 6)// 只要前6条数据
        this.setData({recommendSongs})
      }),
  
      // 新歌榜、原创榜、飙升榜首页都只需要3条数据，封装方法获取共享数据
      rankingStore.onState("newRanking", this.getRankingHandler(0))
      rankingStore.onState("orignRanking", this.getRankingHandler(2))
      rankingStore.onState("upRanking", this.getRankingHandler(3))
    },
    // 监听共享数据变化的回调
    getRankingHandler: function(idx) {
      return (res) => {
        // 先判断有无数据
        if(Object.keys(res).length === 0) return
        // console.log("idx", idx);
        const name = res.name
        const coverImgUrl = res.coverImgUrl
        const playCount = res.playCount
        const songList = res.tracks.slice(0, 3)
        const rankingObj = {name, coverImgUrl, playCount, songList}
        const newRankingObj = {...this.data.rankings, [idx]: rankingObj}
        this.setData({rankings: newRankingObj})
        // console.log(this.data.rankings);
      }
    }
  ```

- 展示数据，封装组件ranking-item-v1

  ```wxml
  <!--components/ranking-item-v1/index.wxml-->
  <wxs src="../../utils/format.wxs" module="format"></wxs>
  <view class="item">
  <!-- 左边内容区 -->
    <view class="content">
      <view class="content-title">{{item.name}}</view>
      <view class="content-list">
        <block wx:for="{{3}}" wx:for-item="index" wx:key="*this">
          <view class="content-list-item">
            <text>{{index+1}}.{{item.songList[index].name}}</text>
            <text class="singer">- {{item.songList[index].ar[0].name}}</text>
          </view>
        </block>
      </view>
    </view>
    <!-- 右边封面 -->
    <view class="album">
    <!-- 	aspectFill: 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来 -->
      <image class="image" src="{{item.coverImgUrl}}" mode="aspectFill"></image>
      <view class="play-counter">{{format.formatCount(item.playCount)}}</view>
    </view>
  </view>
  ```

  ```wcss
  /* components/ranking-item-v1/index.wxss */
  .item {
    display: flex;
    justify-content: space-between;
    background-color: #eee;
    border-radius: 12rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    width: 355px;
  }
  
  .content {
    padding: 24rpx;
    flex: 1;
    /* min-width: 0; */
    overflow: hidden;
  }
  
  .content-title {
    font-size: 34rpx;
    font-weight: 600;
  }
  
  .content-list {
    font-size: 24rpx;
    width: 100%;
    margin-top: 6rpx;
  }
  
  .content-list-item {
    color: #333;
    margin-top: 6rpx;
    width: 100%;
  
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-emphasis: none;
  }
  
  .content-list-item .singer {
    margin-left: 30rpx;
    color: #999;
  }
  
  .album {
    position: relative;
    width: 220rpx;
    display: flex;
  }
  
  .album .image {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .album .play-counter {
    position: absolute;
    right: 0;
    bottom: 0rpx;
    color: #fff;
    font-size: 22rpx;
    border-radius: 12rpx;
    padding: 6rpx 10rpx;
    background: rgba(0,0,0,.5);
  }
  ```

### 5.  音乐-跳转各种详情页

#### 1. 推荐歌曲、巅峰榜(songs-detail)

-  推荐歌曲、巅峰榜的详情页共用一个页面，根据不同页面显示不同内容
  1. 推荐歌曲更多点击事件，点击事件绑定在组件(area-header)内，然后发送给父组件，父组件处理事件
  2. 巅峰榜点击事件绑定在组件(ranking-item-v1)上

#### 2. 推荐歌曲-更多

1. 在组件area-header绑定点击事件(moreClick)，并触发事件

   ```wxml
   <view class="header">
     <view class="title">{{title}}</view>
     <view class="right" wx:if="{{showRight}}" bindtap="moreClick">
       <view class="right-slot"><slot></slot></view>
       <view class="right-default">
         <text>{{rightText}}</text>
         <image class="icon" src="/assets/images/icons/arrow-right.png"></image>
       </view>
     </view>
   </view>
   ```

   ```js
   // 事件处理
   moreClick() {
         this.triggerEvent("MoreClick")
   }
   ```

2. 在父页面home-music中监听并处理事件

   ```wxml
   <area-header title="歌曲推荐" 
       bind:MoreClick="handleMoreClick">
   </area-header>
   ```

   ```js
   // 点击更多
   handleMoreClick(e) {
       // console.log(e);
       wx.navigateTo({
         url: '/pages/songs-detail/index',
       })
   },
   ```

3. 注意：点击事件绑定在组件内，使用了该组件的模块点击都会触发点击事件，可以选择是否要监听并处理该事件

#### 3. 巅峰榜-点击榜单

1. 直接给组件ranking-item-v1绑定事件handleRankingClick

2. 由于推荐歌曲和巅峰榜单请求的接口是同一个，只是分类参数不同，所以把事件处理函数封装

   ```wxml
   // data-idx="{{index}}"
   <ranking-item-v1 item="{{item}}"
           bindtap="handleRankingClick"
           data-idx="{{index}}">
   </ranking-item-v1>
   ```

   

   ```js
   // 点击更多- 推荐歌曲
     handleMoreClick(e) {
       // console.log(e);
       // wx.navigateTo({url: '/pages/songs-detail/index'})
       this.navigateToSongsDetailPage("hotRanking")
     },
   
     // 巅峰榜-榜单被点击
     handleRankingClick(e) {
       // console.log(e.currentTarget.dataset.idx);
       const idx = e.currentTarget.dataset.idx
       // console.log(idx, rankingObject);
       const rankingName = rankingObject[idx]
       this.navigateToSongsDetailPage(rankingName)
     },
   
     // 封装跳转函数
     navigateToSongsDetailPage(rankingName) {
       // 根据点击的区域传递不同参数
       wx.navigateTo({
         url: `/pages/songs-detail/index?rankingName=${rankingName}`,
       })
     },
   ```

   - 小程序遍历对象时，{{index}}是属性名称

3. 当详情页面(songs-detail)加载完成，通过传递过来的参数判断被点击的是哪个榜单

   ```js
   onLoad: function (options) {
       // 判断被点击的是哪个榜单
       console.log(options.rankingName);
   },
   ```

#### 4. 详情页面布局

##### 1.  请求榜单数据并保存(store)

```js
import {rankingStore} from "../../store/index"
data: {
    // 保存榜单名称
    rankingName: '',
    // 榜单信息
    rankingInfo: {}
},
onLoad: function (options) {
    // 判断被点击的是哪个榜单,请求保存榜单数据并展示
    // console.log(options.rankingName);
    const rankingName = options.rankingName
    this.setData({rankingName: options.rankingName})
    // 请求数据，store共享数据
    rankingStore.onState(rankingName, this.getRankingNameDatas)
},
onUnload: function () {
    // 页面关闭时，取消共享数据的监听
    rankingStore.offState(this.data.rankingName, this.getRankingNameDatas)
},
// 事件处理
getRankingNameDatas: function(res) {
    // 保存榜单数据
    this.setData({rankingInfo: res})
}
```

##### 2. 展示榜单数据(type:rank)

- 页面跳转时要把数据传递过去
- 展示页面用了组件Item-song-v2
- 这个组件是做音乐-搜索是做的，直接拿来用的
- 事实上如果榜单数据展示现做的话同样封装组件Item-song-v2，后面可以直接在搜索那里用

1.  歌曲-更多

   ```wxml
   <view class="recommend-song" wx:if="{{recommendSongs.length > 0}}">
     <area-header title="歌曲推荐" 
       bind:MoreClick="handleMoreClick"></area-header>
     <view class="song-list">
       <block wx:for="{{recommendSongs}}" wx:key="id">
         <Item-song-v1 item="{{item}}"></Item-song-v1>
       </block>
     </view>
   </view>
   ```

2. 巅峰榜点击

   ```wxml
   <!-- 巅峰榜：三个榜单 -->
   <view class="ranking">
     <!-- 标题 -->
     <area-header title="巅峰榜" showRight="{{false}}"></area-header>
     <!-- 榜单 -->
     <view class="ranking-list">
       <block wx:for="{{rankings}}" wx:key="name">
         <!-- 组件 -->
         <ranking-item-v1 item="{{item}}"
           bindtap="handleRankingClick"
           data-idx="{{index}}">
         </ranking-item-v1>
       </block>
     </view>
   </view>
   ```

3. 回调-跳转页面

   ```js
   // 点击更多- 推荐歌曲
     handleMoreClick(e) {
       // console.log(e);
       // wx.navigateTo({url: '/pages/songs-detail/index'})
       this.navigateToSongsDetailPage("hotRanking")
     },
   
     // 巅峰榜-榜单被点击
     handleRankingClick(e) {
       // console.log(e.currentTarget.dataset.idx);
       const idx = e.currentTarget.dataset.idx
       // console.log(idx, rankingObject);
       const rankingName = rankingObject[idx]
       this.navigateToSongsDetailPage(rankingName)
     },
   
     // 封装跳转函数
     navigateToSongsDetailPage(rankingName) {
       // 根据点击的区域传递不同参数
       // type 区分是歌单还是榜单
       wx.navigateTo({
         url: `/pages/songs-detail/index?rankingName=${rankingName}&type=rank`,
       })
     },
   ```

4. 歌曲详情页面(songs-item)

   ```wxml
   <!--pages/songs-detail/index.wxml-->
   <area-header title="{{rankingInfo.name}}" showRight="{{false}}"></area-header>
   <!-- 榜单歌曲展示 -->
   <view class="song-list" wx:if="{{type === 'rank'}}">
     <block wx:for="{{rankingInfo.tracks}}" wx:key="id">
       <Item-song-v2 item="{{item}}" index="{{index+1}}"></Item-song-v2>
     </block>
   </view>
   ```

   

##### 3. 热门歌单、推荐歌单歌曲展示(type: menu)

- 跳转的是同一页面，根据type显示不同内容
  1. 点击事件绑定在song-menu-item组件上
  
     ```wxml
     <!--components/song-menu-v1/index.wxml-->
     <view class="menu_item">
           <song-menu-item item="{{item}}"
           bindtap="handleMenuClick"
           data-item="{{item}}"
           >
           </song-menu-item>
     ```
  
  2. 处理点击事件，传递歌单id
  
     ```js
     // components/song-menu-v1/index.js
     handleMenuClick(e) {
           // console.log(e.currentTarget.dataset.item);
           // 传递歌单id
           const item = e.currentTarget.dataset.item
           wx.navigateTo({
             url: `/pages/songs-detail/index?id=${item.id}&type=menu`,
           })
         }
     ```
  
  3.  根据type分辨是歌单还是榜单
  
     ```js
     // pages/songs-detail/index.js
     import {rankingStore} from "../../store/index"
     import {getSongMenuDetail} from "../../service/music"
     Page({
     
       /**
        * 页面的初始数据
        */
       data: {
         // 保存榜单名称
         rankingName: '',
         // 歌曲信息
         songInfo: {},
         // 歌单or榜单
         type: '',
       },
     
       /**
        * 生命周期函数--监听页面加载
        */
       onLoad: function (options) {
         // 判断被点击的是哪个榜单,请求保存榜单数据并展示
         const type = options.type
         this.setData({type})
         // 判断
         if(type === "rank") {
           const rankingName = options.rankingName
           this.setData({rankingName})
           // 请求数据，store共享数据
           rankingStore.onState(rankingName, this.getRankingNameDatas)
         } else if(type === "menu") {
           const id = options.id
           // 请求歌单详情数据
           getSongMenuDetail(id).then(res=> {
             this.setData({songInfo: res.playlist})
           })
         }
        
       },
       /**
        * 生命周期函数--监听页面卸载
        */
       onUnload: function () {
         // 页面关闭时，取消共享数据的监听
         if(this.data.type === "rank") {
           rankingStore.offState(this.data.rankingName, this.getRankingNameDatas)
         }
         
       },
     
       // 事件处理
       getRankingNameDatas: function(res) {
         // 保存榜单数据
         this.setData({songInfo: res})
       }
     })
     ```
  
  4.  根据type显示展示内容
  
     ```wxml
     <!--pages/songs-detail/index.wxml-->
     <!-- 榜单头部 -->
     <area-header title="{{songInfo.name}}" 
         showRight="{{false}}"
         wx:if="{{type === 'rank'}}">
     </area-header>
     <!-- 歌单头部 -->
     <view class="menu-list" wx:if="{{type === 'menu'}}">
       <song-detail-header
         songInfo="{{songInfo}}"
       ></song-detail-header>
     </view>
     <!-- 榜单、歌单歌曲展示 -->
     <view class="song-list">
       <block wx:for="{{songInfo.tracks}}" wx:key="id">
         <Item-song-v2 item="{{item}}" index="{{index+1}}"></Item-song-v2>
       </block>
     </view>
     ```
  
  5.  歌单头部组件： song-detail-header
  
     - 结构
  
       ```wxml
       <!--components/song-detail-header/index.wxml-->
       <wxs src="../../utils/format.wxs" module="format"></wxs>
       <view class="header">
         <!-- 背景 -->
         <image class="bg-image" mode="aspectFill" src="{{songInfo.coverImgUrl}}"></image>
         <view class="bg-cover"></view>
       
         <!-- 内容 -->
         <view class="content">
           <image class="image" mode="aspectFill" src="{{songInfo.coverImgUrl}}"></image>
           <view class="info">
             <view class="title">{{songInfo.name}}</view>
             <view class="anthor">
               <image class="avatar" mode="aspectFill" src="{{songInfo.creator.avatarUrl}}"></image>
               <text class="nickname">{{songInfo.creator.nickname}}</text>
             </view>
             <view class="desc">简介: {{songInfo.description}}</view>
           </view>
         </view>
         <!-- 收藏分享 -->
         <view class="operation">
           <view class="favor item">
             <image class="icon" mode="widthFix" src="/assets/images/icons/favor_icon.png"></image>
             <text class="text">{{format.formatCount(songInfo.playCount)}}</text>
           </view>
           <view class="share item">
             <image class="icon" mode="widthFix" src="/assets/images/icons/share_icon.png"></image>
             <text class="text">分享</text>
           </view>
         </view>
       </view>
       ```
  
     - 样式
  
       ```wcss
       /* components/song-detail-header/index.wxss */
       .header {
         width: 100vw;
         position: relative;
         left: -20rpx;
         display: flex;
         flex-direction: column;
         height: 450rpx;
         color: #fff;
       }
       
       .header .bg-image {
         position: absolute;
         z-index: -1;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
       }
       
       .header .bg-cover {
         position: absolute;
         z-index: -1;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         background-color: rgba(0,0,0,.5);
         backdrop-filter: blur(5px);
       }
       
       .content {
         display: flex;
         margin-top: 60rpx;
         padding: 0 50rpx;
       }
       
       .content .image {
         width: 220rpx;
         height: 220rpx;
         border-radius: 16rpx;
       }
       
       .content .info {
         position: relative;
         height: 220rpx;
         flex: 1;
         margin-left: 50rpx;
       }
       
       .content .anthor {
         margin-top: 20rpx;
         display: flex;
         align-items: center;
       }
       
       .content .anthor .avatar {
         width: 50rpx;
         height: 50rpx;
         border-radius: 25rpx;
       }
       
       .content .anthor .nickname {
         font-size: 24rpx;
         margin-left: 18rpx;
       }
       
       .content .info .desc {
         position: absolute;
         bottom: 0;
         left: 0;
         width: 100%;
         margin-top: 30rpx;
         font-size: 24rpx;
         display: inline-block;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
       }
       
       .operation {
         display: flex;
         justify-content: space-around;
         padding: 30rpx;
         margin-top: 30rpx;
       }
       
       .operation .item {
         display: flex;
         align-items: center;
       }
       
       .operation .item .icon {
         width: 48rpx;
         margin-right: 10rpx;
       }
       
       .operation .item .text {
         font-size: 28rpx;
       }
       ```
  
  6. 共享数据监听的取消
  
     - 一开始，直接取消，但是显示歌单数据时返回会报错，所以根据type判断
  
       ```js
       // pages/songs-detail/index.js
        onUnload: function () {
           // 页面关闭时，取消共享数据的监听
           if(this.data.type === "rank") {
             rankingStore.offState(this.data.rankingName, this.getRankingNameDatas)
           }
           
        }
       ```
##### 4. 热门歌单、推荐歌单-更多
  - 点击更多展示歌单数据，共用一个页面(show-menu)

1. 直接在song-menu-v1组件里的area-header上绑定点击事件

   ```wxml
   <area-header title="{{title}}"
   bindtap="handleMenuMoreClick"
   ></area-header>
   ```

   ```js
   // 歌单更多
   handleMenuMoreClick(e) {
      // 跳转
      wx.navigateTo({
         url: `/pages/menu-more/index`,
      })
   }
   ```

2. 请求歌单分类数据，展示所有类型的歌单

   ```js
    data: {
       songMenuList: []
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
   ```

   ```wxml
   <view class="menu">
     <block wx:for="{{songMenuList}}" wx:key="name">
       <view class="title">{{item.name}}</view>
       <view class="menu-list">
         <block wx:for="{{item.list}}" wx:for-item="menuItem" wx:key="id">
           <view class="menu-list-item">
             <song-menu-item item="{{menuItem}}"></song-menu-item>
           </view>
         </block>
       </view>
     </block>
   </view>
   ```

3. song-menu-item组件内绑定点击事件

   ```wxml
   <view class="item" 
   bindtap="handleClick"
     >
     <view class="top">
     <!-- 封面图片 -->
       <image class="image" src="{{item.coverImgUrl}}" mode="widthFix"></image>
       <!-- 播放量 -->
       <view class="play-counter">{{format.formatCount(item.playCount)}}</view>
     </view>
     <!-- 文字描述 -->
     <view class="bottom">{{item.name}}</view>
   </view>
   ```

   ```js
    handleClick() {
         const id = this.properties.item.id
         wx.navigateTo({
           url: `/pages/songs-detail/index?type=menu&id=${id}`,
         })
       }
   ```

   

4. 1111

5. 11111

6. 


### 6. 音乐-搜索

#### 1. 搜索详情页数据展示

##### 1. 搜索框，用先前引用的vant搜索组件，把搜索组件样式放在全局样式中，在不同页面使用适当调整

```wxml
// 原本放在搜索组件的样式文件中
/* 搜索组件样式 */
.van-search {
  padding: 10px 0 !important;
}
.van-search__content {
  background-color: #fff !important;
}
```

##### 2. 搜索详情页-搜索组件样式调整

```wxml
<!--pages/search-detail/index.wxml-->
<!-- 搜索框 -->
<van-search
  class="search"
  background="#fafafa"
  shape="round"
  placeholder="输入歌曲名称">
</van-search>
```

```wcss
page {
  padding: 0 20rpx;
  /* 由于搜索框fixed，下面的内容往上移动 */
  padding-top: 56px;
}
/* 搜索框 */
.search {
  position: fixed;
  top: 0;
  left: 20rpx;
  right: 20rpx;
}
```

##### 3. 热门搜索展示

- 写接口请求数据：新建service/search.js

  ```js
  // 请求热门的数据
  export function getHotSearch() {
    return atRequest.get("/search/hot")
  }
  ```

- 请求并保存数据

  ```js
  // pages/search-detail/index.js
  import {getHotSearch} from "../../service/search"
  //  请求网络数据
  getPageDatas: function() {
     getHotSearch().then(res=> {
       this.setData({hotSearch: res.result.hots})
     })
  },
  onLoad: function (options) {
     this.getPageDatas()
  }
  ```

- 展示数据

  ```wxml
  <!-- 热门搜索展示 -->
  <view class="hotSearch">
    <view class="hotSearch-title">热门搜索</view>
    <view class="hotSearch-list">
      <block wx:for="{{hotSearch}}" wx:key="first">
        <view class="hotSearch-item">{{item.first}}</view>
      </block>
    </view>
  </view>
  ```

  ```wcss
  /* 热门搜索 */
  .hotSearch {
    padding: 10rpx;
  }
  .hotSearch-title {
    font-weight: 700;
  }
  .hotSearch-list {
    display: flex;
    flex-wrap: wrap;
  }
  .hotSearch-item {
    font-size: 26rpx;
    background-color: #fff;
    padding: 10rpx 12rpx;
    border-radius: 16rpx;
    margin-right: 20rpx;
    margin-top: 20rpx;
  }
  .hotSearch-item:first-of-type {
    color: #26ce8a;
  }
  ```

##### 4. 搜索建议

0. 接口

   ```js
   // 请求搜索建议的接口
   export function getSuggestions(keywords) {
     return atRequest.get("/search/suggest", {
       keywords,
       type: "mobile"
     })
   }
   ```

1. 请求数据

   ```js
   handleSearchChange: function(e) {
       // console.log(e.detail);
       // 保存搜索关键词
       const searchValue = e.detail
       this.setData({keywors: searchValue})
       // 判断关键词是否为空
       if(!searchValue.length) {
         this.setData({suggestSongs: []})
         return 
       }
        // 搜索建议
        getSuggestions(searchValue).then(res=> {
         // console.log(res.result.allMatch);
         this.setData({suggestSongs: res.result.allMatch})
       })
    },
   ```

2. 展示数据

   ```wxml
   <!-- 搜索建议 -->
   <view class="suggest">
     <view class="search-value">搜索"{{keywors}}"</view>
     <view class="suggest-list">
       <block wx:for="{{suggestSongs}}" wx:key="keyword"> 
         <view class="suggest-item">
           <image class="suggest-img"
             mode="widthFix"
             src="/assets/images/icons/search_icon.png"></image>
           <text class="suggest-item-title">{{item.keyword}}</text>
         </view>
       </block>
     </view>
   </view>
   ```

3. 样式

   ```wcss
   /* 建议搜索 */
   .suggest {
     padding: 10rpx;
   }
   .search-value {
     color: #26ce8a;
     font-size: 34rpx;
     font-weight: 700;
   }
   .suggest-item {
     display: flex;
     align-items: center;
     margin-top: 16rpx;
   }
   .suggest-item-title {
     font-size: 28rpx;
   }
   .suggest-img {
     width: 66rpx;
     margin-left: -20rpx;
   }
   ```

##### 6. 热门搜索与搜索建议不能同时展示

```wxml
<view class="hotSearch" wx:if="{{!keywors.length && !suggestSongs.length}}"></view>
<view class="suggest" wx:else></view>
```

##### 7. 搜索结果

1. 接口

   ```js
   // 请求搜索结果
   export function getSearchResult(keywords) {
     return atRequest.get("/search", {
       keywords
     })
   }
   ```

2. 监听搜索确定,请求数据

   ```wxml\
   <van-search
   class="search"
     background="#fafafa"
     shape="round"
     bind:change="handleSearchChange"
     bind:search="handleSearch"
     placeholder="输入歌曲名称">
   </van-search>
   ```

   ```js
   // 确定搜索
     handleSearch: function() {
       // 保存关键词
       const searchValue = this.data.keywors
       // 请求搜索结果数据
       getSearchResult(searchValue).then(res=> {
         // console.log(res.result.songs);
         this.setData({searchSongsResult: res.result.songs})
       })
     },
   ```

3. 展示数据，并把数据传递给子组件(Item-song-v2)

   ```wxml
   <!-- 搜索结果 -->
   <view class="result" wx:elif="{{searchSongsResult.length}}" >
     <view class="result-title">最佳匹配</view>
     <view class="result-list">
       <block wx:for="{{searchSongsResult}}" wx:key="id">
         <Item-song-v2 item="{{item}}" index="{{index+1}}"></Item-song-v2>
       </block>
     </view>
   </view>
   ```

4. 子组件(Item-song-v2)

   - 结构

     ```wxml
     <view class="item">
       <view class="index">{{index}}</view>
       <view class="item-info">
         <view class="name">{{item.name}}</view>
         <view class="source">
           <image class="item-img" src="/assets/images/icons/sq_icon.png"></image>
           <text>{{item.ar[0].name || item.artists[0].name}}</text>
           <text wx:if="{{item.alia[0] || item.alias[0]}}">
             <text class="dots">·</text>
             <text>{{item.alia[0] || item.alias[0]}}</text>
           </text>
         </view>
       </view>
     </view>
     ```

   - 样式

     ```wcss
     /* components/Item-song-v2/index.wxss */
     .item {
       display: flex;
       align-items: center;
       margin: 36rpx 0 10rpx;
     }
     
     .index {
       font-size: 30rpx;
       padding: 12rpx;
     }
     
     .item-info {
       flex: 1;
       margin-left: 16rpx;
     }
     
     .item-info .name {
       font-size: 30rpx;
     }
     
     .item-info .source {
       display: flex;
       align-items: center;
       font-size: 24rpx;
       color: #666;
       margin-top: 10rpx;
     }
     
     .source .item-img {
       width: 38rpx;
       height: 22rpx;
       margin-right: 10rpx;
     }
     
     .source .dots {
       margin: 0 6rpx;
     }
     ```

##### 8. 点击热门搜索展示搜索结果

1. 点击事件: 通过dataset传递关键词

   ```wxml
   <view class="hotSearch-item"
           bindtap="handleHotSearchClick"
           data-keyword="{{item.first}}"
   >{{item.first}}</view>
   ```

2.  handleHotSearchClick

   ```js
   // 热门搜索处理
     handleHotSearchClick: function(e) {
       // 被点击的关键词
       const searchKeyword = e.currentTarget.dataset.keyword
       this.setData({keywords: searchKeyword})
       // 调用搜索方法
       this.handleSearch()
    },
   ```

##### 9. 搜索建议优化

1. 输入关键词：加防抖，避免短时多次请求

   ```js
   import debounce from '../../utils/debounce'
   const debounceGetSuggestions = debounce( getSuggestions, 300)
   // 搜索建议
   debounceGetSuggestions(searchValue).then(res=> {
     // console.log(res.result.allMatch);
     this.setData({suggestSongs: res.result.allMatch})
   })
   ```

2. 搜索框当有值时，显示取消

   - show-action：是否在搜索框右侧显示取消按钮
   - show-action="{{keywords}}"

3. 搜索建议匹配的歌曲名称与关键词完全一致的部分变色

   ```wxml
   <rich-text nodes="{{suggestSongsNodes[index]}}"></rich-text>
   ```

   - 关键词转换封装函数

     ```js
     export default function stringToNodes(keyword, value) {
       const nodes = []
       if (keyword.toUpperCase().startsWith(value.toUpperCase())) {
         const key1 = keyword.slice(0, value.length)
         const node1 = {
           name: "span",
           attrs: { style: "color: #26ce8a; font-size: 14px;" },
           children: [ { type: "text", text: key1 } ]
         }
         nodes.push(node1)
     
         const key2 = keyword.slice(value.length)
         const node2 = {
           name: "span",
           attrs: { style: "color: #000000; font-size: 14px;" },
           children: [ { type: "text", text: key2 } ]
         }
         nodes.push(node2)
       } else {
         const node = {
           name: "span",
           attrs: { style: "color: #000000; font-size: 14px;" },
           children: [ { type: "text", text: keyword } ]
         } 
         nodes.push(node)
       }
       return nodes
     }
     ```

   - 调用封装函数

     ```js
     import stringToNodes from '../../utils/string2nodes'
     handleSearchChange: function(e) {
         // console.log(e.detail);
         // 保存搜索关键词
         const searchValue = e.detail
         this.setData({keywords: searchValue})
         // 判断关键词是否为空
         if(!searchValue.length) {
           this.setData({suggestSongs: []})
           return 
         }
          // 搜索建议
          debounceGetSuggestions(searchValue).then(res=> {
           // console.log(res.result.allMatch);
           // 1. 根据关键词搜索
           const suggestSongs = res.result.allMatch
           this.setData({suggestSongs})
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
     ```

4. 关键词为空，取消发送网络请求搜索，立刻显示搜索建议

   - debounceGetSuggestions.cancel()
   - if (!suggestSongs) return： 搜索结果为空时直接返回

   ```js
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
   ```


### 7. 歌曲-详情

#### 1. 歌曲推荐-点击歌曲

- 直接在组件Iten-song-v1内部绑定点击事件，跳转到song-player页面

#### 2. 榜单-点击歌曲-跳转

- 直接在组件Iten-song-v2内部绑定点击事件，跳转到song-player页面

  ```wxml
  <view class="item" 
    bindtap="handleSongClick"
    data-item="{{item}}"
    >
  </view>
  ```

  ```js
  // 点击歌曲
      handleSongClick(e) {
        // 保存歌曲id
        const id = e.currentTarget.dataset.item.id
        // console.log(e.currentTarget.dataset.item);
        // 跳转
        wx.navigateTo({
          url: `/pages/song-player/index?id=${id}`,
        })
      }
  ```



#### 3. 歌曲详情-播放页面

##### 1. 数据接口

```js
// 根据id请求歌曲详情
export function getSongDetail(ids) {
  return atRequest.get("/song/detail", {
    ids
  })
}
```

##### 2. 保存歌曲id，请求歌曲数据

```js
// pages/song-player/index.js
import {getSongDetail} from '../../service/play'
onLoad: function (options) {
    // 保存歌曲id
    const id = options.id
    this.setData({id})
    // 请求数据
    this.getPageData(id)
  },

  // 网络请求
  getPageData: function(id) {
    // 请求歌曲数据
    getSongDetail(id).then(res=> {
      // console.log(res.songs[0]);
      this.setData({songInfo: res.songs[0]})
    })
  },
```

##### 3. 页面布局

###### 1. 背景

1. 背景结构

```wxml
<!-- 1. 背景 -->
<image class="bg-image" mode="aspectFill" src="{{songInfo.al.picUrl}}"></image>
<!-- 毛玻璃效果 -->
<view class="bg-cover"></view>
```

```wcss
page {
  color: #fff;
}
/* 背景 */
.bg-image, .bg-cover {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* 只有定位元素可以设置z-index */
  z-index: -1;
}

.bg-cover {
  background-color: rgba(0,0,0,.2);
  /* 为一个元素后面区域添加图形效果（如模糊或颜色偏移）
  为了看到效果，必须使元素或其背景至少部分透明 */
  backdrop-filter: blur(30px);
}
```

2. 启用自定义导航

   - navigationStyle： `custom` 自定义导航栏，只保留右上角胶囊按钮
   - navigationBarTextStyle： 导航栏标题颜色，仅支持 `black` / `white`

   ```json
   "navigationBarTextStyle": "white",
   "navigationStyle": "custom",
   ```

###### 2. 导航

0. 确定导航栏的高度

   ```js
   // 在app.js中获取设备的导航栏高度传递给组件
   // 导航栏高度
   this.globalData.statusBarHeight = info.statusBarHeight
   ```

   ```js
   // 组件获取app.js中高度
   statusBarHeight: getApp().globalData.statusBarHeight
   ```

1. 自定义导航栏，封装组件baseui/nav-bar

   ```wxml
   <!--baseui/nav-bar/index.wxml-->
   <view class="nav">
     <view style="height: {{statusBarHeight}}px;"></view>
     <view class="navbar">
       <view class="left">
         <view class="left-slot"><slot name="left"></slot></view>
         <view class="left-arrow">
           <image class="icon" mode="widthFix" src="/assets/images/icons/arrow-left.png"></image>
         </view>
       </view>
       <view class="center">
         <view class="center-slot"><slot name="title"></slot></view>
         <view class="center-title">{{title}}</view>
       </view>
       <view class="right"></view>
     </view>
   </view>
   ```

   ```wcss
   /* baseui/nav-bar/index.wxss */
   .navbar {
     display: flex;
     height: 44px;
     text-align: center;
   }
   
   .left, .right {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 120rpx;
   }
   
   /* 默认不显示，插槽为空时显示 */
   .left-arrow {
     display: none;
   }
   
   .left-slot:empty + .left-arrow {
     display: block;
   }
   
   .center-title {
     display: none;
   }
   
   .center-slot:empty + .center-title {
     display: block;
   }
   
   .left .left-arrow .icon {
     width: 44rpx;
     /* dispaly解决图片下有3px问题 */
     display: block;
   }
   
   .center {
     display: flex;
     align-items: center;
     justify-content: center;
     flex: 1;
   }
   ```

2. 组件启用多个插槽

   ```js
   options: {
       // 启用多个插槽
       multipleSlots: true
     },
   ```

3. 插槽内容及样式

   ```wxml
   <!-- 2. 导航 -->
   <nav-bar>
     <view slot="title" class="tab">
       <view class="{{currentPage === 0 ? 'active': ''}}">歌曲</view>
       <view class="divider">|</view>
       <view class="{{currentPage === 1 ? 'active': ''}}">歌词</view>
     </view>
   </nav-bar>
   ```

   ```wcss
   /* 导航栏 */
   .tab {
     display: flex;
     font-size: 28rpx;
     color: #999;
   }
   
   .tab .divider {
     margin: 0 10rpx;
   }
   
   .tab .active {
     color: #fff;
   }
   ```

###### 3. 内容

1. 滑动分页高度

   - 使用swiper组件，组件高度等于页面视口高度-设备导航高度-自定义导航栏高度

   - 之前导航栏高度固定44px，现在把高度写在app.js的globalData中动态传过去

     ```js
     onLoad: function (options) {
         // 3.动态计算内容高度
         const globalData = getApp().globalData
         const screenHeight = globalData.screenHeight
         const statusBarHeight = globalData.statusBarHeight
         const navBarHeight = globalData.navBarHeight
         const contentHeight = screenHeight - statusBarHeight - navBarHeight
         this.setData({ contentHeight })
       },
     ```

     ```wxml
     <!--pages/song-player/index.wxml-->
     <swiper class="content" 
             style="height: {{contentHeight}}px;">
         <swiper-item>1</swiper-item>  
         <swiper-item>2</swiper-item>
     </swiper>
     ```

2. 滑动组件事件监听

   - 左右滑动分页效果

     ```wxml
     <swiper class="content" 
             style="height: {{contentHeight}}px;"
             bind:change="handlePageChange">
         <swiper-item>1</swiper-item>  
         <swiper-item>2</swiper-item>
     </swiper>
     ```

     ```js
     // 滑动事件
       handlePageChange: function(e) {
         const current = e.detail.current
         this.setData({currentPage: current})
       }
     ```

3. 内容区适配不同机型如何分配页面高度--第一页
   
      - 整个内容区flex垂直方向布局
      
      - 播放进度条、播放控制按钮栏、歌曲信息三个模块的高度是由内容撑起来的
      
      - 其余高度由图片区域、歌词区域5:1分配
      
        ```wxml
        // 分页第一页- 结构暂时写死
        <swiper class="content" 
                style="height: {{contentHeight}}px;"
                bind:change="handlePageChange">
                <swiper-item class="music">
            <view class="album">
              <image class="image" mode="aspectFill" src="https://p1.music.126.net/aG5zqxkBRfLiV7A8W0iwgA==/109951166702962263.jpg"></image>
            </view>
            <view class="info">
              <view class="title">孤勇者</view>
              <view class="subtitle">
                <view class="singer">孤勇者</view>
                <view class="alias">专辑:《英雄联盟》</view>
              </view>
            </view>
            <view class="lyric">我是歌词, 哈哈哈</view>
            <view class="progress">
            <!-- slider: 滑动选择器 -->
              <slider class="slider" block-size="{{12}}"></slider>
              <view class="time">
                <view class="current">01:22</view>
                <view class="duration">04:33</view>
              </view>
            </view>
            <view class="operation">
              <image class="btn btn-mode" src="/assets/images/player/play_order.png"></image>
              <image class="btn btn-prev" src="/assets/images/player/play_prev.png"></image>
              <image class="btn btn-pause" src="/assets/images/player/play_pause.png"></image>
              <image class="btn btn-next" src="/assets/images/player/play_next.png"></image>
              <image class="btn btn-music" src="/assets/images/player/play_music.png"></image>
            </view>
          </swiper-item>
          <swiper-item class="lyric">2</swiper-item>
        </swiper>
        ```
      
        ```wcss
        /* 内容样式 */
        .content {
          color: #fff;
        }
        
        .content .music {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 30rpx 60rpx;
        }
        
        /* 封面 */
        .album {
          display: flex;
          align-items: center;
          flex: 5;
        }
        
        .album .image {
          width: 100%;
          height: 100%;
          border-radius: 12rpx;
        }
        
        /* 歌曲信息 */
        .music .info {
          margin: 20rpx 0;
        }
        
        .music .info .title {
          font-size: 48rpx;
          font-weight: 700;
        }
        
        .music .info .singer, .music .info .alias {
          font-size: 26rpx;
          color: #ccc;
          margin: 16rpx 0;
        }
        
        /* 歌词 */
        .music .lyric {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        
        /* 进度 */
        .progress {
          margin: 10rpx 0;
        }
        
        .slider {
          margin: 0 0 18rpx 20rpx;
        }
        
        .time {
          display: flex;
          justify-content: space-between;
          color: #ccc;
          font-size: 22rpx;
        }
        
        .time .current {
          margin-left: 10rpx;
        }
        
        
        /* 操作css */
        .operation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20rpx 0 30rpx;
        }
        
        .operation .btn {
          display: inline-block;
          width: 60rpx;
          height: 60rpx;
          padding: 0;
        }
        
        .operation .btn-mode {
          width: 80rpx;
          height: 80rpx;
        }
        
        .operation .btn-pause {
          width: 130rpx;
          height: 130rpx;
        }
        ```
      
4. 歌词展示优化
   
   - 当设备宽高比大于等于2时显示第一页歌词模块，否则隐藏
   
   - app.js获取宽高比，传给页面
   
     ```js
     // 设备宽高比
         const aspectRatio = info.screenHeight / info.screenWidth
         this.globalData.aspectRatio = aspectRatio
     ```
   
   - 控制歌词显示
     
     ```js
     const aspectRatio = globalData.aspectRatio
     this.setData({ contentHeight,isShowLyric: aspectRatio >= 2 })
     ```
   
5. 创建播放器
   
   ```js
   // 4.创建播放器
   const audioContext = wx.createInnerAudioContext()
   audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
       // audioContext.autoplay = true 推荐使用
       audioContext.play()
   ```

##### 4. 播放器优化

###### 1. 页面数据展示

- 播放时长数据获取

  ```js
  getPageData: function(id) {
      // 请求歌曲数据
      getSongDetail(id).then(res=> {
        // console.log(res.songs[0]);
        this.setData({songInfo: res.songs[0],durationTime: res.songs[0].dt})
      })
    },
  ```

- 除去播放进度其他数据展示

  ```wxml
  <swiper class="content" 
          style="height: {{contentHeight}}px;"
          bind:change="handlePageChange">
          <swiper-item class="music">
      <view class="album">
        <image class="image" mode="aspectFill" src="{{songInfo.al.picUrl}}"></image>
      </view>
      <view class="info">
        <view class="title">{{songInfo.name}}</view>
        <view class="subtitle">
          <view class="singer">{{songInfo.ar[0].name}}</view>
          <view class="alias">专辑: {{songInfo.alia[0]}}</view>
        </view>
      </view>
      <view class="lyric" wx:if="{{isShowLyric}}">我是歌词, 哈哈哈</view>
      <view class="progress">
      <!-- slider: 滑动选择器 -->
        <slider class="slider" block-size="{{12}}"></slider>
        <view class="time">
          <view class="current">01:22</view>
          <view class="duration">{{format.formatDuration(durationTime)}}</view>
        </view>
      </view>
      <view class="operation">
        <image class="btn btn-mode" src="/assets/images/player/play_order.png"></image>
        <image class="btn btn-prev" src="/assets/images/player/play_prev.png"></image>
        <image class="btn btn-pause" src="/assets/images/player/play_pause.png"></image>
        <image class="btn btn-next" src="/assets/images/player/play_next.png"></image>
        <image class="btn btn-music" src="/assets/images/player/play_music.png"></image>
      </view>
    </swiper-item>
    <swiper-item class="lyric">2</swiper-item>
  </swiper>
  ```

###### 2. 播放器优化

1. 单独创建store/player.js，创建播放器

   ```js
   const audioContext = wx.createInnerAudioContext()
   
   export {
     audioContext
   }
   ```

2. 双重保险播放歌曲

   ```js
   // 4.播放歌曲
   // 停止前一首
   audioContext.stop()
   audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
   // 双重保险播放
   audioContext.autoplay = true
   audioContext.onCanplay(()=> {
   	audioContext.play()
   })
   ```

##### 5. 播放进度

###### 1. 歌曲当前播放时间

1. 歌曲当前时间

   ```js
       // 4.播放歌曲
       // 停止前一首
       audioContext.stop()
       audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
       // 双重保险播放
       audioContext.autoplay = true
       audioContext.onCanplay(()=> {
         audioContext.play()
       })
       // 歌曲当前时间获取:监听时间变化
       audioContext.onTimeUpdate(()=> {
         const currentTime = audioContext.currentTime * 1000
         this.setData({currentTime})
       })
   ```

###### 2. 点击进度条-更改播放进度

1. 进度条值要根据播放进度改变

   ```wxml
   <slider class="slider" 
       block-size="{{12}}"
       value="{{sliderValue}}"
       ></slider>
   ```

   ```js
   	// 歌曲当前时间获取:监听时间变化
       audioContext.onTimeUpdate(()=> {
         const currentTime = audioContext.currentTime * 1000
         this.setData({currentTime})
   
         // 进度条值
         const sliderValue = currentTime / this.data.durationTime * 100
         this.setData({sliderValue})
       })
   ```

2. 点击进度条-更改播放进度

   ```wxml
   <slider class="slider" 
           block-size="{{12}}"
           value="{{sliderValue}}"
           bindchange="handleSliderChange"
    ></slider>
   ```

   ```js
   // 进度条点击事件处理
     handleSliderChange: function(e) {
       // 1.获取slider变化的值
       const value = e.detail.value
   
       // 2.计算需要播放的currentTime
       const currentTime = this.data.durationTime * value / 100
   
       // 3.设置context播放currentTime位置的音乐
       audioContext.pause()// 暂停一下
       audioContext.seek(currentTime / 1000)
   
       // 4.记录最新的sliderValue
       this.setData({ sliderValue: value})
     }
   ```
###### 3. 拖拽进度条-更改播放进度

1. 当进度条拖动时，不要更新当前播放时间和进度条的值

   ```wxml
   <slider class="slider" 
           block-size="{{12}}"
           value="{{sliderValue}}"
           bindchange="handleSliderChange"
           bindchanging="handleSliderChanging"
   ></slider>
   ```

   ```js
    // 进度条是否正在拖动中
    isSliderChanging: false
   // 歌曲当前时间获取:监听时间变化
       audioContext.onTimeUpdate(()=> {
         const currentTime = audioContext.currentTime * 1000
         // 判断： 当进度条没有点击或拖动时,更新播放时间和进度条值
         if(!this.data.isSliderChanging) {
           // 进度条值更新
           const sliderValue = currentTime / this.data.durationTime * 100
           this.setData({currentTime, sliderValue})
         }
       })
   // 进度条拖动事件--正在拖动中
     handleSliderChanging: function(e) {
       // 1.获取slider变化的值
       const value = e.detail.value
       const currentTime = this.data.durationTime * value / 100
       this.setData({isSliderChanging: true, currentTime, sliderValue: value})
     }
   ```

2. 拖动停止时，将isSliderChaning设置回false

      ```js
      // 进度条点击事件处理
        handleSliderChange: function(e) {
          // 1.获取slider变化的值
          const value = e.detail.value
      
          // 2.计算需要播放的currentTime
          const currentTime = this.data.durationTime * value / 100
      
          // 3.设置context播放currentTime位置的音乐
          audioContext.pause()// 暂停一下
          audioContext.seek(currentTime / 1000)
      
          // 4.记录最新的sliderValue, 并且需要将isSliderChaning设置回false
          this.setData({ sliderValue: value, isSliderChanging: false })
        },
      ```


###### 3.  播放器监听优化

- 把监听代码封装成函数

  -  this.setupAudioContextListener()

  ```js
  //  ======================== audio监听 ===============================
    setupAudioContextListener: function() {
      // 歌曲当前时间获取:监听时间变化
      audioContext.onTimeUpdate(()=> {
        const currentTime = audioContext.currentTime * 1000
        // 判断： 当进度条没有点击或拖动时,更新播放时间和进度条值
        if(!this.data.isSliderChanging) {
          // 进度条值更新
          const sliderValue = currentTime / this.data.durationTime * 100
          this.setData({currentTime, sliderValue})
        }
      })
    }
  ```

###### 4. 歌词的请求与解析

1. 歌词请求

   ```js
   // player.js
   // 请求歌词
   export function getSongLyric(id) {
     return atRequest.get("/lyric", {
       id
     })
   }
   ```

   ```js
   // song-player/index.js
   //  ======================== 网络请求 ===============================
     getPageData: function(id) {
       // 请求歌曲数据
       getSongDetail(id).then(res=> {
         // console.log(res.songs[0]);
         this.setData({songInfo: res.songs[0],durationTime: res.songs[0].dt})
       })
       // 歌词
       getSongLyric(id).then(res => {
         const lyricString = res.lrc.lyric
         const lyrics = parseLyric(lyricString)
         // console.log(lyrics)
         this.setData({ lyricInfos: lyrics })
       })
     },
   ```

2. 歌词解析函数封装： utils/parse-lyric

   ```js
   // 正则(regular)表达式(expression): 字符串匹配利器
   
   // [00:58.65]
   const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
   
   export function parseLyric(lyricString) {
     const lyricStrings = lyricString.split("\n")
   
     const lyricInfos = []
     for (const lineString of lyricStrings) {
       // [00:58.65]他们说 要缝好你的伤 没有人爱小丑
       const timeResult = timeRegExp.exec(lineString)
       if (!timeResult) continue
       // 1.获取时间
       const minute = timeResult[1] * 60 * 1000
       const second = timeResult[2] * 1000
       const millsecondTime = timeResult[3]
       const millsecond = millsecondTime.length === 2 ? millsecondTime * 10: millsecondTime * 1
       const time = minute + second + millsecond
   
       // 2.获取歌词文
       const text = lineString.replace(timeRegExp, "")
       lyricInfos.push({ time, text })
     }
   
     return lyricInfos
   }
   ```

###### 5. 根据当前时间查找歌词

```js
data: {
    // 歌词信息
    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "",
}
//  ======================== audio监听 ===============================
  setupAudioContextListener: function() {
    // 歌曲当前时间获取:监听时间变化
    audioContext.onTimeUpdate(()=> {
      //  1. 获取当前时间
      const currentTime = audioContext.currentTime * 1000
      // 2. 判断： 当进度条没有点击或拖动时,更新播放时间和进度条值
      if(!this.data.isSliderChanging) {
        // 进度条值更新
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({currentTime, sliderValue})
      }

      //  3. 根据当前时间查找播放歌词
      let i = 0
      // 遍历所有歌词，比较时间
      for (; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i]
        if (currentTime < lyricInfo.time) {
          // 找到比当前时间大的就停止遍历
          break
        }
      }
      // 设置当前歌词的索引和内容
      const currentIndex = i - 1
      if (this.data.currentLyricIndex !== currentIndex) {
        const currentLyricInfo = this.data.lyricInfos[currentIndex]
        this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex })
      }
    })
  },
```

```wxml
<view class="lyric" wx:if="{{isShowLyric}}">{{currentLyricText}}</view>
```

- 设置歌词颜色

  ```wcss
  .music .lyric {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    font-size: 28rpx;
    color: #1AAD19;
  }
  ```

##### 6. 滑动分页-歌词展示

1. 结构-歌词滚动

   ```wxml
    <swiper-item class="lyric">
       <!-- scroll-top： 设置竖向滚动条位置 -->
       <scroll-view class="lyric-list"
                    scroll-y
                    scroll-top="{{lyricScrollTop}}"
                    scroll-with-animation>
         <block wx:for="{{lyricInfos}}" wx:key="index">
           <view class="item {{currentLyricIndex === index ? 'active': ''}}"
                 style="padding-top: {{index === 0 ? (contentHeight/2-100): 0}}px; padding-bottom: {{index === lyricInfos.length - 1 ? (contentHeight/2+100): 0}}px;">
             {{item.text}}
           </view>
         </block>
       </scroll-view>
     </swiper-item>
   ```

   ```js
   /* 歌词分页的样式 */
   .lyric-list {
     height: 100%;
     box-sizing: border-box;
     overflow: hidden;
   }
   /* 定义滚动条高度及北京高宽分别对应横竖滚动条的尺寸 */
   ::-webkit-scrollbar {
     width: 0;
     height: 0;
     color: transparent;
   }
   
   .lyric-list .item {
     height: 35px;
     line-height: 35px;
     font-size: 28rpx;
     text-align: center;
     color: #989898;
   
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
   }
   
   .lyric-list .item.active {
     color: #26ce8a;
     font-size: 36rpx;
   }
   ```

   ```js
    // 设置当前歌词的索引和内容
         const currentIndex = i - 1
         if (this.data.currentLyricIndex !== currentIndex) {
           const currentLyricInfo = this.data.lyricInfos[currentIndex]
           this.setData({ 
             currentLyricText: currentLyricInfo.text,
             currentLyricIndex: currentIndex ,
             // 35是设置歌词时固定的值
             lyricScrollTop: currentIndex * 35
           })
         }
   ```

#### 4. 歌曲播放页面-返回

- 点击左边区域，返回上一页

- 直接在nav-bar组件绑定点击事件handleLeftClick

- 然后把使用nav-bar组件的页面监听点击事件

  ```wxml
  // nav-bar/index.wxml
  <view class="left" bindtap="handleLeftClick">
        <view class="left-slot"><slot name="left"></slot></view>
        <view class="left-arrow">
          <image class="icon" mode="widthFix" src="/assets/images/icons/arrow-left.png"></image>
        </view>
      </view>
  ```

  ```js
  // baseui/nav-bar/index.js
  // 返回
      handleLeftClick: function() {
        this.triggerEvent("click")
      }
    }
  ```

  ```wxml
  <!--pages/song-player/index.wxml-->
  <nav-bar bind:click="handleBackClick"></nav-bar>
  ```

  ```js
  // pages/song-player/index.js
  // ============================ 左边返回事件 ===============================
    handleBackClick: function() {
      wx.navigateBack()
    },
  ```

  

#### 5. 页面重构

##### 1. 有关歌曲状态信息抽取

- 点击歌曲，获取歌曲id，然后请求歌曲信息，保存歌曲信息，这些数据不能直接在song-player页面直接请求

- 因为会多处用到，应该请求后共享使用

  1. 先抽取 歌曲数据请求方法

     ```js
     import {HYEventStore} from "hy-event-store"
     import {getSongDetail, getSongLyric} from "../service/play"
     import {parseLyric} from "../utils/parse-lyric"
     
     const audioContext = wx.createInnerAudioContext()
     const playerStore = new HYEventStore({
       state: {
         id: 0,
         songInfo: {},
         // 歌曲总时长
         durationTime: 0,
         // 歌词信息
         lyricInfos: [],
       },
       actions: {
         playMusicWithSongIdAction(ctx, {id}) {
           ctx.id = id
     
           // 请求歌曲数据
           getSongDetail(id).then(res=> {
             ctx.songInfo = res.songs[0],
             ctx.durationTime = res.songs[0].dt
           })
           // 歌词
           getSongLyric(id).then(res => {
             const lyricString = res.lrc.lyric
             const lyrics = parseLyric(lyricString)
             ctx.lyricInfos = lyrics
           })
         }
       }
     })
     
     export {
       audioContext,
       playerStore
     }
     ```

  2. song-player页面 监听数据变化

     ```js
     // 在onload函数中监听
      onLoad: function (options) {
         ......
         // 2.  请求数据
         // this.getPageData(id)
         this.setupPlayerStoreListener()
     	......
     },
     // ======================== 监听有关playerstore ===============================
       setupPlayerStoreListener: function() {
         playerStore.onStates(["songInfo","durationTime","lyricInfos"], 
         ({songInfo,durationTime,lyricInfos}) => {
           if(songInfo) this.setData({songInfo})
           if(durationTime) this.setData({durationTime})
           if(lyricInfos) this.setData({lyricInfos})
         })
       }
     ```

  3. 在Item-song-v1和v2中传递id请求数据

     ```js
     import {playerStore} from "../../store/index"
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
     ```

##### 2. 播放歌曲抽离

- 现在是只能在播放页面播放歌曲，但是需求上可以在不同页面播放歌曲

- 抽离到共享文件中,在请求数据后，播放歌曲

  ```js
  // store/player.js
  playMusicWithSongIdAction(ctx, {id}) {
        ctx.id = id
        // 1. 请求数据
        // 请求歌曲数据
        getSongDetail(id).then(res=> {
          ctx.songInfo = res.songs[0],
          ctx.durationTime = res.songs[0].dt
        })
        // 歌词
        getSongLyric(id).then(res => {
          const lyricString = res.lrc.lyric
          const lyrics = parseLyric(lyricString)
          ctx.lyricInfos = lyrics
        })
  
        // 2. 根据id播放歌曲
        // 停止前一首
        audioContext.stop()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        // // 双重保险播放
        audioContext.autoplay = true
      }
  ```
  

##### 3. 播放监听逻辑抽取

```js
// store/player.js
state: {
    ....
    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",
}
actions: {
     playMusicWithSongIdAction(ctx, {id}) {
         .....
         // 3. 监听audioContext
      this.dispatch("setupAudioContextListenerAction")
     },
     // 监听事件
    setupAudioContextListenerAction(ctx) {
      // 监听歌曲可以播放
      audioContext.onCanplay(()=> {
        audioContext.play()
      })

      // 歌曲当前时间获取:监听时间变化
     audioContext.onTimeUpdate(()=> {
       //  1. 获取当前时间
       const currentTime = audioContext.currentTime * 1000

       // 2.根据当前时间修改currentTime
       ctx.currentTime = currentTime

       //  3. 根据当前时间查找播放歌词
       // 遍历所有歌词，比较时间
       if (!ctx.lyricInfos.length) return
       let i = 0
       for (; i < ctx.lyricInfos.length; i++) {
         const lyricInfo = ctx.lyricInfos[i]
         if (currentTime < lyricInfo.time) {
           // 找到比当前时间大的就停止遍历
           break
         }
       }
       // 设置当前歌词的索引和内容
       const currentIndex = i - 1
       if (ctx.currentLyricIndex !== currentIndex) {
         const currentLyricInfo =ctx.lyricInfos [currentIndex]
           ctx.currentLyricText = currentLyricInfo.text
           ctx.currentLyricIndex = currentIndex 
         
       }
     })
    }
}
```

```js
// 
// ======================== 监听有关playerstore ===============================
  setupPlayerStoreListener: function() {
    .....
    
    // 监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词滚动变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })
  }
```

#### 6. 歌曲播放模式

##### 1. 模式-图标切换

- 模式原始信息保存在共享状态文件中： store/player.js

- 模式代表的功能未实现

0. 歌曲模式

   ```js
   state: {
        // 播放模式
       playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放
   }
   actions: {
       
   }
   ```

   

1.  图标绑定点击事件

   ```wxml
   <image class="btn btn-mode" 
           src="/assets/images/player/play_{{playModeName}}.png"
           bindtap="handleModeChangeClick"
   ></image>
   ```

   ```js
   // 歌曲模式数组
   const playModeNames = ["order", "repeat", "random"]
   data: {
       // 歌曲模式
       playModeIndex: 0,
       playModeName: "order",
   }
   // ========================== 歌曲模式 ===============================
     handleModeChangeClick: function() {
       // 切换模式
       // 计算新的playModeIndex： 点击一次加1
       let playModeIndex = this.data.playModeIndex + 1
       if (playModeIndex === 3) playModeIndex = 0
   
       // 设置playerStore中的playModeIndex
       playerStore.setState("playModeIndex", playModeIndex)
     },
   // ======================== 监听有关playerstore ===============================
     setupPlayerStoreListener: function() {
       ..............
       // 3. 歌曲模式监听
       playerStore.onStates(["playModeIndex"], ({playModeIndex})=> {
         if (playModeIndex !== undefined) {
           this.setData({ 
             playModeIndex, 
             playModeName: playModeNames[playModeIndex] 
           })
         }
       })
     }
   ```

#### 7. 歌曲暂停播放

##### 1. 播放初始状态

```js
// player.js
state: {
    // 歌曲是否播放
    isPlaying: false,
}
actions: {
	........
    // 播放暂停
    changeMusicPlayStatusAction(ctx) {
      ctx.isPlaying = !ctx.isPlaying
      ctx.isPlaying ? audioContext.play(): audioContext.pause()
    }
  }
```

##### 2. 绑定点击暂停事件

```wxml
<image class="btn btn-pause" 
      src="/assets/images/player/play_{{playingName}}.png"
      bindtap="handlePlayBtnClick"
></image>
```

```js
data:{
     // 播放状态
    isPlaying: false,
    playingName: "pause", 
}
// ========================= 歌曲播放状态 ============================
  handlePlayBtnClick: function() {
    playerStore.dispatch("changeMusicPlayStatusAction")
  },
// ======================== 监听有关playerstore ===============================
  setupPlayerStoreListener: function() {
   .............
    // 3. 歌曲模式监听
    playerStore.onStates(["playModeIndex","isPlaying"], ({playModeIndex,isPlaying})=> {
      ..........
      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying,
          playingName: isPlaying ? "pause": "resume" 
        })
      }
    })
  }
```

#### 8. 播放列表

##### 1. 歌曲列表获取

- 播放列表歌曲取决于是从哪里点击进入

- 如果是歌曲推荐，那么就是6首歌曲

- 如果是歌曲推荐-更多或者歌单里的歌曲，则是对应展示的歌曲列表

  1. 歌曲推荐

     ```wxml
     <!-- 歌曲推荐 -->
     <view class="recommend-song" wx:if="{{recommendSongs.length > 0}}">
       <area-header title="歌曲推荐" 
         bind:MoreClick="handleMoreClick"></area-header>
       <view class="song-list">
         <block wx:for="{{recommendSongs}}" wx:key="id">
           <Item-song-v1  item="{{item}}"
            bindtap="handleGetSongList"
            data-index="{{index}}"
           ></Item-song-v1>
         </block>
       </view>
     </view>
     ```

     ```js
     // pages/home-music/index.js
     handleGetSongList: function(e) {
         // 获取被点击的歌曲索引
         const index = e.currentTarget.dataset.index
         // 把数据传递到共享数据里
         playerStore.setState("playListSongs", this.data.recommendSongs)
         playerStore.setState("playListIndex", index)
       }
     ```

  2. 榜单-点击歌曲

     ```wxml
     <!--pages/songs-detail/index.wxml-->
     <view class="song-list">
       <block wx:for="{{songInfo.tracks}}" wx:key="id">
         <Item-song-v2 item="{{item}}" index="{{index+1}}"
         bindtap="handleGetSongList"
         data-index="{{index}}"
         ></Item-song-v2>
       </block>
     </view>
     ```

     ```js
     // pages/songs-detail/index.js
      // 获取歌曲列表
       handleGetSongList:function(e) {
         // 获取被点击的歌曲索引
         const index = e.currentTarget.dataset.index
         // 把数据传递到共享数据里
         playerStore.setState("playListSongs", this.data.songInfo.tracks)
         playerStore.setState("playListIndex", index)
       }
     ```

##### 2. 歌曲列表可视化

  1. 暂未做

#### 9. 上一首、下一首

##### 1. 上一首、下一首

- 监听对应按钮点击事件

  ```js
  // pages/song-player/index.js
  // =========================  上一首 =====================================
    handlePrevBtnClick:function() {
      playerStore.dispatch("changeNewMusicAction", false)
    },
    // =========================  下一首 =====================================
    handleNextBtnClick: function() {
      playerStore.dispatch("changeNewMusicAction")
    },
  ```

- 把切换歌曲的逻辑封装在共享文件player.js中

  ```js
   changeNewMusicAction(ctx, isNext = true) {
        // 1.获取当前索引
        let index = ctx.playListIndex
  
        // 2.根据不同的播放模式, 获取下一首歌的索引
        switch(ctx.playModeIndex) {
          case 0: // 顺序播放
            index = isNext ? index + 1: index -1
            if (index === -1) index = ctx.playListSongs.length - 1
            if (index === ctx.playListSongs.length) index = 0
            break
          case 1: // 单曲循环
            break
          case 2: // 随机播放
            index = Math.floor(Math.random() * ctx.playListSongs.length)
            break
        }
  
        // console.log(index)
  
        // 3.获取歌曲
        let songInfo = ctx.playListSongs[index]
        if (!songInfo) {
          songInfo = ctx.songInfo
        } else {
          // 记录最新的索引
          ctx.playListIndex = index
        }
  
        // console.log(songInfo);
  
        // 4.播放新的歌曲
        this.dispatch("playMusicWithSongIdAction", { id: songInfo.id, isRefresh: true })
      }
  ```

- 同时，切换歌曲时，如果切换的是同一首歌也要重新播放: isRefresh强制刷新

  ```js
   // 请求数据,播放音乐
      playMusicWithSongIdAction(ctx, {id, isRefresh = false}) {
        // 判断是否同一首歌
        if(ctx.id === id && !isRefresh) {
          // 如果传进来的id与保存的id一致，者两次点击的是同一首
          this.dispatch("changeMusicPlayStatusAction", true)
          return 
        }
        ............
      }
  ```

#### 10. 监听歌曲播放优化

- 起初，播放歌曲时每次都监听audioContext：  this.dispatch("setupAudioContextListenerAction")

- 不需要每次监听，只在歌曲第一次播放时监听

  ```js
   playMusicWithSongIdAction(ctx, {id, isRefresh = false}) {
        ...............
        // 3. 监听audioContext
        if(ctx.isFirstPlay) {
          this.dispatch("setupAudioContextListenerAction")
          ctx.isFirstPlay = false
        }
        
      },
  ```

#### 11. 自动播放下一首

- 一首歌播放完自动播放下一首

- 监听播放器

  ```js
  // 监听播放器事件
      setupAudioContextListenerAction(ctx) {
        ............
        // 3. 监听歌曲播放完成
        audioContext.onEnded(() => {
          this.dispatch("changeNewMusicAction")
        })
      },
  ```

#### 12. 正在播放-播放栏

##### 1. 播放栏结构样式

- playSong是正在播放的歌曲
- 监听播放器获取共享数据songInfo赋值给playSong

```wxml
<!--pages/home-music/index.wxml-->
<!-- 播放工具栏 -->
<view class="play-bar">
  <view class="left">
    <image class="album" mode="aspectFill" src="{{playSong.al.picUrl}}"></image>
    <view class="name">{{playSong.name}}</view>
  </view>
  <view class="right">
    <image class="icon play" src="/assets/images/music/play_icon.png"></image>
    <image class="icon playlist" src="/assets/images/music/playlist_icon.png"></image>
  </view>
</view>
```

```wcss
/* 播放工具栏 */
.play-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 8px;

  position: fixed;
  left: 0;
  right: 0;
  height: 44px;
  bottom: 0;

  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

  background: #fafafa;
}

.play-bar .left, .play-bar .right {
  display: flex;
  align-items: center;
}

.play-bar .left .album {
  position: relative;
  top: -8px;

  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.play-bar .left .name {
  font-size: 14px;
  margin-left: 10rpx;
}

.play-bar .right .icon {
  width: 30px;
  height: 30px;
}

.play-bar .right .play {
  width: 25px;
  height: 25px;
  margin-right: 10rpx;
}
```

1. 把home-music的js文件中有关store监听的逻辑封装在一个函数(setupStoreListener)中

   ```js
   // =============  监听store ==========================
     setupStoreListener: function() {
       // 1. 排行榜监听
       // 从store获取共享数据并保存 : 热歌榜·
       rankingStore.onState("hotRanking", (res)=> {
         // 第一次拿到的是空对象
         // console.log(res);
         if(!res.tracks) return
         const recommendSongs = res.tracks.slice(0, 6)// 只要前6条数据
         this.setData({recommendSongs})
       }),
   
       // 新歌榜、原创榜、飙升榜首页都只需要3条数据，封装方法获取共享数据
       rankingStore.onState("newRanking", this.getRankingHandler(0))
       rankingStore.onState("orignRanking", this.getRankingHandler(2))
       rankingStore.onState("upRanking", this.getRankingHandler(3))
   
       // 2. 播放器监听
       playerStore.onStates(["songInfo"], ({songInfo})=> {
         if(songInfo) 
         this.setData({playSong: songInfo})
       })
     },
   ```

2. 然后再页面加载完成时调用函数，获取共享数据

   ```js
   onLoad: function (options) {
       // 获取页面数据
       this.getPageDatas()
   
       // 获取共享数据
       rankingStore.dispatch("getRankingDataAction")
   
       // 从store获取共享的数据
       this.setupStoreListener()
     },
   ```

##### 2. 播放栏-播放控制

- 绑定点击事件： handlePlayBtnClick

- 更改播放状态(player.js中)

- 监听播放器，获取播放状态

  ```js
  // pages/home-music/index.js
  // =============  监听store ==========================
    setupStoreListener: function() {
     ......................
      // 2. 播放器监听
      playerStore.onStates(["songInfo","isPlaying"], ({songInfo,isPlaying})=> {
        if(songInfo) {
          this.setData({playSong: songInfo})
        }
        if(isPlaying !== undefined) {
          this.setData({isPlaying})
        }
      })
    },
  ```

- 根据播放状态显示按钮样式

  ```wxml
  <!-- 播放工具栏 -->
  <view class="play-bar">
    <view class="left">
      <image class="album" mode="aspectFill" src="{{playSong.al.picUrl}}"></image>
      <view class="name">{{playSong.name}}</view>
    </view>
    <view class="right">
      <image class="icon play" 
      bindtap="handlePlayBtnClick"
      src="/assets/images/music/{{isPlaying ? 'pause': 'play'}}_icon.png"
      ></image>
      <image class="icon playlist" src="/assets/images/music/playlist_icon.png"></image>
    </view>
  </view>
  ```

- 点击播放或暂停-更改播放状态

  ```js
  // pages/home-music/index.js
  // 播放暂停
    handlePlayBtnClick: function() {
      playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
    }
  ```

##### 3. 正在播放-图片旋转

- 使用css3动画
- 停止动画： 添加属性animation-play-state，running动画运行，paused动画停止
- 动画状态由isPlaying决定 : playAnimState: isPlaying ? "running":"paused"

   ```wxml
   <!-- 播放工具栏 -->
   <view class="play-bar">
     <view class="left">
       <image class="album album-animation" 
       mode="aspectFill" 
       style="animation-play-state:{{playAnimState}} "
       src="{{playSong.al.picUrl}}"></image>
       <view class="name">{{playSong.name}}</view>
     </view>
     ..............
   </view>
   ```

```wcss
/* 图片旋转动画 */
@keyframes albumRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.album-animation {
  animation: albumRotate 17s linear infinite;
}
```

```js
// =============  监听store ==========================
  setupStoreListener: function() {
    ................
    // 2. 播放器监听
    playerStore.onStates(["songInfo","isPlaying"], ({songInfo,isPlaying})=> {
      if(songInfo) {
        this.setData({playSong: songInfo})
      }
      if(isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playAnimState: isPlaying ? "running":"paused"
        })
      }
    })
  },
```

##### 4. 播放栏-bug

###### 1. 控制显示

- 播放栏只有在有歌曲正在播放时才需要显示

- playSong默认为{}, 所以直接通过{}是否有id判断当前是否有歌曲正在播放

  ```wxml
  <!-- 播放工具栏 -->
  <view class="play-bar" wx:if="{{playSong.id}}">
  ..........
  </view>
  ```

###### 2. 播放栏遮盖问题

- 当播放栏显示时，会遮盖榜单底部一部分

- 解决方法是在页面底部放在一个高度和播放栏一致的空盒子，当播放栏显示时空盒子也显示

  ```wxml
  <!-- 占位空盒子 -->
  <view class="play-bar-placeholder" wx:if="{{playSong.id}}"></view>
  <!-- 播放工具栏 -->
  ```

  ```wcss
  /* 占位盒子 */
  .play-bar-placeholder {
    height: 44px;
  }
  ```

###### 3. 点击播放栏进入播放页面

1. 页面跳转

  ```wxml
  <!-- 播放工具栏 -->
  <view class="play-bar" wx:if="{{playSong.id}}" bindtap="handlePlayBarClick">
  .............
  </view>
  ```

  ```js
  // 点击播放栏-进入播放页面
    handlePlayBarClick: function() {
      wx.navigateTo({
        url: '/pages/song-player/index?id=' + this.data.playSong.id,
      })
    }
  ```

2. 点击播放-暂停按钮，禁止冒泡跳转页面

- bindtap改为catchtap

### 8. 细节优化

#### 1. 轮播图高度

- 轮播图某些时候高度会变成240px，按照设想轮播图高度有图片加载完成后确定

- 使用节流后，只在第一张图片加载完成后请求高度

- 由于小程序自身的问题，导致上面的bug

- 解决： 在最后一张图片加载完成后也请求一次高度

  ```js
  // home-music/index.js
  // 节流 {trailing: true}
  const throttleQueryRect = throttle(queryRect, 1000,{trailing: true})
  ```

  - 好像解决了

#### 2. 播放状态更改

- 直接取反太绝对了，应该把播放状态传参

  ```js
  // store/player.js
  // 播放暂停
      changeMusicPlayStatusAction(ctx, isPlaying = true) {
        ctx.isPlaying = isPlaying
        ctx.isPlaying ? audioContext.play(): audioContext.pause()
      }
  ```

  ```js
  // pages/song-player/index.js
  // ========================= 歌曲播放状态 ============================
    handlePlayBtnClick: function() {
      playerStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
    },
  ```

#### 3. 点击同一首歌

- 如果点击的是同一首歌，那么第二次点击进去的时候保留上次的播放进度

- 如果上一次离开时点击了暂停，第二次点击进去应该立刻开始播放

  ```js
  // 请求数据
      playMusicWithSongIdAction(ctx, {id}) {
        // 判断是否同一首歌
        if(ctx.id === id) {
          // 如果传进来的id与保存的id一致，者两次点击的是同一首
          // true播放
          this.dispatch("changeMusicPlayStatusAction", true)
          return 
        }
  
        ctx.id = id
        // 0. 播放状态
        ................
      },
  ```

#### 4. 清空残留信息

- 点击播放一首新的歌曲，要清空上一首歌曲残留的信息

  ```js
  // 请求数据
      playMusicWithSongIdAction(ctx, {id}) {
        ............
        // 0. 播放状态
        // 清空上一首歌曲信息
        ctx.isPlaying = true
        ctx.currentSong = {}
        ctx.durationTime = 0
        ctx.lyricInfos = []
        ctx.currentTime = 0
        ctx.currentLyricIndex = 0
        ctx.currentLyricText = ""
        ................
      },
  ```


#### 5. 后台播放

- 退出小程序也能继续播放音乐

- 把音频管理器换成背景音频管理器

  ```js
  // store/player.js
  // 前台播放器
  // const audioContext = wx.createInnerAudioContext()
  const audioContext = wx.getBackgroundAudioManager() // 背景音频管理器,小程序切入后台，如果音频处于播放状态，可以继续播放
  ```

- 同时必须要设置属性requiredBackgroundModes以及title，背景音频管理器才会生效

  ```json
  // app.json
  "requiredBackgroundModes": ["audio"],
  ```

- 根据id播放歌曲时先把id设置为title

- 请求到歌曲数据后再把歌曲名称设置为title

  ```js
  // store/player.js
   playMusicWithSongIdAction(ctx, {id, isRefresh = false}) {
       ................
        // 1. 请求数据
        // 请求歌曲数据
        getSongDetail(id).then(res=> {
          ctx.songInfo = res.songs[0],
          ctx.durationTime = res.songs[0].dt
          // 请求到歌曲信息后，把title设置为歌曲名称
          audioContext.title = res.songs[0].name
        })
       ..........................
        // 2. 根据id播放歌曲
        // 停止前一首
        audioContext.stop()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        // 后台播放音乐，必须设置title
        audioContext.title = id
        // 播放
        audioContext.autoplay = true
  	...............
        
      },
  ```

#### 6. 监听音乐暂停-播放

- 后台音乐播放暂停时，播放页面的状态要随之改变

- 监听播放器

  ```js
  // store/player.js
  // ==================== 2. 监听播放器事件 ======================
      setupAudioContextListenerAction(ctx) {
        ..............................
        
        // 4 ==================== 监听音乐播放暂停 ============ 
        // 播放
        audioContext.onPlay(()=> {
          ctx.isPlaying = true
        })
        // 暂停
        audioContext.onPause(()=> {
          ctx.isPlaying = false
        })
      },
  ```

#### 7. 6引起的bug

- 监听后台音乐播放暂停后，拖动歌曲播放进度条，开始拖动和停止拖动的瞬间，播放暂停图标会变化

- 解决方法： 点击进度条时，不要暂停了 // audioContext.pause()// 暂停一下

  ```js
  // pages/song-player/index.js
  // ======================== 进度条点击事件处理 ===============================
    handleSliderChange: function(e) {
      // 1.获取slider变化的值
      const value = e.detail.value
  
      // 2.计算需要播放的currentTime
      const currentTime = this.data.durationTime * value / 100
  
      // 3.设置context播放currentTime位置的音乐
      // audioContext.pause()// 暂停一下
      audioContext.seek(currentTime / 1000)
  
      // 4.记录最新的sliderValue, 并且需要讲isSliderChaning设置回false
      this.setData({ sliderValue: value, isSliderChanging: false })
    },
  ```

#### 8. 后台播放停止后-在播放

- 退出小程序，点击x号停止音乐播放

- 再点击播放不能继续播放音乐，因为歌曲信息被清空，需要重新设置歌曲src

- isStoping歌曲是否停止播放

- 检测到音乐停止时，修改isPlaying、isStoping

- 重新设置歌曲src

  ```js
  // player.js
   // ==================== 2. 监听播放器事件 ======================
      setupAudioContextListenerAction(ctx) {
        // 1. =============== 监听歌曲可以播放=============
        audioContext.onCanplay(()=> {
          audioContext.play()
        })
  
        // 2. =============  歌曲当前时间获取:监听时间变化 ===============
       audioContext.onTimeUpdate(()=> {
         .............
        // 停止
        audioContext.onStop(()=> {
          /**
           * 当检测到音乐停止后，再次点击播放按钮，不会在播放音乐
           * 歌曲数据已经被清空
           * 需要在播放歌曲时(changeMusicPlayStatusAction)重新设置src
           */
          ctx.isPlaying = false
          ctx.isStoping = true
        })
      },
  // =======================3. 播放-暂停 ============================
      changeMusicPlayStatusAction(ctx, isPlaying = true) {
        ctx.isPlaying = isPlaying
        // 重新设置src
        if(ctx.isPlaying && ctx.isStoping) {
          audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
          audioContext.title = id
          // 重设歌曲播放状态
          ctx.isStoping = false
        }
        ctx.isPlaying ? audioContext.play(): audioContext.pause()
      },
  ```

#### 9. 个人出现的问题

- 当我退出小程序时，那个后台播放音乐的按钮不显示，暂时未解决



## 小程序登录流程分析

### 一、为何需要用户登录

用户粘性

- 登录流程
  ![小程序用户登录的流程1](https://img-blog.csdnimg.cn/ddfbc1425ee445cca080a66499b9422e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAeHhxc3NzcXM=,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 登录实现

  1. 在app.js加载函数中

  ```js
  //  ==================== 2. 用户默认进行登录 ===================
  this.loginAction()
  loginAction: function() {
      // 1. 获取code
      wx.login({
        timeout: 1000,
        success: res=> {
          console.log(res.code);
        },
        fail: err => {
          console.log(err);
        }
      })
    }
  ```

  2. 将wx.login封装： service/login.js

  ```js
  export function getLoginCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 1000,
        success: res => {
          const code = res.code
          resolve(code)
        },
        fail: err => {
          console.log(err)
          reject(err)
        }
      })
    })
  }
  ```


  ```js
  // app.js
  loginAction: async function() {
      // 1. 获取code
      const code = await getLoginCode()
      console.log(code);
    }
  ```

  3. 将code发送给服务器

  - 服务器: 登录服务器和数据接口服务器不在同一服务器

  ```js
  // service/index.js
  const BASE_URL = "http://123.207.32.32:9001"
  
  const LOGIN_BASE_URL = "http://123.207.32.32:3000"
  
  class ATRequest {
    constructor(baseURL) {
      this.baseURL = baseURL
    }
  
    request(url, method, params) {
      return new Promise((resolve, reject) => {
        wx.request({
          url:this.baseURL + url,
          method: method,
          data: params,
          success: function(res) {
            resolve(res.data)
          },
          fail: reject
        })
      })
    }
  
    get(url, params) {
      return this.request(url, "GET", params)
    }
  
    post(url, data) {
      return this.request(url, "POST", data)
    }
  }
  
  const atRequest = new ATRequest(BASE_URL)
  const atLoginRequest = new ATRequest(LOGIN_BASE_URL)
  
  export default atRequest
  export {
    atLoginRequest
  }
  ```

  4. 将code转换成token

  ```js
  // login.js
  export function codeToToken(code) {
    return atLoginRequest.post("/login", { code })
  }
  ```

  5. 将token发送给服务器

  - token用常量表示

  - constants/token-const.js

    ```js
    export const TOKEN_KEY = "token_key"
    ```

    ```js
    // app.js
     loginAction: async function() {
        // 1. 获取code
        const code = await getLoginCode()
        
        // 2. 将code发送给服务器
        const result = await codeToToken(code)
        const token = result.token
        wx.setStorageSync(TOKEN_KEY, token)
      }
    ```

  6. 登录前要进行判断
   - 检查token是否过期，需要把token放在header中传递过去
   - 所以service/index.js需要设置header，默认header = {}，修改对应参数

  ```js
  // app.js
  //  ==================== 2. 用户进行登录 ===================
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
  ```

  ```js
  // login.js
  // 检查token是否过期
  export function checkToken(token) {
    // 这里要传递header，里面包含token
    return atLoginRequest.post("/auth", {}, {
      token
    })
  }
  
  // 检查Session是否过期
  export function checkSession() {
    return new Promise((resolve) => {
      wx.checkSession({
        success: () => {
          resolve(true)
        },
        fail: () => {
          resolve(false)
        }
      })
    })
  }
  ```

- 登陆判断还可以优化跳过了未优化



### 二、 如何识别同一个小程序用户身份

openid和unionid

获取code

换取authToken

### 三、如何获取用户信息

- wx.getUserProfile(Object object)

- 获取用户信息

- 页面产生点击事件（例如 `button` 上 `bindtap` 的回调中）后才可调用，每次请求都会弹出授权窗口，用户同意后返回 `userInfo`

  ```wxml
  <button open-type="getUserInfo" bindtap="handleGetUser">获取用户信息</button>
  ```

  ```js
   handleGetUser: async function(event) {
      const userInfo = await getUserInfo()
      console.log(userInfo)
    },
  ```

  ```js
  export function getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '你好啊,李银河',
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          // reject(err)
          resolve(err)
        }
      })
    })
  }
  ```

  

### 四、用户身份多平台分享

unionid 唯一标识、微信多个平台进行授权，相同的id

- 绑定手机号(非个人开发才能获取手机号)

- 需要将 [button](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) 组件 `open-type` 的值设置为 `getPhoneNumber`

- 当用户点击并同意之后，可以通过 `bindgetphonenumber` 事件回调获取到动态令牌`code`

- 然后把`code`传到开发者后台，并在开发者后台调用微信后台提供的 [phonenumber.getPhoneNumber](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/phonenumber/phonenumber.getPhoneNumber.html) 接口

- 消费`code`来换取用户手机号

- 每个`code`有效期为5分钟，且只能消费一次

  ```wxml
  <button open-type="getPhoneNumber" bindgetphonenumber="handleGetPhoneNumber">获取手机号码</button>
  ```

  ```js
   handleGetPhoneNumber: function(event) {
      console.log(event)
    }
  ```



## 分包

### 









