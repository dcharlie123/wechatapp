
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
    likeicon:"/assets/N视频图标/icon40_like.png"
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
    goMini1(){
      wx.navigateToMiniProgram({})
    },
    goMini2(){
      wx.navigateBackMiniProgram({
        
      })
    },
    Mylike(){
      wx.navigateTo({
        url: '/pages/listPage/listPage?type=like',
      })
    }
  }
})
