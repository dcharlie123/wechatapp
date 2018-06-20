import util from '../../utils/util.js'

const host = getApp().globalData.host;
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
    navData: null,
    currentTab: 0,
    videoList: null,
    isLoading: true,
    hasMore: true,
    page: 2,
    video: null,
    userING: false,
    hadGetNav: false,
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
      var _this_ = this;
      this.setData({
        isLoading: true,
        hasMore: true
      })
      var _this_ = this;
      type === 'down' ? this.setData({
        page: 1
      }) : null;
      util.$get(`${host}m=NDvideo&a=nav`, {
        page: _this_.data.page
      }).then(res => {
        if (res.data.errcode == 0) {
          this.processData(type, res.data.data)
        } else {
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
        
        if (list[0].flag == "circularcard") {
          this.setData({
            navData: list.shift()
          })
        }
        list.map(v => { // 转换一下时间
          v.ptime = util.formatTime(new Date(), 'yyyy-MM-dd');
          v.summary=v.summary.slice(0,80)+"..."
        })
        if (type === 'up') { // 上拉处理
          this.setData({
            videoList: this.data.videoList.concat(list),
          })
        } else { // 下拉出来
          this.setData({
            videoList: list
          })
          wx.stopPullDownRefresh()
        }
        this.setData({
          article_id: ++this.data.page,
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
            var networkType = res.networkType; //网络状态
            // console.log(networkType)
            if (networkType !== "wifi") { //如果不是wifi提醒用户
              wx.showModal({
                title: '提示',
                content: '您未连接wifi，确定要播放吗',
                success(res) {
                  if (res.confirm) { //如果用户确认
                    _this_.data.userING = true; //把用户忽略设置为true
                    _this_.playVideo(e) //播放视频
                  }
                },
                fail() {}
              })
            } else {
              _this_.playVideo(e) //wifi情况下自动播放
            }
          }
        })
      } else {
        this.playVideo(e); //用户已忽略网络类型,给播放
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
      // console.log(e);
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
      let url = `/pages/video-detail/video-detail?title=${item.title}&id=${item.article_id}`
      wx.navigateTo({
        url: url
      })
    },
    goList(event) {
      var listType = event.currentTarget.dataset.type;
      wx.navigateTo({
        url: '/pages/listPage/listPage?type=' + listType,
      })
    }
  }
})