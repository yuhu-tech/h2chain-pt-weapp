// pages/h2-account/auth/auth.js
var gql = require('../../../utils/graphql.js')

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
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '/pages/h2-order/list-order/list-order',
          })
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
              wx.switchTab({
                url: '/pages/h2-order/list-order/list-order',
              })
            }).catch((error) => {
              console.log('fail', error);
            });
          }
        })
      }
    })
  }

})