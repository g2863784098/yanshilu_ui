"use strict";
const common_vendor = require("../../../common/vendor.js");
const components_timeStamp = require("../../../components/timeStamp.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  name: "HistorySidebar",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    groupedHistory: {
      type: Object,
      default: () => {
        return new UTSJSONObject({ today: [], week: [], month: [] });
      }
    },
    currentChatId: {
      type: String,
      default: ""
    }
  },
  computed: Object.assign(Object.assign({}, common_vendor.mapState(new UTSJSONObject({
    conversations: (state = null) => {
      try {
        return state.user && state.user.aiChat && state.user.aiChat.aiChat ? state.user.aiChat.aiChat.conversations || [] : [];
      } catch (e) {
        common_vendor.index.__f__("error", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:145", "获取 conversations 状态出错:", e);
        return [];
      }
    },
    activeConversation: (state = null) => {
      try {
        return state.user && state.user.aiChat && state.user.aiChat.aiChat ? state.user.aiChat.aiChat.activeConversation : null;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:155", "获取 activeConversation 状态出错:", e);
        return null;
      }
    }
  }))), {
    /**
     * @description 按日期分类的历史记录
     * @returns {Object} 分类后的历史记录
     */
    groupedConversationsByDate() {
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const weekAgo = today - 7 * 24 * 60 * 60 * 1e3;
      const monthAgo = today - 30 * 24 * 60 * 60 * 1e3;
      const result = new UTSJSONObject({
        today: [],
        week: [],
        month: []
      });
      this.conversations.forEach((conv = null) => {
        const timestamp = conv.updatedAt || conv.createdAt;
        const formattedDate = components_timeStamp.formatTimestamp(timestamp);
        common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:186", `对话 ${conv.id} 的时间: ${formattedDate}, 时间戳: ${timestamp}`);
        if (timestamp >= today) {
          result.today.push(conv);
        } else if (timestamp >= weekAgo) {
          result.week.push(conv);
        } else if (timestamp >= monthAgo) {
          result.month.push(conv);
        }
      });
      ["today", "week", "month"].forEach((key) => {
        result[key].sort((a = null, b = null) => {
          const timeA = a.updatedAt || a.createdAt;
          const timeB = b.updatedAt || b.createdAt;
          return timeB - timeA;
        });
      });
      return result;
    },
    /**
     * @description 是否有任何历史记录
     * @returns {Boolean}
     */
    hasAnyHistory() {
      const g = this.groupedHistory;
      return g.today && g.today.length || g.week && g.week.length || g.month && g.month.length;
    }
  }),
  created() {
    common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:220", "=================== 调试信息开始 ===================");
    common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:221", "完整的 Vuex store:", this.$store);
    common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:222", "Vuex store状态:", this.$store.state);
    if (this.$store.state.user) {
      common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:225", "user模块状态:", this.$store.state.user);
      if (this.$store.state.user.aiChat) {
        common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:228", "aiChat模块状态:", this.$store.state.user.aiChat);
        if (this.$store.state.user.aiChat.aiChat) {
          common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:231", "内层 aiChat:", this.$store.state.user.aiChat.aiChat);
          common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:232", "内层 aiChat conversations:", this.$store.state.user.aiChat.aiChat.conversations);
        } else {
          common_vendor.index.__f__("error", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:234", "无法访问内层 aiChat!");
          common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:235", "aiChat 模块完整内容:", UTS.JSON.stringify(this.$store.state.user.aiChat));
        }
      } else {
        common_vendor.index.__f__("error", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:238", "无法访问 aiChat 模块!");
      }
    } else {
      common_vendor.index.__f__("error", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:241", "无法访问 user 模块!");
    }
    common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:244", "组件计算的 conversations:", this.conversations);
    common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:245", "组件计算的 historySummaries:", this.historySummaries);
    common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:246", "组件计算的 currentChatId:", this.currentChatId);
    common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:247", "=================== 调试信息结束 ===================");
  },
  mounted() {
    this.initConversationGroups();
  },
  methods: Object.assign(Object.assign({}, common_vendor.mapActions(new UTSJSONObject({
    setActiveConversation: "user/aiChat/setCurrentChat",
    deleteConversation: "user/aiChat/deleteChat"
  }))), {
    /**
     * @description 初始化对话分组
     */
    initConversationGroups() {
      const groupedConversations = this.groupedConversationsByDate;
      this.$emit("updateGroups", groupedConversations);
    },
    /**
     * @description 格式化时间戳为人类可读格式
     * @param {Number} timestamp - 时间戳
     * @param {String} format - 日期格式
     * @returns {String} 格式化后的日期字符串
     */
    formatDate(timestamp = null, format = "YYYY-MM-DD") {
      return components_timeStamp.formatTimestamp(timestamp, format);
    },
    /**
     * @description 获取对话模式的中文标签
     * @param {String} mode - 对话模式
     * @returns {String} 对话模式的中文标签
     */
    getModeLabel(mode = null) {
      const modeLabels = new UTSJSONObject({
        "general": "通用",
        "school": "择校",
        "career": "职业规划"
      });
      return modeLabels[mode] || "通用";
    },
    /**
     * @description 加载聊天历史
     * @param {String} chatId - 聊天ID
     */
    loadChatHistory(chatId = null) {
      this.setActiveConversation(chatId);
      this.$emit("loadChat", chatId);
    },
    /**
     * @description 删除历史记录
     * @param {String} chatId - 聊天ID
     * @param {Event} e - 事件对象，用于阻止冒泡
     */
    deleteChatHistory(chatId = null, e = null) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      common_vendor.index.__f__("log", "at pages_AI_Login_Match/AI/ai-chat/HistorySidebar.vue:319", "删除历史记录:", chatId);
      this.deleteConversation(chatId);
      this.$emit("deleteChat", chatId);
    }
  })
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.groupedHistory.today && $props.groupedHistory.today.length
  }, $props.groupedHistory.today && $props.groupedHistory.today.length ? {
    b: common_vendor.f($props.groupedHistory.today, (item, k0, i0) => {
      return common_vendor.e({
        a: $props.currentChatId === item.id
      }, $props.currentChatId === item.id ? common_vendor.e({
        b: common_vendor.t(item.abstract || item.title),
        c: item.chatMode
      }, item.chatMode ? {
        d: common_vendor.t($options.getModeLabel(item.chatMode))
      } : {}, {
        e: common_assets._imports_0$7,
        f: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), item.id),
        g: common_vendor.o(($event) => $options.loadChatHistory(item.id), item.id)
      }) : common_vendor.e({
        h: common_vendor.t(item.abstract || item.title),
        i: item.chatMode
      }, item.chatMode ? {
        j: common_vendor.t($options.getModeLabel(item.chatMode))
      } : {}, {
        k: common_assets._imports_0$7,
        l: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), item.id),
        m: common_vendor.o(($event) => $options.loadChatHistory(item.id), item.id)
      }), {
        n: item.id,
        o: $props.currentChatId === item.id ? 1 : ""
      });
    })
  } : {}, {
    c: $props.groupedHistory.week && $props.groupedHistory.week.length
  }, $props.groupedHistory.week && $props.groupedHistory.week.length ? {
    d: common_vendor.f($props.groupedHistory.week, (item, k0, i0) => {
      return common_vendor.e({
        a: $props.currentChatId === item.id
      }, $props.currentChatId === item.id ? common_vendor.e({
        b: common_vendor.t(item.abstract || item.title),
        c: item.chatMode
      }, item.chatMode ? {
        d: common_vendor.t($options.getModeLabel(item.chatMode))
      } : {}, {
        e: common_assets._imports_0$7,
        f: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), item.id),
        g: common_vendor.o(($event) => $options.loadChatHistory(item.id), item.id)
      }) : common_vendor.e({
        h: common_vendor.t(item.abstract || item.title),
        i: item.chatMode
      }, item.chatMode ? {
        j: common_vendor.t($options.getModeLabel(item.chatMode))
      } : {}, {
        k: common_assets._imports_0$7,
        l: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), item.id),
        m: common_vendor.o(($event) => $options.loadChatHistory(item.id), item.id)
      }), {
        n: item.id,
        o: $props.currentChatId === item.id ? 1 : ""
      });
    })
  } : {}, {
    e: $props.groupedHistory.month && $props.groupedHistory.month.length
  }, $props.groupedHistory.month && $props.groupedHistory.month.length ? {
    f: common_vendor.f($props.groupedHistory.month, (item, k0, i0) => {
      return common_vendor.e({
        a: $props.currentChatId === item.id
      }, $props.currentChatId === item.id ? common_vendor.e({
        b: common_vendor.t(item.abstract || item.title),
        c: item.chatMode
      }, item.chatMode ? {
        d: common_vendor.t($options.getModeLabel(item.chatMode))
      } : {}, {
        e: common_assets._imports_0$7,
        f: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), item.id),
        g: common_vendor.o(($event) => $options.loadChatHistory(item.id), item.id)
      }) : common_vendor.e({
        h: common_vendor.t(item.abstract || item.title),
        i: item.chatMode
      }, item.chatMode ? {
        j: common_vendor.t($options.getModeLabel(item.chatMode))
      } : {}, {
        k: common_assets._imports_0$7,
        l: common_vendor.o(($event) => $options.deleteChatHistory(item.id, $event), item.id),
        m: common_vendor.o(($event) => $options.loadChatHistory(item.id), item.id)
      }), {
        n: item.id,
        o: $props.currentChatId === item.id ? 1 : ""
      });
    })
  } : {}, {
    g: !$options.hasAnyHistory
  }, !$options.hasAnyHistory ? {} : {}, {
    h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    i: $props.visible ? 1 : ""
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages_AI_Login_Match/AI/ai-chat/HistorySidebar.js.map
