var app = getApp()
Page({
  data: {
      isLogin:app.globalData.isLogin
  },
  onLoad:function(options){
      this.setData({isLogin: wx.getStorageSync("localUserId")!="",
                    userId: wx.getStorageSync("localUserId")})
      if(this.data.isLogin){
          this.loadData(1)
      }
  },
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()
  },
  loadData:function(page){//获取名片信息
      var that = this
      wx.showNavigationBarLoading()
      wx.request({
        url: app.config.rviewCardsUrl,
        data: { userId: that.data.userId, toPage: page, limit: 10000},
        success: function(res){
          if(res.data.code==0){
             var title = "看过我的";
             if(res.data.totalCount>0)
                 title = "看过我的("+res.data.data.length+")";
             wx.setNavigationBarTitle({
                title: title
             })
             that.setData({items:res.data.data})
              }else{
             wx.showToast({icon:"loading",title:res.data.code+" "+res.data.message})
          }
        },
        fail: function(res) {
           wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
        },
        complete: function(res) {
           wx.hideNavigationBarLoading()
        },
      })
  },
  phoneCall:function(e){//打电话
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.id
      })
  },
  clickCard:function(e){//打电话
      wx.navigateTo({
        url: '/pages/card/card?userId='+e.currentTarget.id
      })
  }
});
