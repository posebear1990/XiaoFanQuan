var SignatureGenrator = require("../../utils/oauthSignatureGenerator");
var app = getApp(),
    api = app.globalData.api;

Page({
  data:{
    profile: {}
  },
  onLoad:function(){
    this.updateUserProfile();
  },
  updateUserProfile: function() {
    var that = this;
    var oauthTokenObj = wx.getStorage({
        key: "oauthToken",
        success: function(res) {
            var oauthTokenObj = res.data;

            var userShowApi = api.api + api.userShow,
                httpMethod = "GET", 
                consumerSecret = api.consumerSecret + "&",
                signatureKey = consumerSecret + oauthTokenObj.oauth_token_secret,
                params = {
                  oauth_token: oauthTokenObj.oauth_token,
                  oauth_consumer_key: api.consumerKey,
                  oauth_signature_method: "HMAC-SHA1"
                };

            var signature = new SignatureGenrator(httpMethod, userShowApi, params, signatureKey);

            wx.request({
              url: signature.url,
              data: signature.parameters,
              method: 'GET',
              success: function(res){
                console.log(res)
                if(res.statusCode === 200) {
                  that.setData({
                    profile: res.data
                  });
                }else {
                  wx.redirectTo({url: "/pages/login/login"});
                }
              },
              fail: function() {
                wx.redirectTo({url: "/pages/login/login"});     
              }
            });
        },
        fail: function(res) {
          wx.redirectTo("/pages/login/login");
        }
      });
  },
  bindAboutTap: function() {
    wx.showModal({
      title: "关于",
      content: "纸记自己是一个只能用来浏览和记录自己饭否消息，不能浏览他人消息的微信小程序。项目的 github 地址是：https://github.com/posebear1990/twiteMe，欢迎来提PR^_^",
      showCancel: false
    })
  },
  bindLogoutTap: function() {
    wx.showModal({
      title: "确认退出当前账号？",
      success: function(res) {
        if (res.confirm) {
          wx.setStorage({
            key: "oauthToken",
            data: {},
            complete: function() {
              wx.redirectTo({
                url: "/pages/login/login"
              });
            }
          });
        }
      }
    })
  }
})