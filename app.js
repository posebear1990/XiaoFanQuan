//app.js
import api from "/config/api";
import appConfig from "/config/app";
import { request } from "/utils/index.js";
import "/lib/polyfill.js";

App({
  globalData: {
    api: api,
    appConfig: appConfig,
    username: wx.getStorageSync("username"),
  },
  request,
});
