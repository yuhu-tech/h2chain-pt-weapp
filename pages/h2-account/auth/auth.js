// pages/h2-account/auth/auth.js
var gql = require('../../../utils/graphql.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
    let orderid = util.getUrlParam(decodeURIComponent(options.q), 'orderid')
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          /* qrcode */
          if (this.data.options.qrcode) {
            wx.setStorageSync('qrcode', 'qrcode')
            wx.setStorageSync('orderid', this.data.options.orderid)
            wx.switchTab({
              url: `/pages/h2-order/list-order/list-order`,
            })
          }
          /* share */
          if (this.data.options.adviser) {
            /* adviser jump */
            wx.navigateTo({
              url: `/pages/h2-order/share/share?orderid=${this.data.options.orderid}`,
            })
          } else {
            /* pt jump */
            if (this.data.options.share) {
              wx.setStorageSync('share', 'share')
              wx.setStorageSync('orderid', this.data.options.orderid)
            }
            wx.switchTab({
              url: `/pages/h2-order/list-order/list-order`,
            })
          }
          /* end */
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindGetUserInfo: function(e) {
    wx.login({
      success: (res_login) => {
        wx.getUserInfo({
          success: (res_getUserInfo) => {
            gql.mutate({
              mutation: `mutation {
                login(
                  jscode:"${res_login.code}"
                ){
                  token
                }
              }`
            }).then((res) => {
              console.log('success', res);
              wx.setStorageSync('token', res.login.token)
              /* share */
              if (this.data.options.adviser) {
                console.log('check adviser')
                wx.navigateTo({
                  url: `/pages/h2-order/share/share?orderid=${this.data.options.orderid}`,
                })
              } else {
                console.log('check not adviser')
                if (this.data.options.share) {
                  console.log('check share')
                  wx.setStorageSync('share', 'share')
                  wx.setStorageSync('orderid', this.data.options.orderid)
                }
                wx.switchTab({
                  url: `/pages/h2-order/list-order/list-order`,
                })
              }
              /* end */
            }).catch((error) => {
              console.log('fail', error);
            });
          }
        })
      }
    })
  }

})