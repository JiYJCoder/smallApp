/**
 * 小程序配置文件
 */
//var host = "https://lite.wmq1688.com"
var host = "https://test.wmq1688.com"
var config = {
     // 获取openId
  openIdUrl: `${host}/lite/card/openId`,
     // 登录
  loginUrl: `${host}/lite/card/login`,
     // 上传
    uploadUrl: `https://m.wmq1688.com/mobile/common/uploadImg`,
     // 注册
    registerUrl: `${host}/lite/card/register`,
     // 验证码
    codeUrl: `${host}/lite/card/sendCode`,
    //  我的名片
    invitesUrl: `${host}/lite/card/invites`,
     // 获取名片信息
    cardInfoUrl: `${host}/lite/card/cardInfo`,
     // 我收藏的名片集
    cardsUrl: `${host}/lite/card/cards`,
     // 我点赞的名片集
    praiseCardsUrl: `${host}/lite/card/praiseCards`,
     // 我看过的名片集
    viewCardsUrl: `${host}/lite/card/viewCards`,
    // 收藏我的名片集
    rCardsUrl: `${host}/lite/card/rCards`,
    // 点赞我的名片集
    rPraiseCardsUrl: `${host}/lite/card/rPraiseCards`,
    // 看过我的名片集
    rviewCardsUrl: `${host}/lite/card/rViewCards`,
     // 我的个人信息
    userInfoUrl: `${host}/lite/card/userInfo`,
     // 保存个人信息
    saveUserInfoUrl: `${host}/lite/card/saveUserInfo`,
     // 点赞名片
    praiseCardUrl: `${host}/lite/card/praiseCard`,
     // 取消点赞
    cancelPraiseCardUrl: `${host}/lite/card/cancelPraiseCard`,
     // 收藏名片
    collectCardUrl: `${host}/lite/card/collectCard`,
     // 取消收藏
    cancelCollectCardUrl: `${host}/lite/card/cancelCollectCard`,
     // 取消浏览
    cancelViewCardUrl: `${host}/lite/card/cancelViewCard`,
     // 最新动态
    trendsUrl: `${host}/lite/trend/trends`,
     // 最新附近动态
    nearTrendsUrl: `${host}/lite/trend/nearbyTrends`,
     // 用户最新动态
    userTrendsUrl: `${host}/lite/trend/userTrends`,
     // 最新图片
    topImagesUrl: `${host}/lite/trend/topImages`,
     // 发布动态
    postTrendUrl: `${host}/lite/trend/post`,
     // 删除动态
    delTrendUrl: `${host}/lite/trend/del`,
     // 点赞
    praiseTrendUrl: `${host}/lite/trend/praise`,
     // 删除点赞
    delPraiseUrl: `${host}/lite/trend/delPraise`,
     // 评论
    commentTrendUrl: `${host}/lite/trend/comment`,
     // 删除评论
    delCommentUrl: `${host}/lite/trend/delComment`,
     // 创建图片
    createCardImgUrl: `${host}/lite/card/createCardImg`,
    //获取商品图片
    getFourImg: `${host}/litemall/shop/getFourImg`,
    //商城权限
    isState: `${host}/litemall/shop/getState`,
    //我的商品
    mallList: `${host}/litemall/shop/getGoodList`,
    //获取商品详情
    getMallDetails: `${host}/litemall/shop/getGood`,
    //增加或编辑商品
    addMallDetails: `${host}/litemall/shop/saveGood`,
    //开通商城
    addShop: `${host}/litemall/pay/openShop`,
    //删除商品
    delGood: `${host}/litemall/shop/delGood`,
    //更新商品状态
    updateGoodState: `${host}/litemall/shop/updateGoodState`,
    //获取商品规格
    getOpenMode: `${host}/litemall/shop/getOpenMode`,
    //购买商品
    doGoodOrder: `${host}/litemall/pay/doGoodOrder`,
    //订单列表
    getGoodOrderPage: `${host}/litemall/order/getGoodOrderPage`,
    //删除订单
    delGoodOrder: `${host}/litemall/order/delGoodOrder`,
    //订单详情
    getGoodOrder: `${host}/litemall/order/getGoodOrder`,
    //支付未完成订单
    payGoodOrder: `${host}/litemall/pay/payGoodOrder`,
    //分享商品
    shareGood: `${host}/lite/trend/shareGood`,
    //获取零钱
    getBankMoney: `${host}/litemall/bank/getBankMoney`,
    //获取零钱明细
    getBankPage: `${host}/litemall/bank/getBankPage`,
    //提现
    doBankMoney: `${host}/litemall/bank/doBankMoney`
};

module.exports = config
