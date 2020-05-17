import { dataUtil } from "../../utils/index";
const app = getApp();
const { api } = app.globalData;
Page({
  data: {
    showLoading: false,
    messageActive: false,
    timelines: [],
    page: 1,
  },
  async onLoad(query = {}) {
    this.userName = query.userName;
    this.userId = query.userId;
    this.topic =  query.topic;

    wx.setNavigationBarTitle({
      title: query.topic ? `#${query.topic}#` : query.userName,
    });

    this.updateTimeLine(1, true);
  },
  async updateTimeLine(page, isLoadingShow) {
    

    try {
      this.setData({ showLoading: isLoadingShow });
      let timelines = []

      if(this.topic) {
        timelines = await app.request(api.publicTimeline, {
          ...(page && { page }),
          q: this.topic,
          count: 40,
          mode: "lite",
          format: "html",
        });
      }else {
        if (!this.userId) {
          wx.showToast({
            title: "用户不存在或者为上锁用户",
            icon: "none",
          });
    
          return;
        }
        timelines = await app.request(api.userTimeLine, {
          ...(page && { page }),
          id: this.userId,
          count: 40,
          mode: "lite",
          format: "html",
        });
      }
      

      

      this.setData({
        timelines: page > 1 ? this.data.timelines.concat(timelines) : timelines,
      });

      return Promise.resolve();
    } finally {
      this.setData({ showLoading: false, messageActive: false });
    }
  },
  async onPullDownRefresh() {
    this.setData({ page: 1 });
    await this.updateTimeLine(1, false);

    wx.stopPullDownRefresh();
  },
  onReachBottom() {
    this.setData({ page: this.data.page + 1 });
    this.updateTimeLine(this.data.page + 1, false);
  },
  updateData(type, value) {
    this.setData({
      timelines: dataUtil.updateList(type, this.data.timelines, value),
    });
  },
  onActionStart() {
    this.loading = true;
  },
  onActionSuccess(e) {
    const { type, data: item } = e.detail;

    if (type === "delete") {
      this.updateData("delete", item);
    }

    if (type === "favorite") {
      this.updateData("update", item);
    }
  },
  onActionComplete(type) {
    type !== "favorite" && this.setData({ messageActive: false });
    this.loading = false;
  },
});
