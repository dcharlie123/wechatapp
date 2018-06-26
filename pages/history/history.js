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
    page:1,
    isLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '观看历史'
    })
    if(this.data.isLoading){
      wx.showLoading({
        title:"加载中..."
      });
    }
    this.getHistory().then(res => {
      var list = res.data.data;
      if (list.length) {
        list.map(v => { // 转换一下时间
          v.ctime = util.timestampToTime(v.ctime);
        })
      }
      this.setData({
        videoList: list
      })
      wx.hideLoading();
      this.setData({
        isLoading:false
      })
    })
  },
  getHistory() {
    return new Promise((resolve, reject) => {
      var _this_ = this;
      wx.request({
        method: "POST",
        url: "https://api.ndapp.oeeee.com/friends.php?m=Doc&a=viewlog",
        data: {
          page: _this_.data.page,
          'requestfrom':'webapp'
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title:"加载中..."
    });
    this.setData({
      page:this.data.page+1
    })
    this.getHistory().then((res)=>{
      var list = res.data.data;
      if (list.length) {
        list.map(v => { // 转换一下时间
          v.ctime = util.timestampToTime(v.ctime);
        })
        this.setData({
          videoList:  this.data.videoList.concat(list)
        })
        wx.hideLoading();
      }else{
        wx.showToast({
          icon:"none",
          title:"没有更多"
        })
      }
      
    })
  },
  onPullDownRefresh(){
    this.setData({
      page:1
    })
    this.getHistory().then((res)=>{
      var list = res.data.data;
      if (list.length) {
        list.map(v => { // 转换一下时间
          v.ctime = util.timestampToTime(v.ctime);
          // v.summary = v.summary.slice(0, 80) + "..."
        })
        this.setData({
          videoList:list
        })
        wx.stopPullDownRefresh();
        wx.showToast({
          icon:"success",
          title:res.data.errmsg
        })
      }else{
        wx.showToast({
          icon:"none",
          title:res.data.errmsg
        })
      }
      
    })
  },
  onShareAppMessage: function() {
    return{
      path: "/pages/app/myapp?sharePg="+escape(`/pages/history/history`)
    }
  },
  openDetail(event){
    app.openDetail(event);
  }
})