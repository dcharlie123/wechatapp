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
    page: 1,
    video: null,
    userING: false,
    hadGetNav: false,
    startY: 0,
    showDown: false,
    lodingText: "下拉加载。。",
    dis: 0,
    pullDown: false,
    detailItem:null
  },

  created: function (options) {

  },
  attached: function () {
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
      //如果是下拉,设置页数为1
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
      if (list.length) { //如果有数据
        //如果数据为Nav数据直接取出
        if (list[0].flag == "circularcard") {
          this.setData({
            navData: list.shift()
          })
        }
        list.map(v => { // 转换一下时间
          v.ptime = util.timestampToTime(v.ptime);
          // v.summary = v.summary.slice(0, 80) + "..."
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
          page: ++this.data.page,
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
      // console.log(e);
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
      console.log(this.data.video.video)
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
    //点击进入搜索页面
    goSearch() {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    },
    //收藏
    like(event) {
      var e = event.currentTarget.dataset.list;
      // console.log(e);
      // app.globalData.likeList.push(e.docid);
      var _this_ = this;
      if (!wx.getStorageSync('nd_usertoken')) { //如果没登录
        //弹出授权
        this.setData({
          is_modal_Show: true,
          is_modal_title: '提示',
          is_modal_desc: '需要您授权才能使用',
          modalSuretxt: '授权',
          isGetUserInfo: true,
          option: {
            success: 1
          }
        })
      } else {
        if (!e.favored) { //收藏
          _this_.likeW(e.docid)
          _this_.data.videoList.forEach((item, index, arr) => {
            if (item.docid == e.docid) {
              item.favored = 1;
              item.favorcount = item.favorcount - 0 + 1; //-0是为了转化为数字类型
              _this_.setData({
                videoList: arr
              })
            }
          })
        } else { //取消收藏
          _this_.dislikeW(e.docid)
          _this_.data.videoList.forEach((item, index, arr) => {
            if (item.docid == e.docid) {
              item.favored = 0;
              item.favorcount -= 1;
              _this_.setData({
                videoList: arr
              })
            }
          })
        }
      }
    },
    getInfo() { //授权后设置数据
      this.setData({
        userInfo: wx.getStorageSync("userInfo"),
        token: wx.getStorageSync('nd_usertoken')
      })
      app.globalData.token = wx.getStorageSync('nd_usertoken');
      app.globalData.userInfo = wx.getStorageSync("userInfo");
    },
    share(event) {
      //触发onShareAppMessage
      this.triggerEvent('onShareAppMessage', event.currentTarget.dataset.item)
    },
    //进入详情页面
    openDetail(event) {
      // this.setData({
      //   detailItem:event
      // })
      // if (!wx.getStorageSync('nd_usertoken')) { //如果没登录
      //   //弹出授权
      //   app.showAuthM(this,"openDetail");
      // } else {
      //   app.openDetail(event);
      //   // console.log(this.data.detailItem)
      // }
      app.openDetail(event);
    },
    // refuseOpenDetailCB(){
    //   wx.navigateTo({
    //     url:"/pages/videoDetail/videoDetail"
    //   })
    // },
    //进入列表页
    goList(event) {
      var listType = event.currentTarget.dataset.type;
      var u = event.currentTarget.dataset.u;
      var tp = encodeURIComponent(u.split("?")[1]);
      wx.navigateTo({
        url: `/pages/listPage/listPage?type=${listType}&tp=${tp}`
      })
    },
    //收藏接口
    likeW(docid) {
      return new Promise((resolve, reject) => {
        var _this_ = this;
        wx.request({
          method: "POST",
          url: "https://api.ndapp.oeeee.com/friends.php?m=NDvideo&a=postFavor",
          data: {
            docid: docid
          },
          header: {
            "content-type": "application/x-www-form-urlencoded",
            'ndusertoken': wx.getStorageSync('nd_usertoken')
          },
          success: resolve,
          fail: reject
        })
      })

    },
    //取消收藏接口
    dislikeW(docid) {
      return new Promise((resolve, reject) => {
        var _this_ = this;
        wx.request({
          method: "POST",
          url: "https://api.ndapp.oeeee.com/friends.php?m=NDvideo&a=cancleFavor",
          data: {
            docid: docid
          },
          header: {
            "content-type": "application/x-www-form-urlencoded",
            'ndusertoken': wx.getStorageSync('nd_usertoken')
          },
          success: resolve,
          fail: reject
        })
      })

    },
    // touchstart(event){
    //   console.log(event)
    //   if(event.target.offsetTop==0&&!this.data.pullDown){
    //     this.setData({
    //       pullDown:true,
    //       startY: Number(event.touches[0].pageY)
    //     })
    //   }

    // },
    // touchmove(event){
    //   var touch = event.touches[0];
    //   if(this.data.pullDown&&!this.data.isLoading&&this.data.startY<touch.pageY){
    //     console.log(2)
    //     var dis=Number(touch.pageY)-this.data.startY;
    //     this.setData({
    //       dis:dis*0.5
    //     })
    //     if(dis>30&&touch.pageY>touch.pageX){
    //       this.setData({
    //         showDown:true
    //       })
    //     }
    //   }
    // },
    // touchend(evnet){
    //   if(this.data.pullDown){
    //     this.setData({
    //       dis:30,
    //       lodingText:"加载中..."
    //     })
    //     this.getList("down")
    //   }

    // }
  }
})