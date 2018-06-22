// pages/app/app.js
var app = getApp();
Page({
  data: {
    currentTab: 0,//切换tab 0为推荐，1为我的
    userInfo:null,
    token:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    wx.showShareMenu({
      withShareTicket: true
    })
    // if (!app.globalData.token || !app.globalData.userInfo) {
    //   if (new Date().getTime() - wx.getStorageSync('nd_lastlogin')>36000) {
    //     this.setData({
    //       is_modal_Show: true,
    //       is_modal_title: '提示',
    //       is_modal_desc: '需要您授权才能使用',
    //       modalSuretxt: '授权',
    //       isGetUserInfo: true,
    //       option:{
    //        success:1
    //       }
    //     })
    //   }
    // }
  },
  getInfo(){
    this.setData({
      userInfo:wx.getStorageSync("userInfo"),
      token:wx.getStorageSync('nd_usertoken')
    })
    app.globalData.token=wx.getStorageSync('nd_usertoken');
    app.globalData.userInfo = wx.getStorageSync("userInfo");
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext("myVideo");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(this)
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
   * 切换底部tab
   */
  switchTab(e) {
    // console.log(e.currentTarget.dataset.current)
    this.setData({
      currentTab: e.currentTarget.dataset.current
    });
    if (e.currentTarget.dataset.current == 1) {
      wx.setNavigationBarTitle({
        title: '个人中心',
      })
    } else if (e.currentTarget.dataset.current == 0) {
      wx.setNavigationBarTitle({
        title: 'N视频',
      })
    }
  },
  onReachBottom() {
    // console.log(e);
    var home = this.selectComponent(".home");
    if (home.data.isLoading) {
      return;
    };
    home.getList("up");
  },
  onShareAppMessage(ops) {
    var data
    //如果来自页面内的分享
    if (ops.from === 'button') {
      data = ops.target.dataset.item;
      if (!data) {
        return
      }
      return {
        title: data.title,
        imgUrl: data.headimgurl,
        path: `/pages/videoDetail/videoDetail?title=${data.title}&id=${data.docid}&url=${data.video}`
      }
    }
  }
})