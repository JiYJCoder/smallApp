var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      mallDates: [],//购买的数值
      _num:0,//购买的时间切换
  },
  //时间选择
  currentDate:function(e){
      this.setData({
          _num:e.target.dataset.num
      })
  },
  addShop:function(e){
        wx.request({
        url: app.config.addShop,
        method:"PUT",
        data: { userId: wx.getStorageSync("localUserId"), month: this.data.mallDates[this.data._num].month, price: this.data.mallDates[this.data._num].price},
        success: function (res) {
            if(res.data.code==0){
            var data = res.data.data;
                wx.requestPayment({
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': data.signType,
                    'paySign': data.paySign,
                    'success': function (res) {
                        if (res.errMsg == "requestPayment:ok"){
                            wx.showToast({
                                title: '支付成功',
                            });
                        }
                        setTimeout(wx.redirectTo({
                            url: '/pages/mall/commodity/commodity',
                        }),1000)
                    },
                    'fail': function (res) {
                        wx.showToast({
                            title: "支付失败",
                            image: "/style/icons/js.png"
                        });
                    }
                })
            }
        }})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var that = this;
      wx.request({
          url: app.config.getOpenMode,
          method: "PUT",
          data: { userId: wx.getStorageSync("localUserId") },
          success: function (res) {
              let {data} =res.data;
              that.setData({
                  mallDates:data
              })
          }
      })
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