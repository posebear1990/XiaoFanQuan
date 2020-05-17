import api from "../config/api";
import generateSignature from "./generateSignature";
import { urlUtil } from "../utils/index";

export default function request(option, data = {}, showLoading = false) {
  let url = option;
  let method = "GET";
  let params = data;
  let isLoadingShow = showLoading

  if (typeof option !== "string") {
    url = option.url;
    method = option.method.toLocaleUpperCase();
    params = option.params;
    isLoadingShow = option.isLoadingShow;
  }

  if (!/^http/i.test(url)) {
    url = `${api.baseUrl}${url}`;
  }

  isLoadingShow && wx.showLoading();

  return new Promise((resolve, reject) => {
    function success(res) {
      if (res.statusCode === 401) {
        wx.removeStorageSync("oauthToken");
        wx.redirectTo({
          url: "/pages/login/login",
        });
      }

      if (res.statusCode !== 200) {
        reject(res && res.data && res.data.error);
      }

      if (params && params.password && params.username) {
        wx.setStorageSync("oauthToken", urlUtil.parseQueryParameter(res.data));
      }

      resolve(res.data);
    }
    function fail(res) {
      reject(res);
    }
    function complete() {
      wx.hideLoading();
    }

    if (method === "UPLOAD") {
      method = "POST";

      wx.uploadFile({
        url,
        filePath: option.filePath,
        name: option.name,
        formData: params,
        success,
        fail,
        complete,
        header: {
          ...generateSignature({
            method,
            url,
            params: {},
          }),
        },
      });
    } else {
      wx.request({
        url,
        method,
        data: params,
        header: {
          "Content-Type":
            method === "GET"
              ? "application/json"
              : "application/x-www-form-urlencoded",
          ...generateSignature({
            method,
            url,
            params,
          }),
        },
        success,
        fail,
        complete,
      });
    }
  });
}
