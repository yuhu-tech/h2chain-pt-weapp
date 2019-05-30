// pages/h2-account/info/info.js
var gql = require('../../../utils/graphql.js')
import {
  $inToptip
} from '../../../components/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    range_h: [150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220],
    index_h: '',
    range_w: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    index_w: '',
    gender: [{
      name: '男',
      value: 1,
    }, {
      name: '女',
      value: 2
    }],
    id: [{
      name: '学生',
      value: 1,
    }, {
      name: '社会人员',
      value: 2
    }],
    qlInfo: ''
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
    wx.login({
      success: res => {
        this.setData({
          js_code: res.code
        })
      }
    })
    gql.query({
      query: `query {
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
    }).then((res) => {
      console.log('success', res.me.personalmsg);
      let idx_h = -1
      let idx_w = -1
      if (res.me.personalmsg) {
        idx_h = this.data.range_h.indexOf(res.me.personalmsg.height)
        idx_w = this.data.range_w.indexOf(res.me.personalmsg.weight)
      }
      this.setData({
        qlInfo: res.me.personalmsg,
        index_h: idx_h,
        index_w: idx_w
      })
    }).catch((error) => {
      console.log('fail', error);
      wx.showToast({
        title: '加载失败',
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

  getPhoneNumber(e) {
    console.log(e)
    gql.query({
      query: `query{
        getphonenumber(
          encryptedData:"${e.detail.encryptedData}"
          iv:"${e.detail.iv}"
          jscode:"${this.data.js_code}"
        )
      }`
    }).then(res => {
      console.log('success', res);
      this.setData({
        ['qlInfo.phonenumber']: res.getphonenumber
      })
    }).catch(err => {
      console.log('fail', err);
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      })
    })
  },

  radioChangeGender(e) {},

  radioChangeId(e) {},

  bindPickerChangeH(e) {
    this.setData({
      index_h: e.detail.value
    })
  },

  bindPickerChangeW(e) {
    this.setData({
      index_w: e.detail.value
    })
  },

  formSubmit(e) {
    console.log(e.detail.value)
    if (!e.detail.value.name) {
      $inToptip().show('请输入您的姓名')
      return
    }
    if (!this.data.qlInfo) {
      $inToptip().show('请授权您的手机号')
      return
    }
    if (!e.detail.value.id) {
      $inToptip().show('请输入您的身份证号')
      return
    } else {
      let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
      if (!reg.test(e.detail.value.id)) {
        $inToptip().show('身份证号格式不正确')
        return
      }
    }
    if (!e.detail.value.gender) {
      $inToptip().show('请选择您的性别')
      return
    }

    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 10000
    })
    gql.mutate({
      mutation: `mutation {
        modifypersonalmsg(
          personalmsg: {
            name: "${e.detail.value.name}"
            phonenumber: "${this.data.qlInfo.phonenumber}"
            idnumber: "${e.detail.value.id}"
            gender: ${e.detail.value.gender}
            height: ${Number(this.data.range_h[this.data.index_h] || 0)}
            weight: ${Number(this.data.range_w[this.data.index_w] || 0)}
            status: ${Number(e.detail.value.identity||0)}
          }
        )
      }`
    }).then((res) => {
      console.log('success', res)
      wx.showToast({
        title: '提交成功'
      })
      setTimeout(() => {
        wx.navigateBack({
          detail: 1
        })
      }, 1000)
    }).catch((error) => {
      console.log('fail', error);
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      })
    });
  }

})