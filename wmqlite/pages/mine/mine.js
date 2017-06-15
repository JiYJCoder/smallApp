var app = getApp();
Page({
  data: {
     isLogin:app.globalData.isLogin
  },
  onLoad:function(options){
      this.setData({isLogin: wx.getStorageSync("localUserId")!="",
              userId: wx.getStorageSync("localUserId")})
      if (this.data.isLogin) {
        this.loadData(this.data.userId)
      }
  },
  onShow:function(){
      if (app.globalData.refreshMine) {
          this.loadData(this.data.userId)
          app.globalData.refreshMine = false
      }
  },
  onPullDownRefresh: function(){
      wx.stopPullDownRefresh()
  },
  navMoney:function(){
      wx.navigateTo({
          url: '/pages/wallet/myWallet/myWallet',
      })
  },
  isMall:function(e){
    wx.request({
        url: app.config.isState,
        method: "PUT",
        data: { userId: wx.getStorageSync("localUserId")},
        success:function(res){
            let {code,data} =res.data;
            switch (data){
                case 0:
                    wx.navigateTo({ url: "/pages/mall/mallAuthority/mallAuthority"});
                break;
                case 1:
                    wx.navigateTo({
                        url: '/pages/mall/commodity/commodity',
                    })
                break;
                case 2:
                    wx.navigateTo({ url: "/pages/mall/mallAuthority/mallAuthority" });
                break;
            }
        }
    })
  },
  loadData:function(userId){//获取名片信息
      var that = this
     
      wx.request({
        url: app.config.userInfoUrl,
        data:{userId:userId},
        success: function(res){
          if(res.data.code==0){
             that.setData(res.data.data)
          }else{
             wx.showToast({icon:"loading",title:res.data.code+" "+res.data.message})
          }
        },
        fail: function(res) {
           wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
        }
      })
  },
  openRegister:function(){
      wx.navigateTo({url: '/pages/register/register'})
  }
})
