// pages/h2-order/registered-success/registered-success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: 'default'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderid: options.orderid
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
  onShareAppMessage: function(res) {
    console.log(res);
    return {
      title: '我刚才报名了这个零时工！',
      path: `/pages/h2-account/auth/auth?share=share&orderid=${this.data.orderid}`
    }
  },

  goBack: function() {
    wx.switchTab({
      url: '/pages/h2-order/list-order/list-order',
    })
  }

})