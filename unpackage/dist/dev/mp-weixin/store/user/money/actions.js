"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_APIroute_money_api_money_api = require("../APIroute/money_api/money_api.js");
const actions = {
  /**
   * 初始化加载交易数据（刷新）
   * @param {*} param0 
   * @param {string} userId 
   */
  async fetchTransactionList({ commit, state }, userId) {
    commit("resetTransactionState");
    commit("setLoading", true);
    try {
      const list = await store_user_APIroute_money_api_money_api.getTransactionAPI(userId, 1, state.pageSize);
      commit("setTransactionList", list);
      commit("setCurrentPage", 1);
      commit("setHasMore", list.length === state.pageSize);
    } catch (err) {
      common_vendor.index.__f__("error", "at store/user/money/actions.js:18", "获取交易列表失败", err);
      commit("setHasMore", false);
    } finally {
      commit("setLoading", false);
    }
  },
  /**
   * 加载更多交易数据（下拉触发）
   * @param {*} param0 
   * @param {string} userId 
   */
  async loadMoreTransactions({ commit, state }, userId) {
    if (state.isLoading || !state.hasMore)
      return;
    commit("setLoading", true);
    try {
      const nextPage = state.currentPage + 1;
      const list = await store_user_APIroute_money_api_money_api.getTransactionAPI(userId, nextPage, state.pageSize);
      commit("appendTransactionList", list);
      commit("setCurrentPage", nextPage);
      if (list.length < state.pageSize) {
        commit("setHasMore", false);
      }
    } catch (err) {
      common_vendor.index.__f__("error", "at store/user/money/actions.js:43", "加载更多交易记录失败", err);
      commit("setHasMore", false);
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/money/actions.js.map
