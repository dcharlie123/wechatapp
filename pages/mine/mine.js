var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTab: 0,
    likeicon: "/assets/N视频图标/icon40_like.png",
    userInfo: null,
    token: null
  },
  ready() {
    this.setData({
      userInfo: wx.getStorageSync("userInfo"),
      token: wx.getStorageSync("nd_usertoken")
    })
    // userInfo: wx.getStorageSync("userInfo");
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // switchTab(e) {
    //   console.log(e)
    //   let tab = e.currentTarget.id
    //   if (tab === 'tableft') {
    //     this.setData({ currentTab: 0 })
    //   } else if (tab === 'tabright') {
    //     this.setData({ currentTab: 1 })
    //   }
    // }
    getmyInfo() {
      if (!this.data.token) {
        this.setData({
          is_modal_Show: true,
          is_modal_title: '提示',
          is_modal_desc: '需要您授权才能使用',
          modalSuretxt: '授权',
          isGetUserInfo: true,
          option: {
            success: 1
          }
        })
      }
    },
    getInfo() {
      this.setData({
        userInfo: wx.getStorageSync("userInfo"),
        token: wx.getStorageSync('nd_usertoken')
      })
      app.globalData.token = wx.getStorageSync('nd_usertoken');
      app.globalData.userInfo = wx.getStorageSync("userInfo");
    },
    goMini1() {
      wx.navigateToMiniProgram({})
    },
    goMini2() {
      wx.navigateBackMiniProgram({

      })
    },
    Mylike() {
      if (this.data.token) {
        wx.navigateTo({
          url: `/pages/likePage/likePage?type=like&token=${this.data.token}`,
        })
      } else {
        this.setData({
          is_modal_Show: true,
          is_modal_title: '提示',
          is_modal_desc: '需要您授权才能使用',
          modalSuretxt: '授权',
          isGetUserInfo: true,
          option: {
            success: 1
          }
        })
      }
    },
    Myhistory() {
      if (this.data.token) {
        wx.navigateTo({
          url: `/pages/history/history?token=${this.data.token}`,
        })
      } else {
        this.setData({
          is_modal_Show: true,
          is_modal_title: '提示',
          is_modal_desc: '需要您授权才能使用',
          modalSuretxt: '授权',
          isGetUserInfo: true,
          option: {
            success: 1
          }
        })
      }
    }
  }
})