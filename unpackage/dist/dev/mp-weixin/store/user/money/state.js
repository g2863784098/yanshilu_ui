"use strict";
const moneyState = {
  /**
   * 交易订单列表
   * @type {TransactionItem[]}
   */
  transactionList: [
    {
      id: "tx001",
      name: "学员购买《数学基础》课程",
      // 时间戳格式，单位为毫秒
      /** @type {number} 交易时间的时间戳 */
      date: 17104842e5,
      // 2024-03-15 14:30:00
      amount: 199
    },
    {
      id: "tx002",
      name: "提现",
      /** @type {number} 交易时间的时间戳 */
      date: 17100333e5,
      // 2024-03-10 09:15:00
      amount: -50
    }
  ],
  currentPage: 1,
  pageSize: 10,
  hasMore: false,
  // 是否还有更多数据可加载
  isLoading: false
};
exports.moneyState = moneyState;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/money/state.js.map
