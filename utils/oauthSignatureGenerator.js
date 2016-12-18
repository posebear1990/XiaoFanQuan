'use strict';
var Hashes = require("./hashes");

function SignatureGenrator(httpMethod, url, parameters, consumerSecret) {
    this.httpMethod = httpMethod;
    this.url = url;

    //无依赖的方法
    this.generateTimeStamp = function () {
        var date = new Date();

        return date.getTime();
    }

    this.generateNonce = function (length) {
        var len = length || 5;

        var randomStr = Math.random().toString(36).substr(2)
        var nonce = randomStr.substr(0, len);

        return nonce;
    }

    this.parameters = parameters;
    this.parameters.oauth_timestamp = this.generateTimeStamp();
    this.parameters.oauth_signature_method = "HMAC-SHA1";
    this.parameters.oauth_nonce = this.generateNonce();

    this.generateBaseUrl = function (httpMethod, url, parameters) {
        var httpMethod = httpMethod || this.httpMethod.toUpperCase();
        var url = url || this.url;
        var parameters = parameters || this.parameters;

        var encodeUrl = encodeURIComponent(url);

        var paramStrList = [],
            paramStr = "";
            debugger
        for(var k in parameters) {
            paramStrList.push(encodeURIComponent(k) + "=" + encodeURIComponent(parameters[k]));
        }
        paramStr = encodeURIComponent( paramStrList.sort().join("&") );

        return httpMethod + "&" + encodeUrl + "&" + paramStr;
    }

    this.baseUrl = this.generateBaseUrl();

    this.consumerSecret = consumerSecret;

    this.generateSignature = function () {
        var key = this.consumerSecret;
        var baseUrl = this.baseUrl;
        this.signature = new Hashes.SHA1().b64_hmac(key, baseUrl);

        return this.signature;
    }

    this.parameters.oauth_signature = this.generateSignature();
}


module.exports = SignatureGenrator;
