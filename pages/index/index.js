var Hashes = require("../../utils/hashes");
var SignatureGenrator = require("../../utils/oauthSignatureGenerator");
var uTools = require("../../utils/util");
var app = getApp();

Page({
  data: {
    appInfo: app.globalData.appInfo,
    email: "",
    pwd: ""
  },
  //事件处理函数
  bindLoginTap: function(e) {

  },
  onLoad: function () {
    var that = this;
  }
})