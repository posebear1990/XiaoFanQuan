import { urlUtil, messageUtil, storageUtil } from "../../utils/index";
const app = getApp();
const { api } = app.globalData;

Component({
  options: {
    multipleSlots: true, //当设置为true，可以支持在组件中设置多个slot
  },
  properties: {
    message: {
      type: Object,
      value: {},
    },
    isActive: {
      type: Boolean,
      value: false,
    },
    disableAvatarTap: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    displayMessage: {},
  },
  observers: {
    message() {
      this.setData({
        displayMessage: messageUtil.formatMessage(this.data.message),
      });
    },
  },
  methods: {
    onMessageLongPress(e) {
      const { item } = e.currentTarget.dataset;

      item && this.setData({ isActive: true });
      wx.vibrateShort();
    },
    onCloseMessageMask() {
      this.setData({ isActive: false });
    },
    onTapPictuer(e) {
      const { item } = e.target.dataset;

      item &&
        wx.previewImage({
          urls: [item.photo.largeurl],
        });
    },
    onRepost(e) {
      const type = "repost";
      const { item } = e.target.dataset;
      this.triggerEvent("onActionStart", { type, data: item });
      const queryString = urlUtil.stringifyQueryParameter({
        action: type,
        message: item.text.map(str=> str.text).join(""),
        id: item.id,
        username: item.user.name,
      });

      this.triggerEvent("onActionSuccess", { type, data: item });
      this.triggerEvent("onActionComplete", { type });
      this.onCloseMessageMask();

      wx.navigateTo({ url: `/pages/add/add?${queryString}` });
    },
    onReply(e) {
      const type = "reply";
      const { item } = e.target.dataset;
      this.triggerEvent("onActionStart", { type, data: item });

      const nameList = [...new Set(item.text.map(str=> str.text).join('').match(/(\@.*?)\s/g))];
      const queryString = urlUtil.stringifyQueryParameter({
        action: type,
        message: (nameList.length === 1
          ? nameList
          : nameList.filter(
              (item) => item !== `@${storageUtil.get("selfName")} `
            )
        ).join(""),
        id: item.id,
        userid: item.user.id,
        username: item.user.name,
      });

      this.triggerEvent("onActionSuccess", { type, data: item });
      this.triggerEvent("onActionComplete", { type });
      this.onCloseMessageMask();

      wx.navigateTo({ url: `/pages/add/add?${queryString}` });
    },
    async onDelete(e) {
      const type = "delete";
      const { item } = e.target.dataset;
      this.triggerEvent("onActionStart", { type, data: item });

      try {
        await app.request({
          url: api.deleteStatus,
          method: "POST",
          params: {
            id: item.id,
          },
        });

        this.triggerEvent("onActionSuccess", { type, data: item });
      } finally {
        this.triggerEvent("onActionComplete", { type });
        this.onCloseMessageMask();
      }
    },
    async onFavorite(e) {
      const type = "favorite";
      const { item } = e.target.dataset;
      this.triggerEvent("onActionStart", { type, data: item });

      try {
        await app.request({
          url: item.favorited ? api.removeFavorit : api.addFavorit,
          method: "POST",
          params: {
            id: item.id,
          },
        });
        this.triggerEvent("onActionSuccess", {
          type,
          data: { ...item, favorited: !item.favorited },
        });
      } finally {
        this.triggerEvent("onActionComplete", { type });
        setTimeout(() => {
          this.onCloseMessageMask();
        }, 500);
      }
    },
    onUserAvatarTap(e) {
      const { item } = e.currentTarget.dataset;

      let userName = "";
      let userId = "";
      if (item && item.type) {
        if (item.type === "user-name") {
          userName = item.text.trim().substr(1);
          userId = item.id;
        } else {
          return;
        }
      } else {
        if (this.data.disableAvatarTap) {
          return;
        }

        userName = this.data.message.user.name;
        userId = this.data.message.user.id;
      }

      wx.navigateTo({
        url: `/pages/timeLine/timeLine?userId=${userId}&userName=${userName}`,
      });
    },
    onTopicTap(e) {
      const { item } = e.currentTarget.dataset;

      wx.navigateTo({
        url: `/pages/timeLine/timeLine?topic=${/\#(.*)\#/.exec(item.text)[1]}`,
      });
    },
  },
});
