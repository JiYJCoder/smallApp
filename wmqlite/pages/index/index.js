var app = getApp()
Page({
  data: {
      isLogin:app.globalData.isLogin,
      praiseNum:0,
      collectNum:0,
      imageList:[],
      mallImgList:[]
  },
  onLoad:function(options){
      this.setData({isLogin: wx.getStorageSync("localUserId")!="",
                    userId: wx.getStorageSync("localUserId")})
      var that = this
      if(!this.data.isLogin){
          wx.login({
            success: function(data) {
              wx.request({
                url: app.config.openIdUrl+"?code="+data.code,
                success: function(res) {
                  var reda = res.data.data
                  app.globalData.openId=reda.openid
                  if(reda.userid){
                    wx.setStorageSync("localUserId",reda.userid)
                    app.globalData.isLogin = true
                    app.globalData.userId = reda.userid
                    that.setData({isLogin:true,userId:reda.userid})
                    that.loadData(reda.userid)
                  }else{
                    wx.getUserInfo({
                        success: function(res) {
                            app.globalData.userInfo=res.userInfo
                        }
                    })
                  }
                }
              })
            }
          })
      }else{
        this.loadData(this.data.userId)
      }
  },
  onShow:function(){
      if(app.globalData.refreshIndex){
         this.loadData(this.data.userId)
         app.globalData.refreshIndex = false
      }
  },
  onPullDownRefresh: function(){
       this.setData({
         isLogin: wx.getStorageSync("localUserId") != "",
         userId: wx.getStorageSync("localUserId")
       })
       if(this.data.isLogin){
          this.loadData(this.data.userId)
       }
       wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
     var that = this
    return {
      title: '您好，这是我的名片，请惠存！',
      path: '/pages/card/card?userId='+that.data.userId,
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  callPhone:function(e){
       var tel = this.data.card.tel
       if(tel){
         tel = tel.replace("-", "").replace("-", "")
       }
       wx.makePhoneCall({
         phoneNumber: tel
       })
  },
  isState:function(e){
    wx.request({
        url: app.config.isState,
        method:"PUT",
        data: { userId: wx.getStorageSync("localUserId")},
        success:(res)=>{
            var data =res.data;
            if(data.data==1){
                wx.navigateTo({
                    url: '/pages/mall/commodity/commodity',
                })
            }else{
                wx.navigateTo({
                    url: '/pages/mall/mallAuthority/mallAuthority',
                })
            }
        }
    })
  },
  loadData:function(userId){//获取名片信息
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '正在加载'
    })
      var that = this;
      //请求商品图片
      wx.request({
          url: app.config.getFourImg,
          method: "PUT",
          data: { userId: userId},
          success:function(res){
              let {code,data} = res.data;
              that.setData({
                  mallImgList: data
              })
          }
      })
      wx.request({
        url: app.config.cardInfoUrl,
        data:{userId:userId,localId:that.data.userId},
        success: function(res){
          if(res.data.code==0){
             var card = res.data.data
             if(card.startWorkYear)
                card.startWorkYear=((new Date().getFullYear()-card.startWorkYear)+1)+"年"
             if(card.tel && card.tel.length == 11){
                card.tel = card.tel.substr(0,3)+"-"+card.tel.substr(3,4)+"-"+card.tel.substr(7,4)
             }
             app.globalData.userFace = card.face
             that.setData({card:card})
             that.loadImage(userId)
          }else{
             wx.showToast({icon:"loading",title:res.data.code+" "+res.data.message})
          }
        },
        fail: function(res) {
           wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
        },complete:function(){
           wx.hideNavigationBarLoading()
           wx.hideLoading()
        }
      })
  },
  loadImage: function (userId){//获取图片
      var that = this
      wx.request({
        url: app.config.topImagesUrl,
        data: { userId: userId },
        success: function (res) {
          if (res.data.code == 0) {
             that.setData({ imageList: res.data.data })
          }
        }
     })
  },
  clickFace:function(e){
      wx.previewImage({
        current: e.target.dataset.src,
        urls: [e.target.dataset.src]
      })
  },
  viewCard:function(){
      wx.navigateTo({ url: '/pages/rvcards/rvcards' })
  },
  praiseCard: function () {
    wx.navigateTo({ url: '/pages/rpcards/rpcards' })
  },
  collectCard: function () {
    wx.navigateTo({ url: '/pages/rcards/rcards' })
  },
  openMyCards:function(){//跳转我的名片
      wx.navigateTo({url: '/pages/cards/cards'})
  },
  openUserInfo:function(){
      wx.navigateTo({url: '/pages/userinfo/userinfo'})
  },
  openMyTrend:function(){
      wx.navigateTo({ url: '/pages/mytrend/mytrend?userId=' + this.data.userId})
  },
  openRegister:function(){
      wx.navigateTo({url: '/pages/register/register'})
  },
  openShareImg:function(){
    var that = this
    wx.showLoading({
      title: '图片生成中',
      icon:"loading"
    })
    wx.request({
      url: app.config.createCardImgUrl,
      data: { userId: that.data.userId },
      success: function (res) {
        if (res.data.code == 0) {
          wx.hideLoading()
          var time = new Date().getTime()
          wx.previewImage({
            current: res.data.data + "?time=" + time,
            urls: [res.data.data + "??time=" + time]
          })
        }else{
          wx.showToast({ icon: "loading", title:res.data.message })
        }
      },
      fail: function (res) {
        wx.showToast({ icon: "loading", title: '服务器君开小差了哦~' })
      }
    })
  }
});
