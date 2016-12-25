var SignatureGenrator = require("../../utils/oauthSignatureGenerator");
var uTools = require("../../utils/util");
var app = getApp(),
    api = app.globalData.api;

Page({
  data:{
    text: "",
  },
  bindTextInput: function(event) {
    
    this.setData({
      text: event.detail.value
    });
  },
  bindSendTap: function() {
    var that = this;

    var oauthTokenObj = wx.getStorage({
       key: "oauthToken",
       success: function(res) {
          var oauthTokenObj = res.data;

          var updateApi = api.api + api.update,
              httpMethod = "POST", 
              consumerSecret = api.consumerSecret + "&",
              signatureKey = consumerSecret + oauthTokenObj.oauth_token_secret,
              params = {
                oauth_token: oauthTokenObj.oauth_token,
                oauth_consumer_key: api.consumerKey,
                oauth_signature_method: "HMAC-SHA1",
                status: that.data.text
              };
console.log(params);
          var signature = new SignatureGenrator(httpMethod, updateApi, params, signatureKey);
console.log(signature);
          wx.request({
            url: signature.url,
            data: signature.parameters,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
              console.log(res);
              wx.showToast({
                title: "发送成功",
                icon: "success",
                duration: 5000,
                complete: wx.navigateBack
              })
            },
            fail: function() {
              wx.redirectTo("/pages/login/login");     
            }
          });
       },
       fail: function(res) {
         wx.redirectTo("/pages/login/login");
       }
    });
  }
})