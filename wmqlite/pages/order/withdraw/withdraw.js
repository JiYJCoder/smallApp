var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"微信昵称",
    money:100.24,
    setMoney:"",
    tip:1,
    withdraw:false,
    fee:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
      var money = options.money;
      this.setData({
          money: money
      })
      wx.getUserInfo({
          success:function(res){
              let data = JSON.parse(res.rawData);
              that.setData({
                  name: data.nickName
              })
          }
      })
  },
  doBankMoney:function(e){
    var money = Number(this.data.setMoney);
    wx.request({
        url: app.config.doBankMoney,
        method:"PUT",
        data: { userId: wx.getStorageSync("localUserId"), money: money},
        success:(res)=>{
            var data =res.data;
            if(data.code==0){
                wx.showToast({
                    title: '提交成功',
                })
            }else{
                wx.showToast({
                    title: data.message,
                })
            }
        }
    })
  },
  setMoney:function(e){
      let num = Number(e.detail.value);
      if (num==0){
          this.setData({
              withdraw: false
          })
      }else if (num*100 <= this.data.money){
          this.setData({
              withdraw:true
          })
      } else if (num*100 > this.data.money){
          this.setData({
              withdraw: false
          })
      }
      this.setData({
          setMoney: num*100,
          fee: num/100
      });
  },
  allWithdraw:function(e){
    this.setData({
        setMoney: this.data.money,
        fee: this.data.money / 100
    })
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