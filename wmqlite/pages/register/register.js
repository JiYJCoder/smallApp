var utilMd5 = require('../../utils/md5.js');   

var app = getApp()
var inviteUserId = 0
var mobile = ""

Page({
   data: {
    classArr: [{name:"总裁/总经理",id:115100},{name:"行政总监/经理",id:115102},{name:"HRD/HRM",id:115106},{name:"外贸经理",id:100111},{name:"外贸业务员",id:100106},{name:"其他外贸职位",id:100101}],
    classIndex:0,
    eduArr: [{name:"初中",id:0},{name:"高中/中专",id:1},{name:"大专",id:2},{name:"本科",id:3},{name:"硕士",id:4},{name:"博士",id:5}],
    education:3,
    year:"2017",
    loading:false,
    second:60,
    submitText:"确定",
    codeBtnText:"获取验证码"
  },
  onLoad:function(options){
      if (options.userId)
        inviteUserId = options.userId
      this.setData({openId:app.globalData.openId,userInfo:app.globalData.userInfo})
  },
  openLogin:function(e){
     wx.navigateTo({
       url: '/pages/login/login?userId=' + inviteUserId
     })
  },
  formSubmit:function(e){
    
     var that = this
     console.log(e)
     console.log(!that.data.loading)
     if (!that.data.loading) {
     var form = e.detail.value
     form.inviteUserId = inviteUserId
     var err = ""
     if(form.truename=="")
       err=="请输入姓名";
     else if(form.tel=="")
       err+="请输入手机号码";
     else if(form.code=="")
       err+="请输入验证码";
     else if(form.position=="")
       err+="请输入职位";
     if(err!=""){
        wx.showToast({icon:"loading",title:err})
     }else{
        that.setData({loading:true,submitText:"提交中"})
        wx.request({
          url: app.config.registerUrl,
          data: form,
          method: 'POST',
          header:{"Content-Type":"application/x-www-form-urlencoded"},
          success: function(res){
            if(res.data.code==0){
                wx.setStorageSync('localUserId', res.data.data)
                wx.showModal({
                  title: '恭喜',
                  content: '名片创建成功了~',
                  showCancel:false,
                  success: function(res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/pages/index/index'
                      })
                    }
                  }
                })
            }else{
                wx.showToast({icon:"loading",title:res.data.message})
            }
          },
          fail: function(res) {
              wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
          },
          complete: function(res) {
            that.setData({loading:false,submitText:"确定"})
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
                codeBtnText:(second - 1)+"秒后获取",
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
  },
  bindClassChange: function(e) {
    this.setData({
       classIndex: e.detail.value
    })
  },
  bindEduChange: function(e) {
    this.setData({
       education: e.detail.value
    })
  },
  bindYearChange: function(e) {
    this.setData({
       year: e.detail.value
    })
  }
})