import Hashes from "hashes";
import appConfig from "../config/app";
import { urlUtil } from "../utils/index";

function generateBaseUrl(method, url, params) {
  const encodeUrl = encodeURIComponent(url);
  const paramStrList = Object.keys(params).map(
    (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
  );
  const paramStr = encodeURIComponent(paramStrList.sort().join("&"));

  return method + "&" + encodeUrl + "&" + paramStr;
}

export default function generateSignature({ method, url, params }) {
  let consumerSecret = appConfig.consumerSecret + "&";
  let tokens = wx.getStorageSync("oauthToken");
  let oauthToken = undefined;
  const { username, password } = params;

  if (tokens) {
    oauthToken = tokens.oauth_token;
    consumerSecret = consumerSecret + tokens.oauth_token_secret;
  } else if (username && password) {
    params = {
      x_auth_username: username,
      x_auth_password: password,
      x_auth_mode: "client_auth",
    };
  }

  params = {
    ...params,
    oauth_consumer_key: appConfig.consumerKey,
    oauth_nonce: Math.random().toString(36).substr(2).substr(0, 5),
    oauth_timestamp: new Date().getTime(),
    oauth_signature_method: "HMAC-SHA1",
    ...{ oauth_token: oauthToken },
  };

  const baseUrl = generateBaseUrl(
    method,
    /https:\/\/fanfou/.test(url) ? url : url.replace("https://", "http://"),
    params
  );

  return {
    Authorization:
      "OAuth " +
      urlUtil
        .stringifyQueryParameter({
          ...params,
          oauth_signature: new Hashes.SHA1().b64_hmac(consumerSecret, baseUrl),
        })
        .replace(/\=/g, '="')
        .replace(/\&/g, '",') +
      '"',
  };
}
