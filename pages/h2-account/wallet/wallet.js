// pages/h2-account/wallet/wallet.js
var gql = require('../../../utils/graphql.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    info: '',
    list: [],
    timeStamp: 0,
    skip_flag: 0,
    tip_flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.doSearch()
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
    wx.showNavigationBarLoading();
    this.setData({
      date: ''
    })
    this.doSearch()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(1)
    this.setData({
      tip_flag: 1,
      skip_flag: this.data.skip_flag + 1
    })
    this.doSearch()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  doSearch: function() {
    gql.query({
      query: `query{
        mywallet(
          ${this.data.date?`time:${this.data.timeStamp}`:''}
          skip:${this.data.skip_flag*10}
        ){
          ptaddr
          balance
          transactions{
            timestamp
            reason
            income
            value
          }
        }
      }`
    }).then((res) => {
      console.log('success', res);
      for (let item of res.mywallet.transactions) {
        util.formatWalletDate(item)
      }
      this.setData({
        info: res.mywallet,
        list: res.mywallet.transactions
      })
      if (this.data.date) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
      if (res.mywallet.transactions.length < 10) {
        this.setData({
          tip_flag: 2
        })
      } else {
        this.setData({
          tip_flag: 0
        })
      }
    }).catch((error) => {
      console.log('fail', error);
      wx.showToast({
        title: '获取失败',
        icon: 'none'
      })
    });
  },

  bindDateChange(e) {
    let timeStamp = new Date(`${e.detail.value}T00:00:00`).getTime() / 1000
    this.setData({
      date: e.detail.value,
      timeStamp: timeStamp
    })
    this.doSearch()
  }

})