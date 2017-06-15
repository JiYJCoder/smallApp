var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num:0,
    mallList:[],
    delBtnWidth:120,
    x:0,
    addBtn:true,
    share:false,
    animationData:{},
    shareData:{title:"",price:0,imgUrl:""},
    content:"【推荐】性价比超高，绝对优惠",
  },
  //切换
  tab:function(e){
      if (this.data._num == e.target.dataset.num){
        return false;
      }else{
          this.setData({
              _num: e.target.dataset.num
          })
          if (this.data._num == 0){
              this.loadData(0);
          }else{
              this.loadData(1);
          }
          
      }
    
  },
  closeShare:function(){
    this.setData({
        share:false,
    })
  },
  setContent:function(e){
    this.setData({
        content: e.detail.value
    })
  },
  openShare:function(e){
      var index = Number(e.currentTarget.dataset.index);
      this.shareData = { title: this.data.mallList[index].title, price: this.data.mallList[index].price, imgUrl: this.data.mallList[index].cover, id: this.data.mallList[index].id }
      this.setData({
        share:true,
        shareData: this.shareData
      });
  },
  share:function(){
    wx.request({
        url: app.config.shareGood,
        method:"POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { userId: wx.getStorageSync("localUserId"), goodId: this.data.shareData.id, title: this.data.shareData.title, price: this.data.shareData.price, cover: this.data.shareData.imgUrl, content: this.data.content},
        success:(res)=>{
            console.log({ userId: wx.getStorageSync("localUserId"), goodId: this.data.shareData.id, title: this.data.shareData.title, price: this.data.shareData.price, cover: this.data.shareData.imgUrl, content: this.data.content })
            var data =res.data;
            this.setData({
                share:false
            });
            if(data.code==0){
                wx.showToast({
                    title: '分享成功',
                })
            }else{
                wx.showToast({
                    title: '分享失败',
                })
            }
        }
    })
  },
  updateGoodState:function(e){
    let goodId = e.currentTarget.dataset.id;
    let type = Number(e.currentTarget.dataset.type);
    let that = this;
    wx.request({
        url: app.config.updateGoodState,
        method:"PUT",
        data:{
            userId: wx.getStorageSync("localUserId"),
            goodId:goodId,
            type:type
        },
        success:function(res){
            let {code} =res.data;
            if(code ==0){
                if(type==1){
                    wx.showToast({
                        title: '下架成功',
                    })
                }else{
                    wx.showToast({
                        title: '上架成功',
                    })
                }
               setTimeout(function(){
                   that.loadData(that.data._num)
               },500)
            }
        },
    })
  },
  touchstart:function(e){
    let index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
        this.setData({
            //记录触摸起始位置的X坐标
            x: e.touches[0].clientX,
        });
    }
  },
  touchmove:function(e){
    let index = e.currentTarget.dataset.index;
    if (e.touches.length == 1){
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
  touchend:function(e){
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
  delGood:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.request({
        url: app.config.delGood,
        method:"PUT",
        data:{
            userId: wx.getStorageSync("localUserId"),
            goodId: id
        },
        success:function(res){
            that.loadData(that.data._num)
        }
    })
  },
  navDetails:function(e){
      let id = e.currentTarget.id;
      wx.navigateTo({
          url: '/pages/mall/commDetails/commDetails?id='+id,
      })
  },
  setDetais:function(e){
    let id = e.currentTarget.id;
    wx.navigateTo({
        url: '/pages/mall/commAdd/commAdd?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.toId){
          this.setData({
              addBtn:false
          });
          wx.setNavigationBarTitle({
              title:"他的商品"
          })
      }
      this.data.toId = Number(options.toId);
      this.loadData(0);
  },
  loadData:function(type){
    var id = this.data.toId || wx.getStorageSync("localUserId");
    let that =this;
    wx.showLoading({
        title:"加载中"
    })
    wx.request({
        url: app.config.mallList,
        method:"PUT",
        data: { userId:id , type: type},
        success:function(res){
            let {code,data}= res.data;
            for(let i=0;i<data.length;i++){
                data[i].left = "";
            }
            that.setData({
                mallList: data
            });
            wx.hideLoading();
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