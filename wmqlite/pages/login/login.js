var utilMd5 = require('../../utils/md5.js');   

var app = getApp()
var mobile = ""
var inviteUserId = 0

Page({
   data: {
    loading:false,
    second:60,
    submitText:"登录",
    codeBtnText:"获取验证码",
    openId:""
  },
  onLoad:function(options){
     if (options.userId)
       inviteUserId = options.userId
     this.setData({openId:app.globalData.openId})
  },
  formSubmit:function(e){
     var that = this
     if (!that.data.loading) {
     var form = e.detail.value
     form.inviteUserId = inviteUserId
     var err = ""
     if(form.mobile=="")
       err+="请输入手机号码";
     else if(form.code=="")
       err+="请输入验证码";
     if(err!=""){
        wx.showToast({icon:"loading",title:err})
     }else{
        that.setData({loading:true,submitText:"提交中"})
        wx.request({
          url: app.config.loginUrl,
          data: form,
          method: 'POST',
          header:{"Content-Type":"application/x-www-form-urlencoded"},
          success: function(res){
            if(res.data.code==0){
                wx.setStorageSync('localUserId', res.data.data)
                wx.reLaunch({
                  url: '/pages/index/index'
                })
            }else{
                wx.showToast({icon:"loading",title:res.data.message})
            }
          },
          fail: function(res) {
              wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
          },
          complete: function(res) {
              that.setData({loading:false,submitText:"登录"})
          }
        })
     }
     }
  },
  onPullDownRefresh: function(){
     wx.stopPullDownRefresh()
  },
  timeCode:function(){
    var that = this
    var second = that.data.second;
    if (second == 0) {
        that.setData({
            codeBtnText:"获取验证码",
            second: 60
        });
        return;
    }
    var time = setTimeout(function () {
            that.setData({
                second: second - 1,
                codeBtnText:(second - 1)+"秒后重新获取",
            });
            that.timeCode();
        }, 1000)
  },
  mobileInput:function(e){
     mobile = e.detail.value
  },
  bindGetCode:function(e){
     var that = this
     if(this.data.second==60){
        if(mobile=="")
        {
           wx.showToast({icon:"loading",title:"请输入手机号码"})
           return
        }
        var time = new Date().getTime()
        wx.request({
          url: app.config.codeUrl,
          data: {mobile:mobile,time:time,sign:utilMd5.hexMD5(mobile+time+"asD#85T3cj309")},
          method: 'GET',
          success: function(res){
              if(res.data.code==0){
                  wx.showToast({
                    title: '发送成功,10分钟内有效',
                  })
                  that.timeCode()
              }else{
                  wx.showToast({icon:"loading",title:res.data.message})
              }
          }
        })
     }
  }
})