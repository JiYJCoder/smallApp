var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      _num: 1,
      toPage:1,
      mallList: [],
      delBtnWidth: 120,
      x: 0,
      firtLen:0,
      tipText:"无更多数据",
      isReach:false,
  },
  tab: function (e) {
      if (Number(e.target.dataset.num)==this.data._num){
        return false;
      }else{
          this.setData({
              _num: Number(e.target.dataset.num),
              toPage:1
          })
          this.loadData(Number(e.target.dataset.num), this.data.toPage)
      }
      
  },
  delGoodOrder:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    wx.request({
        url: app.config.delGoodOrder,
        method:"PUT",
        data:{
            orderId:id,
            role: this.data._num
        },
        success:function(res){
            that.data.mallList.splice(index,1);
            that.setData({
                mallList: that.data.mallList
            })
            // that.loadData(that.data._num,1)
        }
    })
  },
  getGoodOrder:function(e){
      var id = e.currentTarget.dataset.id
    //跳转到详情页面
    wx.navigateTo({
        url: '/pages/order/orderDetails/orderDetails?orderId='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  touchstart: function (e) {
      let index = e.currentTarget.dataset.index;
      if (e.touches.length == 1) {
          this.setData({
              //记录触摸起始位置的X坐标
              x: e.touches[0].clientX,
          });
      }
  },
  touchmove: function (e) {
      let index = e.currentTarget.dataset.index;
      if (e.touches.length == 1) {
          let moveX = e.touches[0].clientX;
          let disX = this.data.x - moveX;
          var delBtnWidth = this.data.delBtnWidth;
          var txtStyle = "";
          if (disX == 0 || disX < 0) {
              txtStyle = "left:0px";
          } else if (disX > 0) {
              txtStyle = "left:-" + disX + "rpx";
              if (disX >= delBtnWidth) {
                  txtStyle = "left:-" + delBtnWidth + "rpx";
              }
          }
          this.data.mallList[index].left = txtStyle;
          this.setData({
              mallList: this.data.mallList
          })
      }
  },
  touchend: function (e) {
      if (e.changedTouches.length == 1) {
          //手指移动结束后水平位置
          var endX = e.changedTouches[0].clientX;
          //触摸开始与结束，手指移动的距离
          var disX = this.data.x - endX;
          var delBtnWidth = this.data.delBtnWidth;
          //如果距离小于删除按钮的1/2，不显示删除按钮
          var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0px";
          //获取手指触摸的是哪一项
          var index = e.currentTarget.dataset.index;
          this.data.mallList[index].left = txtStyle;
          this.setData({
              mallList: this.data.mallList
          })
      }
  },
  onLoad: function (options) {
      this.loadData(this.data._num, this.data.toPage);
  },
  loadData:function(type,page){
    var that =this;
    wx.request({
        url: app.config.getGoodOrderPage,
        method:"PUT",
        data:{
            userId: wx.getStorageSync("localUserId"),
            role:type,
            toPage: page
        },
        success:function(res){
            var data = res.data;
            for(let i=0;i<data.data.length;i++){
                data.data[i].left ="";
                
            }
            if (that.data.toPage==1){
                that.setData({
                    firtLen: data.data.length
                })
            }
            if (that.data.toPage > 1) {
                that.setData({
                    isReach: false
                })
                if(data.data.length==0){
                    that.setData({
                        isReach: true,
                        tipText: "无更多数据",
                        toPage: that.data.toPage-1
                    })
                    setTimeout(function(){
                        that.setData({
                            isReach: false,
                        })
                    },500)                    
                }
                data.data = that.data.mallList.concat(data.data);
            }
            that.setData({
                mallList:data.data
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
      var that = this;
      if (this.data.firtLen>=20){
          this.setData({
              toPage: this.data.toPage + 1,
              isReach:true,
              tipText:"加载中"
          })
          this.loadData(Number(this.data._num), this.data.toPage)
      }else{
          this.setData({
              isReach: true,
          })
          setTimeout(function(){
              that.setData({
                  isReach:false
              })
          },500)
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})