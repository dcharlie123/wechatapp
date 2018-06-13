// pages/app/app.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext("myVideo");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this)
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
  * 切换底部tab
  */
  switchTab(e) {
    // console.log(e.currentTarget.dataset.current)
    this.setData({ currentTab: e.currentTarget.dataset.current});
    if (e.currentTarget.dataset.current==1){
      wx.setNavigationBarTitle({
        title: '个人中心',
      })
    }
  },
  onReachBottom(){
    // console.log(e);
    var home=this.selectComponent(".home");
    if(home.data.isLoading){
      return;
    };
    home.getList("up");
  },
  onShareAppMessage(ops){
    if(ops.from==='button'){

    }
    var data=ops.target.dataset.item;
    if(!data){
      return
    }
    return {
      title:data.title,
      // page:"/"
    }
  }
})