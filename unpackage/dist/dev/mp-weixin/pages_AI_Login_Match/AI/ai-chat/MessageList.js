"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const MessageItem = () => "./MessageItem.js";
const _sfc_main = common_vendor.defineComponent({
  name: "MessageList",
  components: {
    MessageItem
  },
  props: {
    messages: {
      type: Array,
      default: () => {
        return [];
      }
    },
    emptyText: {
      type: String,
      default: "您可以开始提问了..."
    },
    aiTitle: {
      type: String,
      default: "研师录AI"
    },
    autoScrollId: {
      type: String,
      default: ""
    }
  },
  computed: Object.assign(Object.assign({}, common_vendor.mapState(new UTSJSONObject({
    userAvatar: (state = null) => {
      return state.user.baseInfo.avatar;
    }
  }))), { aiAvatar() {
    return "../../static/AIchat/welcomeImage.png";
  } }),
  methods: {
    /**
     * @description 处理滚动到顶部事件
     * @param {Object} e - 事件对象
     */
    onScrollToUpper(e = null) {
      this.$emit("scrollToUpper", e);
    },
    /**
     * @description 处理滚动事件
     * @param {Object} e - 事件对象
     */
    onScroll(e = null) {
      this.$emit("scroll", e);
    },
    /**
     * @description 滚动到底部
     */
    scrollToBottom() {
      if (this.messages.length > 0) {
        this.$emit("updateAutoScrollId", "msg-" + (this.messages.length - 1));
      }
    }
  }
});
if (!Array) {
  const _component_message_item = common_vendor.resolveComponent("message-item");
  _component_message_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.messages.length === 0
  }, $props.messages.length === 0 ? {
    b: common_assets._imports_0$8
  } : {
    c: common_vendor.f($props.messages, (msg, index, i0) => {
      return {
        a: common_vendor.o(($event) => _ctx.$emit("retryMessage", index), index),
        b: "641b1982-0-" + i0,
        c: common_vendor.p({
          role: msg.role,
          content: msg.content,
          status: msg.status,
          streaming: msg.streaming,
          ["ai-title"]: $props.aiTitle,
          ["user-avatar"]: _ctx.userAvatar,
          ["ai-avatar"]: $options.aiAvatar
        }),
        d: common_vendor.sei("msg-" + index, "view"),
        e: index
      };
    })
  }, {
    d: common_vendor.sei("r0-641b1982", "scroll-view", "messageScroll"),
    e: $props.autoScrollId,
    f: common_vendor.o((...args) => $options.onScrollToUpper && $options.onScrollToUpper(...args)),
    g: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args)),
    h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages_AI_Login_Match/AI/ai-chat/MessageList.js.map
