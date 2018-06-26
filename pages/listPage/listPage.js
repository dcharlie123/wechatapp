// pages/listPage/listPage.js

import util from '../../utils/util.js'

const host = getApp().globalData.host;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: null, //视频数据列表
    isLoading: true, //正在加载
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (this.data.isLoading) {
      wx.showLoading()
    }
    var _this_ = this;
    var type = options.type,
      tp = decodeURIComponent(options.tp);
    var navTitle
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    var opts = currentPage.options //如果要获取url中所带的参数可以查看options
    if (type) {
      navTitle = type;
    } else if (opts) {
      navTitle = opts.type;
    } else {
      navTitle = "N视频";
    }
    wx.setNavigationBarTitle({
      title: navTitle,
    })
    //获取数据
    util.$get(`${host}${tp}`).then(res => {
      var list = res.data.data;
      list.map(v => { // 转换一下时间
        v.ptime = util.timestampToTime(v.ptime);
        // v.summary = v.summary.slice(0, 80) + "...";
      })
      this.setData({
        videoList: list
      })
      wx.hideLoading();
    })
  },
  like(event) {
    var e = event.currentTarget.dataset.list;
    app.globalData.likeList.push(e.docid);
    var _this_ = this;
    if (!wx.getStorageSync('nd_usertoken')) {
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
      if (!e.favored) {
        _this_.likeW(e.docid)
        _this_.data.videoList.forEach((item, index, arr) => {
          if (item.docid == e.docid) {
            item.favored = 1;
            item.favorcount = item.favorcount - 0 + 1;
            _this_.setData({
              videoList: arr
            })
          }
        })
      } else {
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
  bindPlayVideo(event) {
    var _this_ = this;
    var e = event.currentTarget.dataset.item;
    if (!_this_.data.userING) {
      wx.getNetworkType({
        success: function(res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType; //网络状态
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
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(ops) {
    if (ops.from === 'button') {
      var data = ops.target.dataset.item;
      if (!data) {
        return
      }
      return {
        title: data.title,
        imageUrl: data.imglist[0],
        path: "/pages/app/myapp?sharePg=" + escape(`/pages/videoDetail/videoDetail?title=${data.title}&id=${data.docid}&url=${data.video}`)
      }
    } else {
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      var url = currentPage.route //当前页面url
      var options = currentPage.options //如果要获取url中所带的参数可以查看options
      // decodeURIComponent(options.tp)
      return {
        title: 'N视频-' + options.type,
        path: "/pages/app/myapp?sharePg=" + escape( `/pages/listPage/listPage?type=${options.type}&tp=${options.tp}`)
      }
    }
  },
  openDetail(event) {
    let item = event.currentTarget.dataset.list;
    let url = `/pages/videoDetail/videoDetail?title=${item.title}&id=${item.docid}&url=${item.video}`;
    wx.navigateTo({
      url: url
    })
  },
})