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
    wx.showLoading({
      title:"加载中..."
    });
    this.getfavor().then(res => {
      var list = res.data.data.list;
      // console.log(list)
      if (list) {
        list.map(v => { // 转换一下时间
          v.ptime = util.timestampToTime(v.ptime);
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
  openDetail(event){
    var item=event.currentTarget.dataset.item;
    // console.log(item)
    let url = `/pages/videoDetail/videoDetail?title=${item.title}&id=${item.docid}`;
    wx.navigateTo({
      url: url
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
    this.getfavor().then((res)=>{
      var list = res.data.data.list;
      if (list.length) {
        list.map(v => { // 转换一下时间
          v.ptime = util.timestampToTime(v.ptime);
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
    this.getfavor().then((res)=>{
      var list = res.data.data.list;
      if (list.length) {
        list.map(v => { // 转换一下时间
          v.ptime = util.timestampToTime(v.ptime);
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
  /**
   * 用户点击右上角分享
   */
  getInfo() { //授权后设置数据
    this.setData({
      userInfo: wx.getStorageSync("userInfo"),
      token: wx.getStorageSync('nd_usertoken')
    })
    app.globalData.token = wx.getStorageSync('nd_usertoken');
    app.globalData.userInfo = wx.getStorageSync("userInfo");
  },
  onShareAppMessage: function() {
    return{
      path: "/pages/app/myapp?sharePg="+escape(`/pages/likePage/likePage`)
    }
  }
})