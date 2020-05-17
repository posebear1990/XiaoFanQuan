Component({
  properties: {
    icon: String,
    disabled: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    onTap() {
      if (this.data.disabled) {
        return;
      }

      this.triggerEvent("tap");
    },
  },
});
