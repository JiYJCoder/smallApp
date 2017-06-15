var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _sel:0,//规格选择
    _num:1,//数量选择
    address:{
        flag:false,
        userName:"",
        postalCode:"",
        provinceName:"",
        cityName:"",
        countyName:"",
        detailInfo:"",
        telNumber:"",
    },//地址选择
    showBuy:false,//购买页面
    datas:{},
  },
  doGoodOrder:function(e){
      let json ={
          userId: wx.getStorageSync("localUserId"),
          goodId: this.data.id,
          mode: this.data.datas.modes[this.data._sel].name,
          price: this.data.datas.modes[this.data._sel].price,
          num: this.data._num,
          truename: this.data.address.userName,
          tel: this.data.address.telNumber,
          address: this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo
      }
      if (this.data.address.flag == false){
          wx.showToast({
              title: '收货地址不能为空',
              image: "/style/icons/js.png"
          })
      }else{
          wx.request({
              url: app.config.doGoodOrder,
              method:"PUT",
              data:json,
              success:function(res){
                  let data = res.data;
                  if (data.code ==0){
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
                              setTimeout(function(){
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
                  }else{
                      wx.showToast({
                          title: "订单生成失败",
                          image: "/style/icons/js.png"
                      });
                  }
                  
              }
          })
      }
  },
  previewImage:function(e){
    let index = Number(e.currentTarget.dataset.num);
    wx.previewImage({
        current: this.data.datas.pics[index],
        urls: this.data.datas.pics,
    })
  },
  showBuy:function(e){
      if (this.data.datas.userId == wx.getStorageSync("localUserId")) {
          wx.showToast({
              title: '不能购买自己商品',
              image: "/style/icons/js.png"
          })
      }else{
          this.setData({
              showBuy: true
          })
      }
  },
  hideBuy:function(e){
      this.setData({
          showBuy: false
      })
  },
  sel:function(e){
      this.setData({
          _sel: e.target.dataset.num
      })
  },
  add:function(e){
      this.setData({
          _num: this.data._num + 1
      })
  },
  less:function(e){
      if (this.data._num>1){
          this.setData({
              _num: this.data._num - 1
          })
      }
  },
  setNum:function(e){
      console.log(e)
      let num = Number(e.detail.value);
      this.setData({
          _num: num
      })
  },
  addressSel:function(e){
      let that =this;
      wx.chooseAddress({
          success: function (res) {
                that.setData({
                    address: {
                        flag: true,
                        userName: res.userName,
                        postalCode: res.postalCode,
                        provinceName: res.provinceName,
                        cityName: res.cityName,
                        countyName: res.countyName,
                        detailInfo: res.detailInfo,
                        telNumber: res.telNumber,
                    }
                })
          },
          fail:function(err){
            if(err.errMsg= "chooseAddress:cancel"){
                that.setData({
                    address: {
                        flag: false,
                        userName: "",
                        postalCode: "",
                        provinceName: "",
                        cityName: "",
                        countyName: "",
                        detailInfo: "",
                        telNumber: "",
                    }
                })
            }
          }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let id = Number(options.id);
      this.data.id =id;
      this.loadData(id);
  },
  loadData:function(id){
    let that =this;
    wx.request({
        url: app.config.getMallDetails,
        method:"PUT",
        data:{id:id},
        success:function(res){
            let {code,data} =res.data;
            that.setData({
                datas:data
            })
        }
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