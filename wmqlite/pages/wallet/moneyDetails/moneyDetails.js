var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    page:1,
    firtLen:0,
    isReach:false,
    tipText: "无更多数据",
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData(this.data.page);
  },
  loadData: function (toPage){
    wx.request({
        url: app.config.getBankPage,
        method:"PUT",
        data: { userId: wx.getStorageSync("localUserId"), toPage: toPage},
        success:(res)=>{
            var data =res.data;
            if (this.data.toPage == 1) {
                this.setData({
                    firtLen: data.data.length
                })
            }
            if (this.data.toPage > 1) {
                this.setData({
                    isReach: false
                })
                if (data.data.length == 0) {
                    this.setData({
                        isReach: true,
                        tipText: "无更多数据",
                        toPage: this.data.toPage - 1
                    })
                    setTimeout(function () {
                        this.setData({
                            isReach: false,
                        })
                    }, 500)
                }
                data.data = this.data.datas.concat(data.data);
            }
            this.setData({
                datas:data.data
            })
        }
    })
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
      var that = this;
      if (this.data.firtLen >= 20) {
          this.setData({
              toPage: this.data.toPage + 1,
              isReach: true,
              tipText: "加载中"
          })
          this.loadData(this.data.toPage)
      } else {
          this.setData({
              isReach: true,
          })
          setTimeout(function () {
              that.setData({
                  isReach: false
              })
          }, 500)
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})