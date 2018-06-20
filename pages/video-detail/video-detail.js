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
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      id: options.id,
      videoUrl: options.url
    })
    util.$get(`${host}m=Doc&a=info`, { id: this.data.id }).then(res => {
      // console.log(res);
      var list = res.data.data;
      list.ptime = util.formatTime(new Date(), 'yyyy-MM-dd');
      this.setData({
        video: list
      })
      
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})