// pages/h2-order/list-order-info/list-order-info.js
var gql = require('../../../utils/graphql.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: '',
    register: '',
    orderid: 'default',
    order: '',
    avatar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.orderid) {
      this.setData({
        orderid: options.orderid,
        history: options.history,
        register: options.register
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
    wx.setStorageSync('share', 'done')
    wx.setStorageSync('qrcode', 'done')
    gql.query({
      query: `query{
        search(
          ${this.data.history ==='history'?'state:2':''}
          ${this.data.register ? `isregistered:${this.data.register}` : ''}
          orderid:"${this.data.orderid}"
        ){
          state
          adviser{
            companyname
            name
            phone
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
            cover
          }
          countyet
          maleyet
          femaleyet
          ptorderstate
        }
      }`
    }).then((res) => {
      console.log('success', res);
      let avatar = util.selectAvatar(res.search[0].originorder.occupation)
      util.formatItemOrigin(res.search[0])
      if (res.search[0].modifiedorder && res.search[0].modifiedorder.length > 0) {
        util.formatItemModify(res.search[0])
      }
      res.search[0].postorder.workcontent = decodeURI(res.search[0].postorder.workcontent)
      res.search[0].postorder.attention = decodeURI(res.search[0].postorder.attention)
      this.setData({
        order: res.search[0],
        avatar: avatar
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
      title: `五星级酒店${this.data.order.hotel.hotelname}招聘！`,
      path: `/pages/h2-account/auth/auth?share=share&orderid=${this.data.orderid}`
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

  goRegister: function(e) {
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
                    formid:"${e.detail.formId}"
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
                  url: `/pages/h2-order/registered-success/registered-success?orderid=${this.data.order.originorder.orderid}`,
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