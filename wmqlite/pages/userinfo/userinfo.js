var app = getApp()
var upface = null
Page({
  data: {
    eduArr: [{name:"初中",id:0},{name:"高中/中专",id:1},{name:"大专",id:2},{name:"本科",id:3},{name:"硕士",id:4},{name:"博士",id:5}],
    education:3,
    loading:false,
    submitText:"确定",
    year:"2017"
  },
  onLoad:function(options){
      this.setData({isLogin: wx.getStorageSync("localUserId")!="",
                userId: wx.getStorageSync("localUserId")})
      this.loadData()
  },
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()
  },
  loadData:function(){//获取名片信息
      var that = this
      wx.showNavigationBarLoading()
      wx.request({
        url: app.config.userInfoUrl,
        data:{userId:that.data.userId},
        success: function(res){
          if(res.data.code==0){
             var user = res.data.data
             if(user.startWorkYear){
                that.setData({year:user.startWorkYear})
             }
             that.setData(user)
             wx.hideNavigationBarLoading()
          }else{
             wx.showToast({icon:"loading",title:res.data.code+" "+res.data.message})
          }
        },
        fail: function(res) {
           wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
        }
      })
  },uploadFace:function(e){
      var that = this
      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){
          // success
          upface = res.tempFilePaths[0]
          that.setData({face:res.tempFilePaths[0]})
        }
      })
  },
  bindEduChange: function(e) {
    this.setData({
       education: e.detail.value
    })
  },
  bindYearChange: function(e) {
    this.setData({
       year: e.detail.value
    })
  },
  dataSubmit:function(e){
    var that = this
    var fdata = e.detail.value
    fdata.face = that.data.face
    wx.request({
      url: app.config.saveUserInfoUrl,
      data: fdata,
      method: 'POST',
      header:{"Content-Type":"application/x-www-form-urlencoded"},
      success: function(res){
        if(res.data.code==0){
          app.globalData.refreshIndex = true
          app.globalData.refreshMine = true
          wx.showToast({
            title: '保存成功',
            icon: "success",
            success: function () {
              wx.navigateBack({ delta: 1 })
            }
          })
        }else{
            wx.showToast({icon:"loading",title:res.data.code+" "+res.data.message})
        }
      },
      fail: function(res) {
          wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
      },
      complete: function(res) {
          that.setData({loading:false,submitText:"确定"})
      }
    })
  },
  formSubmit: function(e) {
    var that = this
    if (!that.data.loading) {
      var form = e.detail.value
      var err = ""
      if (form.truename == "")
        err == "请输入姓名";
      else if (form.tel == "")
        err += "请输入手机号码";
      else if (form.position == "")
        err += "请输入职位";
      if (err != "") {
        wx.showToast({ icon: "loading", title: err })
      } else {
          that.setData({loading:true,submitText:"提交中"})
          if(upface){
            wx.uploadFile({
              url: app.config.uploadUrl,
              filePath:upface,
              name:'file',
              success: function(res){
                  var re = JSON.parse(res.data)
                  that.setData({face:re.data}) 
                  that.dataSubmit(e)
              },
              fail: function(res) {
                console.log(res)
                wx.showToast({icon:"loading",title:'服务器君开小差了哦~'})
              },
              complete: function(res) {
                that.setData({loading:false,submitText:"确定"})
              }
            })
          }else{
            that.dataSubmit(e)
          }
      }
    }
  }
})
