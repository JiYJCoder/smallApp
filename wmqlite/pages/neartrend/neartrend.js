var app = getApp()
var commentData = {}
var loading = false
var initLastId = 999999999
var lastId = initLastId
var distance = 10 //默认显示周边10公里
var lat,lng
Page({
  data: {
    isLogin: app.globalData.isLogin,
    animationComment: {},
    commentTop: 0,
    sendFocus: false,
    sendHide: true,
    commentHide: true,
    praiseText: "点赞",
    placeholder: "评论",
    praiseVal: 0,
    trendId: 0,
    dataLoading: true,
    trendList: [],
    imageList: []
  },
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    commentData = {}
    loading = false
    lastId = initLastId
    this.setData({
      isLogin: wx.getStorageSync("localUserId") != "",
      userId: wx.getStorageSync("localUserId"),
      userFace: app.globalData.userFace
    })
    commentData.userId = this.data.userId
    var that = this
    if (!this.data.isLogin) {
      wx.login({
        success: function (data) {
          wx.request({
            url: app.config.openIdUrl + "?code=" + data.code,
            success: function (res) {
              var reda = res.data.data
              app.globalData.openId = reda.openid
              if (reda.userid) {
                wx.setStorageSync("localUserId", reda.userid)
                app.globalData.isLogin = true
                app.globalData.userId = reda.userid
                that.setData({ isLogin: true, userId: reda.userid })
                commentData.userId = reda.userid
                wx.request({
                  url: app.config.userInfoUrl,
                  data: { userId: that.data.userId },
                  success: function (res) {
                    if (res.data.code == 0) {
                      that.setData({ userFace: res.data.data.face })
                    }
                  }
                })
              } else {
                wx.getUserInfo({
                  success: function (res) {
                    app.globalData.userInfo = res.userInfo
                  }
                })
              }
            }
          })
        }
      })
    } else {
      wx.request({
        url: app.config.userInfoUrl,
        data: { userId: that.data.userId },
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({ userFace: res.data.data.face })
          }
        }
      })
    }
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        lat = res.latitude
        lng = res.longitude
        that.loadData()
      }
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      isLogin: wx.getStorageSync("localUserId") != "",
      userId: wx.getStorageSync("localUserId")
    })
    lastId = initLastId
    this.setData({ dataLoading: true })
    this.loadData()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    this.loadData()
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: '附近的名片圈-汇聚热点 畅所欲言！',
      path: '/pages/neartrend/neartrend',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  swichNav: function (e) {
    wx.switchTab({
      url: '/pages/trend/trend'
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    var imgList = this.data.trendList[e.target.dataset.index].imageList
    var imgArr = []
    if (imgList.length > 0) {
      for (var i = 0; i < imgList.length; i++) {
        imgArr.push(imgList[i].url)
      }
    }
    wx.previewImage({
      current: current,
      urls: imgArr
    })
  },
  onTapPost: function () {
    if (this.openRegister()) {
      wx.navigateTo({
        url: '/pages/post/post'
      })
    }
  },
  onTapPage: function () {
    this.setData({ sendHide: true, sendFocus: false })
    if (!this.data.commentHide) {
      var animation = wx.createAnimation({
        duration: 120,
        timingFunction: 'linear'
      })
      this.animation = animation
      animation.width(0).step()
      this.setData({
        animationComment: animation.export()
      })
      this.setData({ commentHide: true })
    }
  },
  onTapComment: function (e) {
    if (this.openRegister()) {
      commentData.rUserId = 0
      this.setData({ trendId: e.target.dataset.id, trendIndex: e.target.dataset.ind })
      if (this.data.trendList[e.target.dataset.ind].isPraise == 0)
        this.setData({ praiseText: "点赞", praiseVal: 0 })
      else
        this.setData({ praiseText: "取消", praiseVal: 1 })
      if (e.target.offsetTop != this.data.commentTop + 10) {
        this.setData({ commentHide: true })
      }
      this.setData({ commentTop: e.target.offsetTop - 10, sendHide: true, sendFocus: false })
      if (this.data.commentHide) {
        this.setData({ commentHide: false })
        var animation = wx.createAnimation({
          transformOrigin: "50% 50%",
          duration: 120,
          timingFunction: 'ease'
        })
        this.animation = animation
        animation.width(170).step()
        this.setData({
          animationComment: animation.export()
        })
      } else {
        this.onTapPage()
      }
    }
  },
  delTrend: function (e) {
    var that = this
    wx.showActionSheet({
      itemList: ['删除动态'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.request({
            url: app.config.delTrendUrl,
            data: { id: e.target.dataset.id, userId: that.data.userId },
            success: function (res) {
              if (res.data.code == 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                  success: function () {
                    var tempList = that.data.trendList
                    tempList.splice(e.target.dataset.ind, 1);
                    that.setData({ trendList: tempList })
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  openComment: function (e) {
    if (this.openRegister()) {
      var that = this
      that.setData({ trendIndex: e.target.dataset.ind, commentHide: true })
      if (e.target.dataset.uid == that.data.userId) {
        wx.showActionSheet({
          itemList: ['删除评论'],
          success: function (res) {
            if (res.tapIndex == 0) {
              wx.request({
                url: app.config.delCommentUrl,
                data: { id: e.target.dataset.id, userId: e.target.dataset.uid, trendId: e.target.dataset.tid },
                success: function (res) {
                  if (res.data.code == 0) {
                    wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 1000,
                      success: function () {
                        var tempList = that.data.trendList
                        tempList[that.data.trendIndex].commentList = res.data.data
                        that.setData({ trendList: tempList })
                      }
                    })
                  }
                }
              })
            }
          }
        })
      } else {
        commentData.rUserId = e.target.dataset.uid
        that.setData({ trendId: e.target.dataset.tid, placeholder: "回复:" + e.target.dataset.truename, sendHide: false, sendFocus: true })
      }
    }
  },
  openCard: function (e) {
    var that = this
    if (e.target.dataset.userid == that.data.userId) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/card/card?userId=' + e.target.dataset.userid + "&localId=" + that.data.userId,
      })
    }
  },
  openLocation: function (e) {
    wx.openLocation({
      latitude: Number(e.target.dataset.lat), // 纬度，范围为-90~90，负数表示南纬
      longitude: Number(e.target.dataset.lng), // 经度，范围为-180~180，负数表示西经
      name: e.target.dataset.address,
      scale: 28
    })
    //   wx.openLocation({
    //   latitude: parseFloat(e.target.dataset.lat).toFixed(6),
    //   longitude: parseFloat(e.target.dataset.lng).toFixed(6),
    //   name: e.target.dataset.address,
    //   scale: 28
    // })
  },
  tapPraiseBtn: function (e) {
    if (this.openRegister()) {
      var that = this
      var url = app.config.praiseTrendUrl
      if (e.target.dataset.praise == "1")
        url = app.config.delPraiseUrl
      wx.request({
        url: url,
        data: { trendId: that.data.trendId, userId: that.data.userId },
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          if (res.data.code == 0) {
            var tempList = that.data.trendList
            tempList[that.data.trendIndex].praiseList = res.data.data
            that.setData({ trendList: tempList })
            if (url == app.config.praiseTrendUrl) {
              tempList[that.data.trendIndex].isPraise = 1
              that.setData({ praiseText: "取消", praiseVal: 1 })
            } else {
              tempList[that.data.trendIndex].isPraise = 0
              that.setData({ praiseText: "点赞", praiseVal: 0 })
            }
            that.setData({ trendList: tempList, commentHide: true })
          } else {
            wx.showToast({ icon: "loading", title: res.data.message })
          }
        },
        fail: function (res) {
          wx.showToast({ icon: "loading", title: '服务器君开小差了哦~' })
        }
      })
    }
  },
  tapCommentBtn: function (e) {
    if (this.openRegister()) {
      this.setData({ sendHide: false, sendFocus: true, commentHide: true, placeholder: "评论" })
    }
  },
  sendComment: function (e) {
    if (this.openRegister()) {
      var that = this
      commentData.trendId = that.data.trendId
      commentData.content = e.detail.value
      if (commentData.content == "") {
        wx.showToast({
          icon: "loading",
          title: '评论内容不能为空'
        })
        return
      }
      wx.request({
        url: app.config.commentTrendUrl,
        data: commentData,
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({ sendHide: true, sendFocus: false })
            var tempList = that.data.trendList
            tempList[that.data.trendIndex].commentList = res.data.data
            that.setData({ trendList: tempList })
          } else {
            wx.showToast({ icon: "loading", title: res.data.message })
          }
        },
        fail: function (res) {
          wx.showToast({ icon: "loading", title: '服务器君开小差了哦~' })
        }
      })
    }
  },
  loadData: function () {//获取动态
    var that = this
    if (!loading && that.data.dataLoading) {
      loading = true
      wx.request({
        url: app.config.nearTrendsUrl,
        data: { userId: that.data.userId == "" ? 0 : that.data.userId, lastId: lastId, lat: lat, lng: lng, distance: distance},
        success: function (res) {
          if (res.data.code == 0) {
            if(res.data.totalCount>0){
            if (res.data.totalCount < 20) {
              that.setData({ dataLoading: false })
            }
            var ldata = res.data.data
            if (lastId != initLastId) {
              lastId = ldata[ldata.length - 1].id
              var tempList = that.data.trendList
              for (var i = 0; i < ldata.length; i++) {
                tempList.push(ldata[i])
              }
              that.setData({ trendList: tempList })
            } else {
              lastId = ldata[ldata.length - 1].id
              that.setData({ trendList: ldata })
            }
            }else{
              that.setData({ dataLoading: false })
            }
          } else {
            wx.showToast({ icon: "loading", title: res.data.message })
          }
        },
        fail: function (res) {
          wx.showToast({ icon: "loading", title: '服务器君开小差了哦~' })
        }, complete: function (res) {
          wx.hideNavigationBarLoading()
          loading = false
        }
      })
    }
  }, openRegister: function () {
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/register/register'
      })
      return false
    }
    return true
  }
});
