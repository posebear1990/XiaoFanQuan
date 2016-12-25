//app.js
var api = require("/config/api");
App({
  onLaunch: function () {
  },
  globalData: {
    api: api
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