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
    wx.showNavigationBarLoading();
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
      let temp_change = []
      let temp_normal = []
      let temp_invalid = []
      let temp_list = []
      for (let item of res.search) {
        util.formatItemOrigin(item)
        if (item.modifiedorder.length > 0) {
          util.formatItemModify(item)
        }
        if (item.ptorderstate === 4) {
          temp_change.push(item)
        } else if (item.ptorderstate === 1 || item.ptorderstate === 3) {
          temp_normal.push(item)
        } else if (item.ptorderstate === 2 || item.ptorderstate === 5) {
          temp_invalid.push(item)
        }
      }
      temp_list = temp_change.concat(temp_normal).concat(temp_invalid)
      wx.hideToast()
      this.setData({
        list: temp_list
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }).catch((error) => {
      console.log('fail', error);
      wx.showToast({
        title: '获取失败',
        icon: 'none'
      })
    });
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
      let temp_change = []
      let temp_normal = []
      let temp_invalid = []
      let temp_list = []
      for (let item of res.search) {
        util.formatItemOrigin(item)
        if (item.modifiedorder.length > 0) {
          util.formatItemModify(item)
        }
        if (item.ptorderstate === 4) {
          temp_change.push(item)
        } else if (item.ptorderstate === 1 || item.ptorderstate === 3) {
          temp_normal.push(item)
        } else if (item.ptorderstate === 2 || item.ptorderstate === 5) {
          temp_invalid.push(item)
        }
      }
      temp_list = temp_change.concat(temp_normal).concat(temp_invalid)
      wx.hideToast()
      this.setData({
        list: temp_list
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
      url: `/pages/h2-order/list-order-info/list-order-info?orderid=${e.currentTarget.dataset.orderid}&register=1`,
    })
  },

  /* 继续参加 */
  doIn: function(e) {
    gql.mutate({
      mutation: `mutation{
        modifyptoforder(
          orderid: "${e.currentTarget.dataset.orderid}"
          ptstatus:3
        )
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
        modifyptoforder(
          orderid: "${e.currentTarget.dataset.orderid}"
          ptstatus: 5
        )
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