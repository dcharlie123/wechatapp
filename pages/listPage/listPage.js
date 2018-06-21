// pages/listPage/listPage.js
import util from '../../utils/util.js'

const host = getApp().globalData.host;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: null,
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    // console.log(options);
    var type = options.type,tp=decodeURIComponent(options.tp);
    // console.log(u);
    var navTitle = "N视频";
    var navTitle=type;
    wx.setNavigationBarTitle({
      title: navTitle,
    })
    if(this.data.isLoading){
      wx.showLoading()
    }
    util.$get(`${host}${tp}`).then(res=>{
      var list=res.data.data;
      list.map(v => { // 转换一下时间
        v.ptime = util.formatTime(new Date(), 'yyyy-MM-dd');
      })
      this.setData({
        videoList:list
      })
      wx.hideLoading();
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
              fail() { }
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
  onShareAppMessage(ops){
    if(ops.from==='button'){
    }
    var data=ops.target.dataset.item;
    // console.log(data);
    if(!data){
      return
    }
    return {
      title:data.title,
      page: `/pages/video-detail/video-detail?title=${data.title}&id=${data.docid}&url=${data.video}`
    }
  },
  openDetail(event) {
    let item = event.currentTarget.dataset.list;
    let url = `/pages/video-detail/video-detail?title=${item.title}&id=${item.docid}&url=${item.video}`;
    wx.navigateTo({
      url: url
    })
  },
})