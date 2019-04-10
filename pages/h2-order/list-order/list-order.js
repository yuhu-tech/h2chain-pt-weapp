// pages/h2-order/list-order/list-order.js
var gql = require('../../../utils/graphql.js')
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: '',
    data: '',
    list: [],
    location: {
      latitude: '',
      longitude: '',
      name: ''
    }
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
        selected: 0
      })
    }
    /* picker start */
    let date = util.formatTime(new Date()).slice(0, 10).replace(/\//g, '-')
    this.setData({
      today: date
    })
    /* request */
    wx.showToast({
      title: '获取中',
      icon: 'loading',
      duration: 5000
    })
    gql.query({
      query: `query{
        search(
          state:1
          isregistered:0
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
          }
          postorder{
            salary
          }
          countyet
          maleyet
          femaleyet
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
      icon: 'loading',
      duration: 5000
    })
    this.setData({
      date: e.detail.value
    })
    let timeStamp = new Date(`${this.data.date}T00:00:00`).getTime() / 1000
    gql.query({
      query: `query{
        search(
          state:1
          isregistered:0
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
          }
          postorder{
            salary
          }
          countyet
          maleyet
          femaleyet
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

  goOrderInfo: function(e) {
    wx.navigateTo({
      url: `/pages/h2-order/list-order-info/list-order-info?orderid=${e.currentTarget.dataset.orderid}`,
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
  },

  doChooseLocation: function() {
    wx.chooseLocation({
      success: res => {
        console.log(res)
        this.setData({
          ['location.latitude']: res.latitude,
          ['location.longitude']: res.longitude,
          ['location.name']: res.name
        })
      },
    })
  }

})