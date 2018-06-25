// pages/likePage/likePage.js
import util from '../../utils/util.js'

const host = getApp().globalData.host;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:null,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '我的喜欢'
    })
    this.getfavor().then(res => {
      var list = res.data.data.list;
      // console.log(list)
      if (list) {
        list.map(v => { // 转换一下时间
          v.ptime = util.formatTime(new Date(), 'yyyy-MM-dd');
          // v.summary = v.summary.slice(0, 80) + "..."
        })
      }

      this.setData({
        videoList: list
      })
      wx.hideLoading();
      // console.log(this.data.videoList);
    })
  },
  getfavor() {
    return new Promise((resolve, reject) => {
      var _this_ = this;
      wx.request({
        method: "POST",
        url: "https://api.ndapp.oeeee.com/friends.php?m=NDvideo&a=favorlist",
        data: {
          page: _this_.data.page
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
  onShareAppMessage: function() {
    
  }
})