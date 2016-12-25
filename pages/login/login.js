var SignatureGenrator = require("../../utils/oauthSignatureGenerator");
var uTools = require("../../utils/util");
var app = getApp(),
    api = app.globalData.api;

Page({
  data: {
    appInfo: {
      name: "饭否",
      title: "点击登录饭否",
      img: "/resource/img/appinfo-img.png"
    },
    email: "",
    pwd: ""
  },
  //事件处理函数
  bindLoginTap: function(e) {
    var data = this.data.appInfo;

    var httpMethod = 'GET',
      username = this.data.email,
      password = this.data.pwd;

    var params = {
      x_auth_username: username,
      x_auth_password: password,
      x_auth_mode: "client_auth",

      oauth_consumer_key: api.consumerKey,
      oauth_signature_method: "HMAC-SHA1"
    };

    var url = api.accessToken;
    var consumerSecret = api.consumerSecret + "&";

    var signature = new SignatureGenrator(httpMethod, url, params, consumerSecret);
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
            key: "oauthToken",
            data: oauthTokenObj,
            success: function() {
              wx.switchTab({
                url: "/pages/index/index"
              });
            }
          });
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