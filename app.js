//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx,wx.getSetting({
      success: function(res) {
        if(res.authSetting['scope.userInfo']){

        }else{
          console.log(111)
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  globalData: {
    userInfo: null,
    host:"https://api.ndapp.oeeee.com/friends.php?",

  }
  
})