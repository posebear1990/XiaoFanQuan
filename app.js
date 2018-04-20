const WeChatTracker = require("./hwet/bundle.js").WeChatTracker;
//app.js
const api = require("/config/api");
App({
  onLaunch: function () {
    const tricker = new WeChatTracker({appkey: 'appKey9527'});
    console.log(tricker.init)
    tricker.init();
  },
  globalData: {
    api: api
  },
  generateOAuthSignature: function (httpMethod, url, parameters) {
    var httpMethod = httpMethod.toUpperCase();

    var encodeUrl = encodeURIComponent(url);

    var paramStrList = [],
      paramStr = "";

    for (var k in parameters) {
      paramStrList.push(encodeURIComponent(k) + "=" + encodeURIComponent(parameters[k]));
    }
    paramStr = encodeURIComponent(paramStrList.sort().join("&"));

    return httpMethod + "&" + encodeUrl + "&" + paramStr;
  }
})