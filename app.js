//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var token = wx.getStorageSync('nd_usertoken'), userInfo = wx.getStorageSync("userInfo");
    this.globalData.token = token;
    this.globalData.userInfo = userInfo;
  },
  register(jscode, info, option = {}) {
    let that = this,
      encryptedData = info.encryptedData,
      iv = info.iv,
      userInfo = info.userInfo;
    wx.request({
      method: 'POST',
      url: that.globalData.host + 'm=NDvideo&a=webappRegister',
      data: {
        jscode,
        encryptedData,
        iv
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (json) {
        let token = json.data.data.nd_usertoken;
        // console.log(token)
        if (token) {
          wx.setStorageSync('nd_usertoken', token);
          // console.log(option)
          if (option.success) {
            option.success.call(token);
          }
        }
      },
      error: function () {
        // if (option.showLoading) wx.hideToast();
      }
    })
  },
  refuseLogin: function () {
    wx.setStorage({
      key: "nd_lastlogin",
      data: new Date().getTime()
    })
  },
  globalData: {
    userInfo: null,
    host: "https://api.ndapp.oeeee.com/friends.php?",
    token: null,
    likeList:[]
  }

})