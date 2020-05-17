import { dataUtil } from "../../utils/index";
const app = getApp();
const { api, appConfig } = app.globalData;

Page({
  data: {
    focus: true,
    text: "",
    buttonMargin: 0,
    tempFilePath: "",
    count: 140,
    showLoading: false,
    cursor: 0,
    placeholder: "所在何处 所忆何时 所感何景 所念何人?",
  },
  placeholders: [
    {
      probability: 9.5,
      text: "所在何处 所忆何时 所感何景 所念何人?",
    },
    {
      probability: 0.5,
      text: "无脚之鸟 去看冰块 春天小熊 你可爱吗?",
    },
  ],
  query: {},
  initPlaceholder() {
    const all = dataUtil.sumArray(this.placeholders, "probability");
    const randomNumber = Math.random();

    let left = 0;
    let right = 0;
    for (const item of this.placeholders) {
      right = left + item.probability / all;
      if (left <= randomNumber && randomNumber < right) {
        this.setData({ placeholder: item.text });
        break;
      }
      left = right;
    }
  },
  bindTextInput(event) {
    this.setData({
      text: event.detail.value,
      count: 140 - event.detail.value.length,
    });
  },
  async bindSendTap() {
    this.setData({ showLoading: true });

    try {
      const resp = await app.request({
        url: this.data.tempFilePath ? api.photoUpload : api.update,
        method: this.data.tempFilePath ? "UPLOAD" : "POST",
        params: {
          status: this.data.text,
          ...(this.query.action === "repost" && {
            repost_status_id: this.query.id,
          }),
          ...(this.query.action === "reply" && {
            in_reply_to_status_id: this.query.id,
            in_reply_to_user_id: this.query.userid,
          }),
          format: 'html'
        },
        filePath: this.data.tempFilePath,
        name: "photo",
        isLoadingShow: false,
      });

      const isUploadPhoto = this.data.tempFilePath
      wx.navigateBack({
        success() {
          const homePage = getCurrentPages()[0];
          
          if (homePage && homePage.route === "pages/home/home") {
            if(!isUploadPhoto) {
              homePage.updateData("add", {...resp, created_at: ''});
            }
            homePage.updateTimeLine(1, false);
          }
        },
      });
    } finally {
      this.setData({ showLoading: false });
    }
  },
  onHeightChange(e) {
    const { height } = e.detail;
    this.setData({ buttonMargin: height });
  },
  onImgUploadTap() {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed", "compressed"],
      success: ({ tempFilePaths }) => {
        this.setData({
          tempFilePath: tempFilePaths[0],
        });
        this.setData({ focus: true });
      },
    });
  },
  onImgClearTap() {
    this.setData({
      tempFilePath: "",
    });
  },
  onLoad(query = {}) {
    this.initPlaceholder();

    if (!query.action) {
      return;
    }
    const result = {};
    Object.keys(query).forEach((key) => {
      result[key] = decodeURIComponent(query[key]);
    });
    this.query = result;

    if (this.query.action === "photo") {
      this.setData({ focus: false });
      this.onImgUploadTap();
    } else {
      this.setData({
        text: `${this.query.action === "repost" ? " 转" : " "}@${
          this.query.username
        } ${this.query.message}`,
        count:
          140 -
          `${this.query.action === "repost" ? " 转" : " "}@${
            this.query.username
          } ${this.query.message}`.length,
        cursor: this.query.action === "repost" ? 0 : -1,
      });
    }
  },
});
