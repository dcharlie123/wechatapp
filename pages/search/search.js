// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // searchData: { a: 11 },
    searchRecord: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.clearStorage()
    if (wx.getStorageSync("searchRecord")) {
      this.setData({ searchRecord: wx.getStorageSync("searchRecord") });
    } else {
      // console.log("null")
      wx.setStorageSync("searchRecord", [])
    }
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
  share() {

  },
  onShareAppMessage: function () {
    return {
      title: "aa"
    }
  },
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  search(event) {
    var searchText = event.detail.value;
    searchText = searchText.trim();
    // console.log(this.data.searchRecord)
    if (this.data.searchRecord.indexOf(searchText) == -1) {
      this.data.searchRecord.unshif(searchText);
      wx.setStorage({
        key: 'searchRecord',
        data: this.data.searchRecord,
      })
    }
    // console.log(searchText.length)
    
  },
  clearRearchRecord(){
    wx.removeStorage({
      key: 'searchRecord'
    });
    this.setData({ searchRecord:[]});
  }
})