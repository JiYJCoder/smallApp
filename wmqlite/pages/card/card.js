var app = getApp()
var opUserId = 0;
var opTruename = "TA"
Page({
  data: {
      isLogin:app.globalData.isLogin,
      praiseIcon:"praise",
      collectIcon:"collect",
      aniHide:true,
      imageList:[],
      praiseNum:0,
      collectNum:0,
      mallImg:[],
  },
  onLoad:function(options){
      var that = this;
      that.setData({isLogin: wx.getStorageSync("localUserId")!="",
                    userId: wx.getStorageSync("localUserId")})
      if(options.userId!=null){
          opUserId = options.userId
          that.loadData(opUserId)
          if (!that.data.isLogin){
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
                      }else{
                        wx.getUserInfo({
                            success: function(res) {
                                app.globalData.userInfo=res.userInfo
                                console.log(app.globalData.userInfo)
                            }
                        })
                      }
                    }
                  })
                }
              })
          }
      }
      setTimeout(function(){
        that.setData({aniHide:false})
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
        that.animation = animation
        animation.scale(2, 2).translateY(-45).opacity(0).step()
        that.setData({
          animationData: animation.export()
        })
      },1000)
  },
  onPullDownRefresh: function(){
       this.loadData(opUserId)
       wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: '您好，这是'+that.data.card.truename+'的名片，请惠存！',
      path: '/pages/card/card?userId='+opUserId,
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  navToMall:()=>{
      wx.navigateTo({
          url: '/pages/mall/commodity/commodity?toId=' + opUserId,
      })
  },
  savePhone: function (e) {
    var card = this.data.card
    var tel = card.tel
    if (tel) {
      tel = tel.replace("-", "").replace("-", "")
    }
    wx.addPhoneContact({
      mobilePhoneNumber: tel,
      firstName: card.truename,
      organization: card.company,
      title: card.position,
      email: card.email
    })
  },
  callPhone: function (e) {
    var tel = this.data.card.tel
    if (tel) {
      tel = tel.replace("-", "").replace("-", "")
    }
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  loadData:function(userId){//获取名片信息
      wx.showNavigationBarLoading()
      wx.showLoading({
        title: '正在加载'
      })
      var that = this;
      wx.request({
          url: app.config.getFourImg,
          method:"PUT",
          data: { userId: userId},
          success:(res)=>{
              var data =res.data;
              this.setData({
                  mallImg:data.data
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
             if (card.tel&&card.tel.length==11){
                card.tel = card.tel.substr(0,3)+"-"+card.tel.substr(3,4)+"-"+card.tel.substr(7,4)
             }
             opTruename = card.truename
             wx.setNavigationBarTitle({
               title: card.truename+"的名片"
             })
             that.setData({praiseIcon:card.isPraise==1?"praise_select":"praise",
                           collectIcon:card.isCollect==1?"collect_select":"collect",
                           collectText:card.isCollect==1?"从名片夹中移除":"放入名片夹",
                           praiseNum:card.praiseNum,
                           collectNum:card.collectNum,
                           card:card})
             that.loadImage(userId)
             }else{
             wx.showToast({icon:"loading",title:res.data.code+" "+res.data.message})
          }
        },
        fail: function(res) {
           wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
        },
        complete: function () {
           wx.hideNavigationBarLoading()
           wx.hideLoading()
        }
      })
  },
  loadImage: function (userId) {//获取图片
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
  },clickFace:function(e){
      console.log(e.target.dataset.src)
      wx.previewImage({
        current: e.target.dataset.src,
        urls: [e.target.dataset.src]
      })
  },
  praiseCard:function(){//点赞
      var that = this
      if(that.data.isLogin){
        var apiUrl = app.config.praiseCardUrl
        if(that.data.praiseIcon=="praise"){
            that.setData({praiseIcon:"praise_select",praiseNum:that.data.praiseNum+1})
        }else{
            apiUrl = app.config.cancelPraiseCardUrl;
            that.setData({praiseIcon:"praise",praiseNum:that.data.praiseNum-1})
        }
        wx.request({
          url: apiUrl,
          data: {userId:opUserId,localId:that.data.userId},
          success: function(res){
            // success
          }
        })
      }else{
        wx.navigateTo({url: '/pages/register/register'})
      }
  },
  collectCard:function(){//收藏
      var that = this
      if(that.data.isLogin){
        var apiUrl = app.config.collectCardUrl
        if(that.data.collectIcon=="collect"){
            that.setData({collectIcon:"collect_select",
                          collectText:"从名片夹中移除",
                          collectNum:that.data.collectNum+1})
        }else{
            apiUrl = app.config.cancelCollectCardUrl;
            that.setData({collectIcon:"collect",
                          collectText:"放入名片夹",
                          collectNum:that.data.collectNum-1})
        }
        wx.request({
          url: apiUrl,
          data: {userId:opUserId,localId:that.data.userId},
          success: function(res){
              // success
          }
        })
      }else{
        wx.navigateTo({url: '/pages/register/register'})
      }
  },
  openMyCard:function(e){//跳转我的名片
      wx.switchTab({url: '/pages/index/index'})
  },
  openRegister:function(e){
    wx.navigateTo({ url: '/pages/register/register?userId=' + opUserId})
  },
  openMyTrend: function (e) {
    wx.navigateTo({ url: '/pages/mytrend/mytrend?userId=' + opUserId + '&truename=' + opTruename })
  },
});
