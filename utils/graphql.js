var Gql = require('wxapp-graphql');
var GraphQL = Gql.GraphQL;
var config = require('../config.js')

var gql = GraphQL({
  //设置全局url
  url: config.service.host, // url必填

  //设置全局动态header
  header: function() {
    let token = wx.getStorageSync('token')
    if (token) {
      return {
        "Authorization": "Bearer " + token
      }
    }
  },
  //设置全局错误拦截
  errorHandler: function(res) {

  }
}, true);

module.exports = gql;