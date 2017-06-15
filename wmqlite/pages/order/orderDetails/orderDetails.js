var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    orderIdData:{},
    isWho:"联系卖家",
    pay:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        orderId: options.orderId
    });
    var that = this;
    wx.showLoading({
        title: '加载中',
    });
    wx.request({
        url: app.config.getGoodOrder ,
        method:"PUT",
        data: { orderId: options.orderId},
        success:function(res){
            var data = res.data;
            that.setData({
                orderIdData:data.data
            });
            if (wx.getStorageSync("localUserId") == that.data.orderIdData.saleUserId){
                that.setData({
                    isWho:"联系买家"
                });
            }else{
                if (that.data.orderIdData.state==0){
                    that.setData({
                        pay:true
                    })
                }
            }
            wx.hideLoading();
        }
    });
  },
  payGoodOrder:function(e){
    var orderId =this.data.orderId
    wx.request({
        url: app.config.payGoodOrder,
        method:"PUT",
        data: { orderId: orderId},
        success:function(res){
            var data =res.data;
            if (data.code == 0) {
                wx.requestPayment({
                    'timeStamp': data.data.timeStamp,
                    'nonceStr': data.data.nonceStr,
                    'package': data.data.package,
                    'signType': data.data.signType,
                    'paySign': data.data.paySign,
                    'success': function (res) {
                        if (res.errMsg == "requestPayment:ok") {
                            wx.showToast({
                                title: '支付成功',
                            });
                        }
                        setTimeout(function () {
                            wx.navigateTo({
                                url: '/pages/order/myOrder/myOrder',
                            })
                        }, 1000)
                    },
                    'fail': function (res) {
                        wx.showToast({
                            title: "支付失败",
                            image: "/style/icons/js.png"
                        });
                    }
                })
            } 
        }
    })
  },
  makePhoneCall: function (){
      if (wx.getStorageSync("localUserId") == this.data.orderIdData.saleUserId) {
          wx.makePhoneCall({
              phoneNumber: this.data.orderIdData.tel,
          })
      } else {
          wx.makePhoneCall({
              phoneNumber: this.data.orderIdData.saleTel,
          })
         
      }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})