"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user_money_state = require("../../store/user/money/state.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      refreshing: false,
      // 直接使用模拟数据
      localTransactionList: store_user_money_state.moneyState.transactionList,
      isLoading: false,
      hasMore: false
    };
  },
  computed: {
    // 使用本地数据
    transactionList() {
      return this.localTransactionList;
    },
    // 按日期分组的交易记录 - 显示所有记录，不再按月筛选
    groupedTransactions() {
      const grouped = new UTSJSONObject({});
      if (this.transactionList && this.transactionList.length > 0) {
        this.transactionList.forEach((item = null) => {
          const date = this.formatDate(item.date);
          if (!grouped[date]) {
            grouped[date] = [];
          }
          grouped[date].push(item);
        });
      }
      return grouped;
    }
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pagesMine/bill/bill.vue:94", "加载交易记录:", this.transactionList);
    this.fetchData();
  },
  // 下拉触底加载更多
  onReachBottom() {
    this.loadMore();
  },
  methods: {
    // 初始化加载交易数据 - 使用模拟数据，无需实际请求
    fetchData() {
      this.isLoading = true;
      setTimeout(() => {
        if (!this.localTransactionList || this.localTransactionList.length === 0) {
          this.localTransactionList = store_user_money_state.moneyState.transactionList || [];
        }
        this.isLoading = false;
        this.hasMore = store_user_money_state.moneyState.hasMore;
      }, 500);
    },
    // 加载更多交易数据
    loadMore() {
      if (!this.hasMore || this.isLoading)
        return null;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.hasMore = false;
      }, 500);
    },
    // 下拉刷新
    refresh() {
      this.refreshing = true;
      setTimeout(() => {
        this.fetchData();
        this.refreshing = false;
      }, 1e3);
    },
    // 格式化日期分组标题
    formatGroupDate(dateStr = null) {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    // 格式化日期为YYYY-MM-DD
    formatDate(timestamp = null) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    },
    // 格式化时间为HH:mm
    formatTime(timestamp = null) {
      const date = new Date(timestamp);
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.transactionList.length > 0
  }, $options.transactionList.length > 0 ? common_vendor.e({
    b: common_vendor.f($options.groupedTransactions, (group, date, i0) => {
      return {
        a: common_vendor.t($options.formatGroupDate(date)),
        b: common_vendor.f(group, (item, index, i1) => {
          return {
            a: common_vendor.t(item.amount > 0 ? "入" : "出"),
            b: common_vendor.n(item.amount > 0 ? "income" : "expense"),
            c: common_vendor.t(item.name),
            d: common_vendor.t($options.formatTime(item.date)),
            e: common_vendor.t(item.amount > 0 ? "+" : ""),
            f: common_vendor.t(item.amount.toFixed(2)),
            g: common_vendor.n(item.amount > 0 ? "income" : "expense"),
            h: item.id
          };
        }),
        c: date
      };
    }),
    c: $data.isLoading
  }, $data.isLoading ? {} : !$data.hasMore ? {} : {}, {
    d: !$data.hasMore
  }) : !$data.isLoading ? {
    f: common_assets._imports_0$5
  } : {}, {
    e: !$data.isLoading,
    g: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    h: $data.refreshing,
    i: common_vendor.o((...args) => $options.refresh && $options.refresh(...args)),
    j: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesMine/bill/bill.js.map
