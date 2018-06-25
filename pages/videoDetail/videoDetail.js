// pages/app/home/video-detail/video-detai.js
import util from '../../utils/util.js'
var app = getApp();
const host = getApp().globalData.host;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    video: null,
    videoUrl: null,
    id: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      id: options.id,
      videoUrl: options.url
    })
    util.$get(`${host}m=Doc&a=info`, {
      id: this.data.id
    }).then(res => {
      var list = res.data.data;
      list.ptime = util.formatTime(new Date(), 'yyyy-MM-dd');
      this.setData({
        video: list
      })
      wx.setNavigationBarTitle({
        title: list.title
      })

    })
  },
  like(event) {
    var e = event.currentTarget.dataset.list;
    console.log(e);
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
        var data = this.data.video;
        data.favored = 1
        data.favorcount = data.favorcount - 0 + 1;
        this.setData({
          video: data
        })
      } else {
        _this_.dislikeW(e.docid)
        var data = this.data.video;
        data.favored = 0;
        data.favorcount = data.favorcount - 1;
        this.setData({
          video: data
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(ops) {
    if (ops.from === 'button') {
      // console.log(ops)
      var data = ops.target.dataset.item;
      console.log(this.data.video);
      // if(!data){
      //   return
      // }
      
    }
    return {
      title: this.data.video.title,
      imageUrl: this.data.video.imglist[0],
      path: "/pages/app/myapp?sharePg="+escape(`/pages/videoDetail/videoDetail?title=${this.data.video.title}&id=${this.data.video.docid}&url=${this.data.video.video}`)
    }
  }
})