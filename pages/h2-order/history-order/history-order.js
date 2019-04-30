// pages/h2-order/history-order/history-order.js
var gql = require('../../../utils/graphql.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    list: []
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
    wx.showToast({
      title: '获取中',
      duration: 10000
    })
    gql.query({
      query: `query{
        search(
          state:2
        ){
          originorder{
            orderid
            occupation
            datetime
            duration
            mode
            count
            male
            female
          }
          modifiedorder{
            changeddatetime
            changedduration
            changedmode
            changedcount
            changedmale
            changedfemale
          }
          hotel{
            hotelname
            hoteladdress
          }
          postorder{
            salary
          }
          countyet
          maleyet
          femaleyet
          ptorderstate
        }
      }`
    }).then((res) => {
      console.log('success', res);
      for (let item of res.search) {
        util.formatItemOrigin(item)
        if (item.modifiedorder && item.modifiedorder.length > 0) {
          util.formatItemModify(item)
        }
      }
      wx.hideToast()
      this.setData({
        list: res.search
      })
    }).catch((error) => {
      console.log('fail', error);
      wx.showToast({
        title: '获取失败',
        icon: 'none'
      })
    });
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

  bindDateChange(e) {
    wx.showToast({
      title: '获取中',
      duration: 10000
    })
    this.setData({
      date: e.detail.value
    })
    let timeStamp = new Date(`${this.data.date}T00:00:00`).getTime() / 1000
    gql.query({
      query: `query{
        search(
          state:2
          datetime:${Number(timeStamp)}
        ){
          originorder{
            orderid
            occupation
            datetime
            duration
            mode
            count
            male
            female
          }
          modifiedorder{
            changeddatetime
            changedduration
            changedmode
            changedcount
            changedmale
            changedfemale
          }
          hotel{
            hotelname
            hoteladdress
          }
          postorder{
            salary
          }
          countyet
          maleyet
          femaleyet
          ptorderstate
        }
      }`
    }).then((res) => {
      console.log('success', res);
      for (let item of res.search) {
        util.formatItemOrigin(item)
        if (item.modifiedorder.length > 0) {
          util.formatItemModify(item)
        }
      }
      wx.hideToast()
      this.setData({
        list: res.search
      })
    }).catch((error) => {
      console.log('fail', error);
      wx.showToast({
        title: '获取失败',
        icon: 'none'
      })
    });
  },

  goDetail: function(e) {
    wx.navigateTo({
      url: `/pages/h2-order/list-order-info/list-order-info?orderid=${e.currentTarget.dataset.orderid}&history=history`,
    })
  }

})