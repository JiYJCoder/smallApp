var sourceType = [ ['camera'], ['album'], ['camera', 'album'] ]
var sizeType = [ ['compressed'], ['original'], ['compressed', 'original'] ]
var dataImg = ""
var areaText = ""
var formData = {}
var app = getApp()
Page({
  data: {
    imageList: [],
    location:"所在位置",
    loading: false,
    submitText: "发布",
    mapAddress:"",
    mapX:"",
    mapY:""
  },
  onLoad:function(){
    areaText = ""
    this.setData({
      userId: wx.getStorageSync("localUserId")
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[2],
      sizeType: sizeType[2],
      count: 9,
      success: function (res) {
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  tapLocation: function(e){
    var that = this
    wx.chooseLocation({success:function(e){
      that.setData({ location: e.name, mapAddress:e.name,mapX:e.latitude, mapY:e.longitude})
    }})
  },
  textChange: function(e){
    areaText = e.detail.value
  },
  dataSubmit: function(){
    var that = this
    console.log(formData)
    console.log(areaText)

    if(formData.content=="")
      formData.content = areaText
    wx.request({
      url: app.config.postTrendUrl,
      data: formData,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 0) {
          app.globalData.refreshTrend=true
          wx.showToast({
            title: '发布成功',
            icon:"success",
            success:function(){
              wx.navigateBack({ delta: 1 })
            }
          })
        } else {
          wx.showToast({ icon: "loading", title: res.data.code + " " + res.data.message })
        }
      },
      fail: function (res) {
        wx.showToast({ icon: "loading", title: '服务器君开小差了哦~' })
      },
      complete: function (res) {
        that.setData({ loading: false, submitText: "发布" })
      }
    })
  },
  imageSubmit:function(count,img){
    var that = this
    if(img!=null)
       dataImg += "," + img
    if(count < that.data.imageList.length){
      wx.uploadFile({
        url: app.config.uploadUrl,
        filePath: that.data.imageList[count],
        name: 'file',
        success: function (res) {
          var re = JSON.parse(res.data)
          count+=1
          that.imageSubmit(count, re.data)
        },
        fail: function (res) {
          wx.showToast({ icon: "loading", title: '服务器君开小差了哦~' })
        }
      })
    }else{
      if (dataImg.length > 0)
        formData.images = dataImg.substr(1)
      that.dataSubmit()
    }
  },
  formSubmit: function (e) {
    var that = this
    if(!that.data.loading){
      formData = e.detail.value
      dataImg = ""
      if (formData.content == "" && that.data.imageList.length==0) {
        wx.showToast({
          title: '还未发布任何内容',
          icon: 'loading',
          duration: 2000
        })
      }else{
        that.setData({ loading: true, submitText: "提交中" })
        if (that.data.imageList.length>0) {
          that.imageSubmit(0,null)
        }else{
          that.dataSubmit()
        }
      }
    }
  }
})
