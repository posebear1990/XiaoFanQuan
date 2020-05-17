Component({
  data: {
    isButtonActive: false,
  },
  properties: {
    url: String,
  },
  methods: {
    onCloseButtonMask() {
      this.setData({ isButtonActive: false });
    },
    onMainButtonTap() {
      if (this.data.isButtonActive) {
        return;
      }

      this.triggerEvent("buttonTap");
    },
    onMainButtonLongPress() {
      wx.vibrateShort();
      this.setData({ isButtonActive: !this.data.isButtonActive });
    },
    onMainButtonTouchStart() {
      this.setData({ isTouched: true });
    },
    onMainButtonTouchEnd() {
      this.setData({ isTouched: false });
    },
    onSettingTap() {
      this.triggerEvent("settingTap", {
        callback: () => {
          this.onCloseButtonMask();
        },
      });
    },
    onWriteTap() {
      this.triggerEvent("writeTap", {
        callback: () => {
          this.onCloseButtonMask();
        },
      });
    },
    onPhotoTap() {
      this.triggerEvent("photoTap", {
        callback: () => {
          this.onCloseButtonMask();
        },
      });
    },
  },
});
