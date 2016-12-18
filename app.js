//app.js
var api = require("/config/api");
App({
  onLaunch: function () {
  },
  globalData:{
    appInfo:{
      name: "饭否",
      title: "点击登录饭否",
      moto: "今天，我不关心人类，我只记自己",
      img: "/resource/img/appinfo-img.png",
      api: api
    }
  },
  generateOAuthSignature: function (httpMethod, url, parameters) {
    var httpMethod = httpMethod.toUpperCase();

    var encodeUrl = encodeURIComponent(url);

    var paramStrList = [],
        paramStr = "";
        
    for(var k in parameters) {
        paramStrList.push(encodeURIComponent(k) + "=" + encodeURIComponent(parameters[k]));
    }
    paramStr = encodeURIComponent( paramStrList.sort().join("&") );

    return httpMethod + "&" + encodeUrl + "&" + paramStr;
  }
})