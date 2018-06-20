// pages/listPage/listPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var type = options.type;
    var navTitle = "N视频";
    switch (type) {
      case 'hot':
        navTitle = "热门";
        break;
      case 'people':
        navTitle = "人物";
        break;
      case 'experiment':
        navTitle = "实验";
        break;
      case 'cure':
        navTitle = "治愈系";
        break;
      case 'event':
        navTitle = "事件";
        break;
      case 'like':
        navTitle = "我的喜欢";
        break;
    };
    wx.setNavigationBarTitle({
      title: navTitle,
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
    return {
      title: "a"
    }
  },
  openDetail(event) {
    // let item = event.currentTarget.dataset.list
    // let url = `/pages/video-detail/video-detail?title=${item.title}&id=${item.article_id}`;
    let url = `/pages/video-detail/video-detail`;
    wx.navigateTo({
      url: url
    })
  }
})