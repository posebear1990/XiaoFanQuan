var SignatureGenrator = require("../../utils/oauthSignatureGenerator");
var uTools = require("../../utils/util");
var app = getApp(),
    api = app.globalData.api;
Page({
  data: {
    timeline: [],
    page: 1
  },
  //事件处理函数
  bindAddTap: function(e) {
    wx.navigateTo({
      url: '/pages/add/add'
    });
  },
  formatTime(data) {
    data.map(function(d) {
      d.created_at = uTools.formatTime(new Date(d.created_at));

      var aTagFilter = /<a[^>]*>([\s\S]*?)<\/a>/i;
      
      if(aTagFilter.test(d.source)) {
        d.source = d.source.match(aTagFilter)[1];
      }
    });
  },
  onLoad: function () {
    var that = this;
  },
  onShow: function () {
    this.updateTimeLine();
  },
  updateTimeLine: function(page) {
    var that = this;
    var oauthTokenObj = wx.getStorage({
        key: "oauthToken",
        success: function(res) {
            var oauthTokenObj = res.data;

            var userTimeLineApi = api.api + api.userTimeLine,
                httpMethod = "GET", 
                consumerSecret = api.consumerSecret + "&",
                signatureKey = consumerSecret + oauthTokenObj.oauth_token_secret,
                params = {
                  oauth_token: oauthTokenObj.oauth_token,
                  oauth_consumer_key: api.consumerKey,
                  oauth_signature_method: "HMAC-SHA1"
                };
            if(page) {
              params.page = page;
              that.setData({ page: page });
            } else {
              that.setData({ page: 0 });
            }

            var signature = new SignatureGenrator(httpMethod, userTimeLineApi, params, signatureKey);

            wx.request({
              url: signature.url,
              data: signature.parameters,
              method: 'GET',
              success: function(res){
                that.formatTime(res.data);
                 
                if(page) {
                  if(res.data.length === 0) {
                    that.setData({ page: 0  }); 
                  }
                  res.data = that.data.timeline.concat(res.data);
                } else {
                  that.setData({ page: 1 });
                }


                that.setData({timeline: res.data});
                console.log(that.data);
              },
              fail: function() {
                wx.redirectTo({url: "/pages/login/login"});     
              }
            });
            console.log(signature);
        },
        fail: function(res) {
          wx.redirectTo({url: "/pages/login/login"});
        }
      });
  },
  onPullDownRefresh: function() {
    this.updateTimeLine();
  },
  onReachBottom: function() {
    if(this.data.page) {
      var page = this.data.page + 1;
      this.updateTimeLine(page);
    }
  }
})