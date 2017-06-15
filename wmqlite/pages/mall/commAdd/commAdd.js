var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:[],
    title:"",
    beWirte:"",
    size: [{ name: "", price:""}],
  },
  addImg:function(e){
      var that =this;
      if(this.data.imgUrl.length>=9){
          return false;
      }else{
          wx.chooseImage({
              count: 1,
              sizeType: "compressed",
              success: function (res) {
                  for (let i = 0; i < res.tempFilePaths.length; i++) {
                      let url = { url: res.tempFilePaths[i]}
                      that.data.imgUrl.push(url);
                      that.setData({
                          imgUrl: that.data.imgUrl
                      })
                  }
              }
          })
      }
  },
  delImg:function(e){
      var index = e.currentTarget.dataset.num;
      this.data.imgUrl.splice(index,1);
      this.setData({
          imgUrl: this.data.imgUrl
      })
  },
  setBeWrite:function(e){
    this.setData({
        beWirte: e.detail.value
    })
  },
  setTitle:function(e){
      this.setData({
          title: e.detail.value
      })
  },
  setSize:function(e){
      var index = e.currentTarget.dataset.num;
      var val = e.detail.value;
      this.data.size[index].name = val;
      this.setData({
        size :this.data.size
      })
  },
  setPrice:function(e){
      var index = e.currentTarget.dataset.num;
      var val = e.detail.value;
      this.data.size[index].price =`￥${val}` ;
      this.setData({
          size: this.data.size
      })
  },
  addSize:function(e){
      this.data.size.push({ size: "", price: "" });
      this.setData({
          size: this.data.size
      })
  },
  delSize:function(e){
    if(this.data.size.length ==1){
        return false;
    }else{
        var index = e.currentTarget.dataset.num;
        this.data.size.splice(index,1);
        this.setData({
            size: this.data.size
        })
    }
  },
  imgUpload:function(index){
    var that = this;
    if (index < that.data.imgUrl.length){
        wx.uploadFile({
            url: app.config.uploadUrl,
            filePath: that.data.imgUrl[index].url,
            name: 'file',
            success: function (res) {
                let data =res.data;
                data = JSON.parse(data).data;
                that.data.imgUrl[index].url = data;
                that.setData({
                    imgUrl: that.data.imgUrl
                })
                index +=1;
                that.imgUpload(index);
            },
            fail: function (res) {
                console.log(res);
                wx.showToast({ icon: "loading", title: '服务器君开小差了哦~' })
            }
        })
    }else{
        this.addData();
    }
  },
  addData:function(e){
      let modes = this.data.size;
      for (let i = 0; i < modes.length; i++) {
          modes[i].price = Number(modes[i].price.replace("￥", "")) * 100
      };

      let json = {
          userId: wx.getStorageSync("localUserId"),
          title: this.data.title,
          remark: this.data.beWirte,
          pics: this.data.imgUrl,
          modes: modes,
      };
      if (this.data.id) {
          json.id = this.data.id;
      }
      wx.request({
          url: app.config.addMallDetails,
          method: "PUT",
          data: json,
          success: function (res) {
              console.log(res)
              let {code, message, data} = res.data;
              if (code == 0) {
                  wx.showToast({
                      title: "成功",
                  });
                  setTimeout(function () {
                      wx.redirectTo({
                          url: '/pages/mall/commodity/commodity',
                      })
                  }, 1000)
              }
          }
      })
  },
  addMall:function(e){
    function notNull(arr){
        let flag = false;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name == "" || arr[i].price == "") {
                flag =true;
                break;
            }
        }
        return flag;
    }
    if (this.data.title ==""){
        wx.showToast({
            title:"标题不能为空",
            image:"/style/icons/js.png"
        });
    }else if (this.data.beWirte==""){
        wx.showToast({
            title: "描述不能为空",
            image: "/style/icons/js.png"
        });
    } else if (this.data.imgUrl.length ==0){
        wx.showToast({
            title: "图片不能为空",
            image: "/style/icons/js.png"
        });
    } else if (notNull(this.data.size)){
        wx.showToast({
            title: "规格不能为空",
            image: "/style/icons/js.png"
        });
    }else {
        this.imgUpload(0);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.id){
          this.data.id = Number(options.id);
          this.loadData(Number(options.id))
      }
  },
  loadData: function (id) {
      let that = this;
      wx.request({
          url: app.config.getMallDetails,
          method: "PUT",
          data: { id: id },
          success: function (res) {
              let {code, data} = res.data;
              data.price = (data.price / 100).toFixed(2);
              for (let i = 0; i < data.modes.length; i++) {
                  data.modes[i].price = (data.modes[i].price / 100).toFixed(2);
              }
              for (let t = 0; t < data.pics.length; t++) {
                  data.pics[t] = { url: data.pics[t]}
              }
              that.setData({
                  imgUrl: data.pics,
                  title:data.title,
                  beWirte: data.remark,
                  size: data.modes
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