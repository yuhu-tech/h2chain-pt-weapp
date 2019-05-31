// pages/h2-order/share/share.js
var gql = require('../../../utils/graphql.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: 'default',
    order: '',
    avatar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
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
    gql.query({
      query: `query{
        search(
          orderid:"${this.data.options.orderid}"
        ){
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
          }
          hotel{
            cover
          }
          countyet
          maleyet
          femaleyet
        }
      }`
    }).then((res) => {
      let avatar = util.selectAvatar(res.search[0].originorder.occupation)
      util.formatItemOrigin(res.search[0])
      if (res.search[0].modifiedorder && res.search[0].modifiedorder.length > 0) {
        util.formatItemModify(res.search[0])
      }
      console.log('success', res);
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
    let title = ''
    let param = ''
    if (this.data.options.adviser) {
      title = '顾问喊你干活了。'
      param = 'adviser'
    }
    if (this.data.options.agent) {
      title = '代理喊你干活了。'
      param = `agent&agentid=${this.data.options.agentid}`
    }
    return {
      title: title,
      path: `/pages/h2-account/auth/auth?share=share&sharetype=${param}&orderid=${this.data.options.orderid}`
    }
  }
})