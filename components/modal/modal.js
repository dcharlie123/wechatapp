// components/modal/modal.js
var app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden  
        modalShow: {
            type: Boolean,
            value: false
        },
        modalTitle: {
            type: String,
            value: ' 标题',
        },
        modalDesc: {
            type: String,
            value: ' 描述',
        },
        modalSuretxt: {
            type: String,
            value: ' 我知道了',
        },
        showCancel: {
            type: Boolean,
            value: true
        },
        modalCanceltxt: {
            type: String,
            value: '取消',
        },
        isContact: {
            type: Boolean,
            value: false
        },
        isGetUserInfo: {
            type: Boolean,
            value: false
        },
        modalOption: {
            type: Object,
            value: {}
        },
        isback: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 这里是自定义方法
        modal_click_Hidden: function () {
            this.setData({
                modalShow: false
            })
            if (this.data.isGetUserInfo) {
                app.refuseLogin();
            }
            if (this.data.isback) {
                wx.navigateBack({
                    delta: 1
                })
            }
        },
        onGotUserInfo: function (e) {
            //
            this.setData({
                modalShow: false
            })
            let detail = e.detail,
                _this = this;
            //如果获取useInfo成功
            if (detail.errMsg == 'getUserInfo:ok') {
                wx.setStorageSync('userInfo', detail);
                //去triggerEvent"getInfo"事件
                _this.data.modalOption.success=function(){
                    _this.triggerEvent('getInfo');
                }
                //登录获取jscode
                wx.login({
                    success: function (res) {
                        if (res.code) {
                            let jscode = res.code;
                            //注册
                            app.register(jscode, detail, _this.data.modalOption);
                        }
                    }
                });
            } else {
                app.refuseLogin();
            }
        }
    }
})