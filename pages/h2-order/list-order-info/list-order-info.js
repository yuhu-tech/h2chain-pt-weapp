// pages/h2-order/list-order-info/list-order-info.js
var gql = require('../../../utils/graphql.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: 'default',
    cover: ['https://pix6.agoda.net/agaff/aff.bstatic.com/images/hotel/max1024x768/106/106460799.jpg', 'https://pix6.agoda.net/agaff/aff.bstatic.com/images/hotel/max1024x768/111/111907305.jpg', 'https://pix6.agoda.net/agaff/aff.bstatic.com/images/hotel/max1024x768/111/111604695.jpg'],
    order: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.orderid) {
      this.setData({
        orderid: options.orderid
      })
    }
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
    gql.query({
      query: `query{
        search(
          orderid:"${this.data.orderid}"
        ){
          state
          adviser{
            companyname
            name
          }
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
          postorder{
            salary
            workcontent
            attention
          }
          hotel{
            hotelname
            hoteladdress
            hotelphone
            hotelintroduction
          }
          countyet
          maleyet
          femaleyet
          ptorderstate
        }
      }`
    }).then((res) => {
      console.log('success', res);
      let temp = new Date(res.search[0].originorder.datetime * 1000)
      let tempdate = `${util.formatTime(temp).slice(0, 10)}`
      let tempHour = temp.getHours()
      let tempMinutes = util.formatNumber(temp.getMinutes())
      let tempTime = `${util.formatNumber(tempHour)}:${tempMinutes}~${util.formatNumber(tempHour + res.search[0].originorder.duration)}:${tempMinutes}`
      res.search[0].originorder.date = tempdate
      res.search[0].originorder.time = tempTime
      if (res.search[0].modifiedorder.length > 0) {
        let temp = new Date(res.search[0].modifiedorder[0].changeddatetime * 1000)
        let tempdate = `${util.formatTime(temp).slice(0, 10)}`
        let tempHour = temp.getHours()
        let tempMinutes = util.formatNumber(temp.getMinutes())
        let tempTime = `${util.formatNumber(tempHour)}:${tempMinutes}~${util.formatNumber(tempHour + res.search[0].modifiedorder[0].changedduration)}:${tempMinutes}`
        res.search[0].modifiedorder[0].date = tempdate
        res.search[0].modifiedorder[0].time = tempTime
      }
      this.setData({
        order: res.search[0]
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
  onShareAppMessage: function(res) {
    console.log(res);
    return {
      title: `五星级酒店${'服务员'}招聘！`,
      path: '/pages/h2-account/auth/auth'
    }
  },

  doCall: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.order.adviser.phone || '12345678',
    })
  },

  doClose: function() {
    wx.showModal({
      title: '提示',
      content: '确定关闭订单？',
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/h2-order/prompt-close/prompt-close',
          })
        }
      }
    })
  },

  openLocation: function() {
    wx.openLocation({
      latitude: 31,
      longitude: 120,
      name: '希尔顿酒店',
      address: '这里是地址的详细说明',
      success: res => {
        console.log(res)
      }
    })
  },

  goRegister: function() {
    gql.query({
      query: `query{
        me{
          personalmsg{
            name
            phonenumber
            idnumber
            gender
            height
            weight
            status
          }
        }
      }`
    }).then(res => {
      if (res.me.personalmsg) {
        wx.showModal({
          title: '提示',
          content: '确定要报名吗？',
          success: res => {
            if (res.confirm) {
              gql.mutate({
                mutation: `mutation{
                  registerorder(
                    registerorder:{
                      orderid:"${this.data.order.originorder.orderid}"
                      register:1
                    }
                  ){
                    error
                  }
                }`
              }).then(res => {
                wx.redirectTo({
                  url: '/pages/h2-order/registered-success/registered-success',
                })
              }).catch(err => {
                console.log(err)
                wx.showToast({
                  title: '报名失败',
                  icon: 'none'
                })
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '完善信息以报名',
          confirmText: '去完善',
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/h2-account/info/info',
              })
            }
          }
        })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '获取信息失败',
        icon: 'none'
      })
    })
  }

})