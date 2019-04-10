// pages/h2-order/registered-order/registered-order.js
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
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

  doSearch: function() {
    wx.showToast({
      title: '获取中',
      icon: 'loading',
      duration: 10000
    })
    gql.query({
      query: `query{
        search(
          state:1
          isregistered:1
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
        let temp = new Date(item.originorder.datetime * 1000)
        let tempdate = `${util.formatTime(temp).slice(0, 10)}`
        let tempHour = temp.getHours()
        let tempMinutes = util.formatNumber(temp.getMinutes())
        let tempTime = `${util.formatNumber(tempHour)}:${tempMinutes}~${util.formatNumber(tempHour + item.originorder.duration)}:${tempMinutes}`
        item.originorder.date = tempdate
        item.originorder.time = tempTime

        if (item.modifiedorder.length > 0) {
          let temp = new Date(item.modifiedorder[0].changeddatetime * 1000)
          let tempdate = `${util.formatTime(temp).slice(0, 10)}`
          let tempHour = temp.getHours()
          let tempMinutes = util.formatNumber(temp.getMinutes())
          let tempTime = `${util.formatNumber(tempHour)}:${tempMinutes}~${util.formatNumber(tempHour + item.modifiedorder[0].changedduration)}:${tempMinutes}`
          item.modifiedorder[0].date = tempdate
          item.modifiedorder[0].time = tempTime
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

  doSearchDate: function() {
    wx.showToast({
      title: '获取中',
      icon: 'loading',
      duration: 10000
    })
    let timeStamp = new Date(`${this.data.date}T00:00:00`).getTime() / 1000
    gql.query({
      query: `query{
        search(
          state:1
          isregistered:1
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
        let temp = new Date(item.originorder.datetime * 1000)
        let tempdate = `${util.formatTime(temp).slice(0, 10)}`
        let tempHour = temp.getHours()
        let tempMinutes = util.formatNumber(temp.getMinutes())
        let tempTime = `${util.formatNumber(tempHour)}:${tempMinutes}~${util.formatNumber(tempHour + item.originorder.duration)}:${tempMinutes}`
        item.originorder.date = tempdate
        item.originorder.time = tempTime

        if (item.modifiedorder.length > 0) {
          let temp = new Date(item.modifiedorder[0].changeddatetime * 1000)
          let tempdate = `${util.formatTime(temp).slice(0, 10)}`
          let tempHour = temp.getHours()
          let tempMinutes = util.formatNumber(temp.getMinutes())
          let tempTime = `${util.formatNumber(tempHour)}:${tempMinutes}~${util.formatNumber(tempHour + item.modifiedorder[0].changedduration)}:${tempMinutes}`
          item.modifiedorder[0].date = tempdate
          item.modifiedorder[0].time = tempTime
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

  /* 选择日期 */
  bindDateChange(e) {
    wx.showToast({
      title: '获取中',
      duration: 10000
    })
    this.setData({
      date: e.detail.value
    })
    this.doSearchDate()
  },

  /* 订单详情 */
  goOrderInfo: function(e) {
    wx.navigateTo({
      url: `/pages/h2-order/list-order-info/list-order-info?orderid=${e.currentTarget.dataset.orderid}`,
    })
  },

  /* 继续参加 */
  doIn: function(e) {
    gql.mutate({
      mutation: `mutation{
        registerorder(
          registerorder: {
            orderid: "${e.currentTarget.dataset.orderid}"
            register: 1
          }
        ) {
          error
        }
      }`
    }).then(res => {
      wx.showToast({
        title: '操作成功'
      })
      setTimeout(() => {
        if (this.data.date) {
          this.doSearchDate()
        } else {
          this.doSearch()
        }
      }, 1000)
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    })
  },

  /* 不去了 */
  doOut: function(e) {
    gql.mutate({
      mutation: `mutation{
        registerorder(
          registerorder: {
            orderid: "${e.currentTarget.dataset.orderid}"
            register: 2
          }
        ) {
          error
        }
      }`
    }).then(res => {
      wx.showToast({
        title: '操作成功'
      })
      setTimeout(() => {
        if (this.data.date) {
          this.doSearchDate()
        } else {
          this.doSearch()
        }
      }, 1000)
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    })
  }

})