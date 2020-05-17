import { dataUtil, storageUtil } from "../../utils/index";
const app = getApp();
const { api } = app.globalData;

Page({
  data: {
    isLoadingShow: false,
    focusUsers: [],
    userList: [],
    panelHeight: 107,
    page: 1,
    isListEnd: false,
    notFirst: true,
    superMode: false,
    queryPanelHeight: undefined,
    clearTempMessage: undefined,
  },
  initData() {
    this.setData({
      focusUsers: storageUtil.get("focusUsers") || new Array(5).fill(undefined),
      notFirst: storageUtil.get("notFirst"),
      superMode: storageUtil.get("superMode"),
    });

    this.clearTempMessage = dataUtil.debounce(1600, false, () => {
      this.tempMessage = "";
    });

    const query = wx.createSelectorQuery();
    //选择id
    this.queryPanelHeight = query
      .select(`.avater-list`)
      .boundingClientRect((rect) => {
        this.setData({ panelHeight: rect.height });
      });
    this.queryPanelHeight.exec();
  },
  async onLoad() {
    this.initData();

    await this.updateUserList();
    this.queryPanelHeight.exec();
  },
  async updateUserList(page = 1) {
    this.setData({ showLoading: true });
    try {
      const resp = await app.request(api.friends, {
        ...(page && { page }),
        mode: "lite",
        format: "html",
      });
      this.setData({
        isListEnd: !resp.length && page > 1,
        userList:
          page > 1
            ? this.data.userList.concat(this.formatUserList(resp))
            : this.formatUserList(resp),
      });
    } finally {
      this.setData({ showLoading: false });
    }
  },
  formatUserList(list) {
    const focusedIds = this.data.focusUsers.map((item) => item && item.id);

    return list.map((item) => ({
      ...item,
      status: item.status && {
        ...item.status,
        text: item.status.text.replace(
          /(\@.*?)\s/g,
          (text) =>
            `<span class="user-name" style="font-weight: 500;color: #F0A0AC;">${text}</span>`
        ),
      },
      isFocused: focusedIds.includes(item.id),
    }));
  },
  onFocusTap(e) {
    const { item } = e.target.dataset;
    if (
      this.data.focusUsers.filter((item) => item && item.id).length >= 5 &&
      !item.isFocused
    ) {
      wx.showToast({
        title: "特别关注太多的话就变得不特别了哦~",
        icon: "none",
      });
      return;
    }

    let focusUsers = [...this.data.focusUsers];
    if (item.isFocused) {
      focusUsers = focusUsers.map((user) => {
        return user && user.id === item.id ? undefined : user;
      });
    } else {
      focusUsers[focusUsers.findIndex((user) => !user)] = item;
    }

    this.setData({
      focusUsers,
    });

    storageUtil.set("focusUsers", focusUsers);

    item.isFocused = !item.isFocused;
    this.updateData("update", item);
  },
  onUnload() {
    const homePage = getCurrentPages()[0];
    if (homePage && homePage.route === "pages/home/home") {
      homePage.onLoad();
    }

    const focusUsers = this.data.focusUsers.filter((item) => item);

    storageUtil.set(
      "focusUsers",
      focusUsers.concat(new Array(5 - focusUsers.length).fill())
    );
  },
  updateData(type, value) {
    this.setData({
      focusUsers: dataUtil.updateList(type, this.data.focusUsers, value),
      userList: dataUtil.updateList(type, this.data.userList, value),
    });
  },
  onReachBottom() {
    if (this.data.isListEnd) {
      return;
    }
    this.updateUserList(this.data.page + 1);
    this.setData({ page: this.data.page + 1 });
  },
  onExit() {
    if (this.data.notFirst) {
      wx.showActionSheet({
        itemList: ["确定"],
        success(res) {
          if (res.tapIndex === 0) {
            wx.removeStorage({
              key: "oauthToken",
              success() {
                wx.redirectTo({
                  url: "/pages/login/login",
                });
              },
            });
          }
        },
      });
    } else {
      storageUtil.set("notFirst", true);
      wx.redirectTo({
        url: "/pages/home/home",
      });
    }
  },
  easterEgg: new Map(
    Object.entries({
      蛤蛤蛤蛤: "Θ..Θ",
      喵喵喵: "?",
      呜啦呜啦呜啦: "JOJO，我不做人了！",
      呜呜呜呜: "想要甜甜的恋爱(´;ω;`)",
      啦啦啦啦啦啦: "我是卖报的小画家",
      喵呜: "ฅ(⌯͒• ɪ •⌯͒)ฅ",
      喵蛤蛤蛤: "success",
      蛤儿蛤儿蛤儿: "哟~，听口音是老北京儿蛙了",
      喵儿喵儿喵儿: "哟~，听口音是老北京猫了",
      呜啦儿呜啦儿呜啦儿: "哟~，听口音是老北京JO了",
      呜儿呜儿呜儿: "哟~，听口音是老北京火车了",
      啦儿啦儿啦儿: "哟~，听口音是老北京卖报的小画家了",
      喵儿呜儿: "(=^-ω-^=)",
      儿儿儿: "鹅鹅鹅，曲颈用刀割 拔毛添上水，点火就开锅",
    })
  ),
  onAvaterTap(e) {
    const wordList = ["儿", "喵", "蛤", "呜", "啦"];
    const { index } = e.target.dataset;
    const word = wordList[index];

    this.tempMessage += word;
    // 1.6秒后清除文字
    this.clearTempMessage();
    wx.showToast({
      title: this.tempMessage,
      icon: "none",
      success: () => {
        // 文字彩蛋
        const result = this.easterEgg.get(this.tempMessage);
        if (!result) {
          return;
        }

        if (result === "success") {
          wx.showModal({
            title: "潘朵拉的盒子",
            content:
              "你将要打开的是潘多拉盒子，打开后消息列表将不受特别关注的限制，你可以浏览所有已关注用户的消息。\n但要知道，这与小饭圈的开发初衷相去甚远，过载的消息往往也是痛苦的根源。你仍愿意打开吗？",
            showCancel: true,
            confirmColor: "#f25859",
            success(res) {
              if (res.confirm) {
                storageUtil.set("superMode", true);
                storageUtil.set("notFirst", true);

                wx.redirectTo({
                  url: "/pages/home/home",
                });
              }
            },
          });
        } else {
          setTimeout(() => {
            wx.showToast({ title: result, icon: "none", duration: 2500 });
          }, 300);
        }
      },
    });
  },
  tempMessage: "",
  onCloseSuperMode() {
    storageUtil.set("superMode", false);
    this.setData({ superMode: false });
  },
  onUserTap(e) {
    const { item } = e.currentTarget.dataset;

    wx.navigateTo({
      url: `/pages/timeLine/timeLine?userId=${item.id}&userName=${item.name}`,
    });
  },
});
