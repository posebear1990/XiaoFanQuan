var Hashes = require("../../utils/hashes");
var SignatureGenrator = require("../../utils/oauthSignatureGenerator");
var uTools = require("../../utils");
var app = getApp();

Page({
  data: {
    appInfo: app.globalData.appInfo,
    email: "",
    pwd: ""
  },
  //事件处理函数
  bindLoginTap: function(e) {
    var data = this.data.appInfo;
    var api = data.api;

    var httpMethod = 'GET';
    var username = this.data.email,
      password = this.data.pwd;

    var params = {
      x_auth_username: username,
      x_auth_password: password,
      x_auth_mode: "client_auth",

      oauth_consumer_key: "d69cde37abaadf7143f8a518f167559a",
      oauth_signature_method: "HMAC-SHA1"
    }

    var url = api.accessToken;
    var consumerSecret = api.consumerSecret + "&";

    var signature = new SignatureGenrator(httpMethod, url, params, consumerSecret)
    console.log(signature);

    wx.request({
      url: signature.url,
      data: signature.parameters,
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        if(res.statusCode === 200) {
          var query = res.data;
          var oauthTokenObj = uTools.getJsonFromQuery(query);
          
          wx.setStorage({
            key: oauthToken,
            data: oauthTokenObj
          })

          var p = {
            oauth_token: "886994-015f890d3a40314b2b6e9c303b959341",

            oauth_consumer_key: "d69cde37abaadf7143f8a518f167559a",
            oauth_signature_method: "HMAC-SHA1"
          }
          var u = "http://api.fanfou.com/statuses/user_timeline.json"; 
          var a = new SignatureGenrator(httpMethod, u, p, consumerSecret + "77d8c44e29488cb321ee81d400acaa6b")
          console.log(a);
        }
      },
      fail: function(res) {
        console.log(res.data);
      }
    });


  },
  bindEmailInput: function(e) {
    this.setData({ email: e.detail.value })
  },
  bindPwdInput: function(e) {
    this.setData({ pwd: e.detail.value })
  },
  bindBlur: function() {
    //收起键盘
    wx.hideKeyboard()
  },
  onLoad: function () {
    var that = this;
  }
})