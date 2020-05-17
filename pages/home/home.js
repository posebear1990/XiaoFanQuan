import { dataUtil, storageUtil } from "../../utils/index";
const app = getApp();
const { api } = app.globalData;

Page({
  data: {
    showLoading: false,
    messageActive: false,
    timelines: [],
    mentionLines: [],
    page: 1,
    focusUsers: [],
    height: "100vh",
    current: 0,
    indicatorTop: 24,
    indicatorHeight: 32,
    superMode: false,
    newMention: false,
  },
  initData() {
    this.setData({
      focusUsers: (storageUtil.get("focusUsers") || [])
        .filter((item) => item)
        .map((item) => item.id),
      superMode: storageUtil.get("superMode"),
    });
  },
  prevPageIndex: 0,
  onSwiperChange(e) {
    const { current } = e.detail;

    this.setData({
      current,
      newMention: false,
    });
    current === 0
      ? this.updateTimeLine(1, true)
      : this.updateMentionLines(1, true);
  },
  onAnimationFinish() {
    if (this.prevPageIndex !== this.data.current) {
      this.setData({
        [this.data.current === 0 ? "mentionLines" : "timelines"]: [],
      });

      wx.pageScrollTo({ scrollTop: 0, duration: 0 });
      this.prevPageIndex = this.data.current;
    }
  },
  onIndicatorTap() {
    this.setData({ current: this.data.current === 0 ? 1 : 0 });
  },
  bindAddTap: function (e) {
    wx.navigateTo({
      url: "/pages/add/add",
    });
  },
  async onShow() {
    const resp = await app.request(api.notification);

    this.setData({ newMention: !!resp.mentions });
  },
  onLoad() {
    this.initData();

    this.updateTimeLine(1, true);
    const { top, height } = wx.getMenuButtonBoundingClientRect();

    this.setData({ indicatorTop: top, indicatorHeight: height });
  },
  async updateTimeLine(page, isLoadingShow) {
    this.onShow()
    
    let timelines = [];
    try {
      this.setData({ showLoading: isLoadingShow });
      if (this.data.superMode) {
        timelines = await app.request(api.homeTimeLine, {
          ...(page && { page }),
          count: 40,
          mode: "lite",
          format: "html",
        });
      } else {
        const resp = await app.request(api.userTimeLine, {
          ...(page && { page }),
          count: 20,
          mode: "lite",
          format: "html",
        });

        timelines = await Promise.allSettled(
          this.data.focusUsers.map((id) =>
            app.request(api.userTimeLine, {
              ...(resp.length === 20 && {
                since_id: resp[resp.length - 1].id,
              }),
              ...(page > 1 && {
                max_id: this.data.max_id,
              }),
              id,
              mode: "lite",
              format: "html",
            })
          )
        );

        if (resp.length) {
          this.setData({ max_id: resp[resp.length - 1].id });

          storageUtil.set(
            "selfName",
            resp[0] && resp[0].user && resp[0].user.name
          );
        }

        timelines = [resp]
          .concat(timelines.filter((item) => Array.isArray(item)))
          .reduce((accumulator, current) => accumulator.concat(current), [])
          .sort((a, b) => b.rawid - a.rawid);
      }
      this.setData({
        timelines: page > 1 ? this.data.timelines.concat(timelines) : timelines,
      });

      return Promise.resolve();
    } finally {
      this.setData({ messageActive: false });
      this.updatePageHeight();
    }
  },
  async updateMentionLines(page, isLoadingShow) {
    this.setData({ showLoading: isLoadingShow });
    try {
      const resp = await app.request(api.mentionLine, {
        ...(page && { page }),
        count: 20,
        mode: "lite",
        format: "html",
      });
      this.setData({
        mentionLines: page > 1 ? this.data.mentionLines.concat(resp) : resp,
      });
    } finally {
      this.updatePageHeight("mention");
    }
  },
  updatePageHeight(type = "main") {
    const query = wx.createSelectorQuery();
    //选择id
    query
      .select(`.home-paper.${type}`)
      .boundingClientRect((rect) => {
        this.setData({ height: rect.height + "px" });
      })
      .exec();

    this.setData({ showLoading: false });
  },
  async onPullDownRefresh() {
    this.setData({ page: 1 });
    if (this.data.current === 0) {
      await this.updateTimeLine(1, false);
    } else {
      await this.updateMentionLines(1, false);
    }

    wx.stopPullDownRefresh();
  },
  onReachBottom() {
    if (
      (this.data.current === 0 && !this.data.timelines.length) ||
      (this.data.current === 1 && !this.data.mentionLines.length)
    ) {
      return;
    }

    if (this.data.current === 0) {
      this.updateTimeLine(this.data.page + 1, true);
    } else {
      this.updateMentionLines(this.data.page + 1, true);
    }
    this.setData({ page: this.data.page + 1 });
  },
  onMainButtonTap() {
    this.onWriteTap();
  },
  onWriteTap(e) {
    const action = e && e.action && e.action;
    const callback = (e && e.detail && e.detail.callback) || (() => {});

    wx.navigateTo({
      url:
        action === "photo" ? "/pages/add/add?action=photo" : "/pages/add/add",
      success: callback,
    });
  },
  async onPhotoTap(e) {
    this.onWriteTap({ ...e, action: "photo" });
  },
  onSettingTap(e) {
    const callback = (e && e.detail && e.detail.callback) || (() => {});

    wx.navigateTo({ url: "/pages/setting/setting", success: callback });
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
