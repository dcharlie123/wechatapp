import util from '../../../utils/util.js'
const movieUrl = getApp().globalData.movieBase;
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTab: 0,
    movieList: null,
    isLoading: false,
    hasMore: true,
    article_id: 0,
    video: null
  },

  created: function (options) {
    this.getList('down')
  },
  ready: function () {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getList(type) {
      this.setData({
        isLoading: true,
        hasMore: true
      })
      type === 'down' ? this.setData({
        article_id: 0
      }) : null;
      util.$get(`${movieUrl}/api/v2/article`, {
        app_id: 6,
        cid: 4,
        article_id: this.data.article_id
      }).then(res => {
        if (res.data.status === 0) {
          this.processData(type, res.data.data.articles)
        }
      }).catch(e => {
        this.setData({
          isLoading: true,
          hasMore: false
        })
        wx.stopPullDownRefresh()
        wx.showToast({
          title: `网络错误!`,
          duration: 1000,
          icon: "none"
        })
      })
    },
    processData(type, list) {
      if (list.length) {
        list.map(v => { // 转换一下时间
          v.create_time = util.formatTime(new Date(), 'yyyy-MM-dd')
        })
        if (type === 'up') { // 上拉处理
          this.setData({
            movieList: this.data.movieList.concat(list)
          })
        } else { // 下拉出来
          this.setData({
            movieList: list
          })
          wx.stopPullDownRefresh()
        }
        this.setData({
          article_id: ++this.data.article_id,
          isLoading: false,
          hasMore: true
        })
      } else {
        if (type === 'down') {
          wx.showToast({
            title: `没有数据`,
            duration: 1500,
            icon: "none"
          })
          this.setData({
            isLoading: false,
            hasMore: false
          })
        } else {
          this.setData({
            isLoading: false,
            hasMore: true
          })
        }
      }

    },
    onPullDownRefresh() {
      this.getList('down')
    },
    bindPlayVideo(event) {
      var _this_ = this;
      var e = event.currentTarget.dataset.item;
      console.log(e)
      _this_.setData({
        video: e
      });
      var str = 'video.showPlayer'
      _this_.setData({
        [str]: true
      });
      // wx.getNetworkType({
      //   success: function (res) {
      //     // 返回网络类型, 有效值：
      //     // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      //     var networkType = res.networkType;
      //     console.log(networkType)
      //     if (networkType !== "wifi") {
      //       wx.showModal({
      //         title: '提示',
      //         content: '您未连接wifi，确定要播放吗',
      //         success(res) {
      //           if (res.confirm) {
      //             _this_.setData({
      //               video: e
      //             });
      //             var str = 'video.showPlayer'
      //             _this_.setData({
      //               [str]: true
      //             });
      //           }
      //         },
      //         fail() {
      //         }
      //       })
      //     }
      //   }
      // })



    },
    bindVideoEnded() {
      var str = 'video.showPlayer';
      this.setData({
        [str]: false
      });
    },
    onReachBottom() {
      if (this.data.isLoading) { // 防止数据还没回来再次触发加载
        return;
      }
      this.getList('up')
    },
  }
})
