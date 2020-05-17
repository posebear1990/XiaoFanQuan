const app = getApp();
const { api } = app.globalData;
import { storageUtil } from "../../utils/index";

Page({
  data: {
    username: "",
    password: "",
    btnDisabled: true,
    focus: 1,
  },
  async bindLoginTap() {
    const { username, password } = this.data;

    if (!username || !password) {
      return false;
    }

    try {
      this.setData({ btnDisabled: true });

      await app.request(api.accessToken, {
        username: username,
        password: password,
      });

      wx.setStorageSync("username", username);
      const notFirst = storageUtil.get('notFirst')
      if (notFirst) {
        wx.redirectTo({
          url: "/pages/home/home",
        });
      } else {
        wx.redirectTo({
          url: "/pages/setting/setting",
        });
      }
    } finally {
      this.setData({ btnDisabled: false });
    }
  },
  bindEmailInput: function (e) {
    this.setData({
      username: e.detail.value,
    });
    this.setBtnState();
  },
  bindPwdInput: function (e) {
    this.setData({
      password: e.detail.value,
    });
    this.setBtnState();
  },
  setBtnState() {
    const { username, password } = this.data;
    this.setData({ btnDisabled: !(username && password) });
  },
  goToNext() {
    this.setData({ focus: 2 });
  },
  bindBlur: function () {
    this.setData({ focus: 0 });
  },
});
