"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = common_vendor.defineComponent({
  name: "MessageItem",
  props: {
    role: {
      type: String,
      default: "user",
      validator: (value = null) => {
        return ["user", "AI", "system"].includes(value);
      }
    },
    content: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "sent",
      validator: (value = null) => {
        return ["sending", "sent", "error"].includes(value);
      }
    },
    streaming: {
      type: Boolean,
      default: false
    },
    aiTitle: {
      type: String,
      default: "研师录AI"
    },
    /**
     * @property {String} userAvatar - 用户头像地址
     */
    userAvatar: {
      type: String,
      default: ""
    },
    /**
     * @property {String} aiAvatar - AI头像地址
     */
    aiAvatar: {
      type: String,
      default: ""
    }
  },
  computed: {
    /**
     * @description 获取消息类型（小写），用于CSS类名
     * @returns {String} 消息类型
     */
    messageType() {
      return this.role === "AI" ? "ai" : this.role;
    }
  },
  methods: {
    /**
     * @description 重试发送消息
     */
    onRetry() {
      this.$emit("retry");
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.messageType === "ai"
  }, $options.messageType === "ai" ? {
    b: $props.aiAvatar
  } : {}, {
    c: $options.messageType === "ai"
  }, $options.messageType === "ai" ? {
    d: common_vendor.t($props.aiTitle)
  } : {}, {
    e: common_vendor.t($props.content),
    f: common_vendor.n($options.messageType + "-content"),
    g: common_vendor.n($options.messageType + "-card-inner"),
    h: common_vendor.n($options.messageType + "-card-outer-gradient"),
    i: $props.status === "sending"
  }, $props.status === "sending" ? {} : {}, {
    j: $props.status === "error"
  }, $props.status === "error" ? {
    k: common_vendor.o((...args) => $options.onRetry && $options.onRetry(...args))
  } : {}, {
    l: common_vendor.n($options.messageType + "-wrapper"),
    m: $options.messageType === "user"
  }, $options.messageType === "user" ? {
    n: $props.userAvatar
  } : {}, {
    o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    p: common_vendor.n($options.messageType),
    q: common_vendor.n({
      "streaming": $props.streaming
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages_AI_Login_Match/AI/ai-chat/MessageItem.js.map
