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
    isLoading: true,
    hasMore: true,
    article_id: 0,
    video: null,
    userING: false
  },

  created: function (options) {

    this.getList('down');

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
      // if(this.data.isLoading){
      //   wx.showLoading({
      //     title: '',
      //   })
      // }
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
        }else{
          wx.showToast({
            title: `网络错误!`,
            duration: 1000,
            icon: "none"
          })
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
        // if(!this.data.isLoding){
        //   wx.hideLoading()
        // }
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
      if (!_this_.data.userING) {
        wx.getNetworkType({
          success: function (res) {
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            var networkType = res.networkType;//网络状态
            console.log(networkType)
            if (networkType !== "wifi") {//如果不是wifi提醒用户
              wx.showModal({
                title: '提示',
                content: '您未连接wifi，确定要播放吗',
                success(res) {
                  if (res.confirm) {//如果用户确认
                    _this_.data.userING = true;//把用户忽略设置为true
                    _this_.playVideo(e)//播放视频
                  }
                },
                fail() {
                }
              })
            } else {
              _this_.playVideo(e)//wifi情况下自动播放
            }
          }
        })
      }else{
        this.playVideo(e);//用户已忽略网络类型,给播放
      }

    },
    playVideo(data) {
      this.setData({
        video: data
      });
      var str = 'video.showPlayer'
      this.setData({
        [str]: true
      });
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
    goSearch() {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    },
    like(event) {
      var e = event.currentTarget.dataset.list;
      console.log(e);
      this.setData({
        video: e
      })
      var sl = "video.liked";
      this.setData({
        [sl]: true
      })
    },
    share(event) {
      //触发onShareAppMessage
      this.triggerEvent('onShareAppMessage', event.currentTarget.dataset.item)
    },
    openDetail(event) {
      let item = event.currentTarget.dataset.list
      // let url = `video-detail/video-detail?title=${item.title}&time=${encodeURIComponent(item.create_time)}&url=${item.videos[0].video_src}`
      let url = 'home/video-detail/video-detail'
      wx.navigateTo({
        url: url
      })
    },
  }
})
