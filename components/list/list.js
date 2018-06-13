Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String
    },
    text: {
      type: String
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    Callback(e) {
      this.triggerEvent('cancel',e)
    }
  }
})