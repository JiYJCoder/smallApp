const config = require('./config');

App({
  onLaunch: function () {
      //wx.removeStorageSync("localUserId")
      //wx.setStorageSync("localUserId","76")
    //   wx.navigateTo({
    //     url: '/pages/card/card?userId=507'
    //   })
    //  wx.request({
    //    url: 'http://localhost:8095/litemall/pay/openShop',    //URL地址写到config.js里面
    //    method:"PUT",
    //    data: { userId: 507,month:6,price:500},
    //    success: function (res) {
    //      if(res.data.code==0){
    //       var data = res.data.data;
    //       wx.requestPayment({
    //         'timeStamp': data.timeStamp,
    //         'nonceStr': data.nonceStr,
    //         'package': data.package,
    //         'signType': data.signType,
    //         'paySign': data.paySign,
    //         'success': function (res) {
               
    //         },
    //         'fail': function (res) {
    //         }
    //       })
    //      }
    //  }})
  },
  config:config,
  globalData: {
    isLogin: wx.getStorageSync("localUserId")!="",
    userId: wx.getStorageSync("localUserId"),
    userFace: "https://lite.wmq1688.com/lite/images/icons/face.png",
    refreshIndex:false,
    refreshTrend:false,
    refreshMine:false
  }
})
