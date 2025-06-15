"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const Header = () => "../../components/navigationTitleBar/header.js";
const topNavbar = () => "../../components/top-navbar/top-navbar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    Header,
    topNavbar
  },
  data() {
    return {
      userRole: "student",
      userName: "",
      userData: new UTSJSONObject({}),
      isLoggedIn: false,
      // Tab栏配置
      currentTab: 0,
      tabs: ["待支付", "已支付", "已完成", "已取消"],
      // 老师tab配置
      teacherCurrentTab: 0,
      teacherTabs: ["待服务", "已完成", "已取消"],
      // 学生订单列表
      orders: [
        new UTSJSONObject({
          id: "1001",
          time: "2024-03-20 14:30",
          status: "待支付",
          title: "课程A - 一对一辅导",
          price: "299.00",
          teacherName: "张老师"
        }),
        new UTSJSONObject({
          id: "1002",
          time: "2024-03-19 10:15",
          status: "已完成",
          title: "课程B - 小组课程",
          price: "199.00",
          teacherName: "李老师"
        }),
        new UTSJSONObject({
          id: "1003",
          time: "2024-03-18 16:45",
          status: "已取消",
          title: "课程C - 专项训练",
          price: "399.00",
          teacherName: "王老师"
        })
      ],
      // 教师订单列表
      teacherOrders: [
        new UTSJSONObject({
          id: "2001",
          time: "2024-03-21 15:30",
          status: "待确认",
          title: "高数辅导 - 一对一",
          price: "350.00",
          studentName: "张三"
        }),
        new UTSJSONObject({
          id: "2002",
          time: "2024-03-20 09:00",
          status: "进行中",
          title: "英语口语 - 一对一",
          price: "280.00",
          studentName: "李四"
        }),
        new UTSJSONObject({
          id: "2003",
          time: "2024-03-15 16:30",
          status: "已完成",
          title: "物理辅导 - 一对一",
          price: "320.00",
          studentName: "王五"
        })
      ],
      // 弹窗控制
      showCancelModal: false,
      showPayModal: false,
      showDetailModal: false,
      showDeleteModal: false,
      showConfirmOrderModal: false,
      // 当前操作的订单
      currentOrder: null,
      // 微信支付相关
      wxPayUrl: "https://api.mch.weixin.qq.com/pay/unifiedorder",
      // 支付方式
      isPaymentDropdownOpen: false,
      selectedPayment: 0,
      paymentMethods: [
        new UTSJSONObject({
          name: "支付宝支付",
          icon: "支",
          type: "alipay"
        }),
        new UTSJSONObject({
          name: "微信支付",
          icon: "微",
          type: "wechat"
        }),
        new UTSJSONObject({
          name: "银行卡支付",
          icon: "卡",
          type: "bank"
        })
      ]
    };
  },
  computed: {
    /**
     * @description 根据用户角色返回不同的Tab标签
     */
    currentTabs() {
      return this.userRole === "teacher" ? this.teacherTabs : this.tabs;
    }
  },
  onLoad() {
  },
  onShow() {
    this.$nextTick(() => {
      this.loadUserData();
      const storedUserRole = common_vendor.index.getStorageSync("userRole");
      if (storedUserRole && storedUserRole !== this.userRole) {
        this.userRole = storedUserRole;
        this.loadOrderData();
      }
    });
  },
  methods: {
    /**
     * @description 处理导航栏标签变化
     * @param {Number} index 新的tab索引
     */
    onTabChange(index = null) {
      common_vendor.index.__f__("log", "at pagesMine/order/order_common.vue:478", "切换到标签:", index);
      if (this.userRole === "teacher") {
        this.teacherCurrentTab = index;
      } else {
        this.currentTab = index;
      }
      this.loadOrderData();
    },
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      const token = common_vendor.index.getStorageSync("token");
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (userInfo) {
          try {
            this.userData = typeof userInfo === "string" ? UTS.JSON.parse(userInfo) : userInfo;
            this.userName = this.userData.nickname || "用户";
            if (this.userData.role) {
              this.userRole = this.userData.role;
              common_vendor.index.setStorageSync("userRole", this.userData.role);
            }
          } catch (e) {
            common_vendor.index.__f__("error", "at pagesMine/order/order_common.vue:511", "解析用户信息失败:", e);
          }
        }
      } else {
        this.userData = new UTSJSONObject({});
        this.userName = "";
        this.userRole = "student";
      }
    },
    /**
     * @description 加载订单数据
     */
    loadOrderData() {
      common_vendor.index.__f__("log", "at pagesMine/order/order_common.vue:528", `加载${this.userRole}角色的订单数据`);
    },
    /**
     * @description 切换标签页 (兼容旧代码)
     * @param {Number} index 标签索引
     */
    switchTab(index = null) {
      this.onTabChange(index);
    },
    /**
     * @description 取消订单
     * @param {Object} order 订单对象
     */
    cancelOrder(order = null) {
      this.currentOrder = order;
      this.showCancelModal = true;
    },
    /**
     * @description 确认取消订单
     */
    confirmCancel() {
      common_vendor.index.showToast({
        title: "订单已取消",
        icon: "success"
      });
      this.showCancelModal = false;
    },
    /**
     * @description 支付订单
     * @param {Object} order 订单对象
     */
    payOrder(order = null) {
      this.currentOrder = order;
      this.showPayModal = true;
    },
    /**
     * @description 切换支付方式下拉菜单
     */
    togglePaymentDropdown() {
      this.isPaymentDropdownOpen = !this.isPaymentDropdownOpen;
    },
    /**
     * @description 选择支付方式
     * @param {Number} index 支付方式索引
     */
    selectPayment(index = null) {
      this.selectedPayment = index;
      setTimeout(() => {
        this.isPaymentDropdownOpen = false;
      }, 200);
    },
    /**
     * @description 确认支付
     */
    confirmPay() {
      common_vendor.index.showLoading({
        title: "跳转支付..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("log", "at pagesMine/order/order_common.vue:601", "调用微信支付接口，支付地址:", this.wxPayUrl);
        common_vendor.index.__f__("log", "at pagesMine/order/order_common.vue:602", "订单信息:", this.currentOrder);
        this.paySuccess();
      }, 1500);
    },
    // 支付成功
    paySuccess() {
      this.showPayModal = false;
      common_vendor.index.showToast({
        title: "支付成功",
        icon: "success"
      });
      this.loadOrders();
    },
    // 支付失败
    payFail(err = null) {
      this.showPayModal = false;
      common_vendor.index.showToast({
        title: "支付失败",
        icon: "none"
      });
      common_vendor.index.__f__("error", "at pagesMine/order/order_common.vue:652", "支付失败:", err);
    },
    /**
     * @description 查看订单详情
     * @param {Object} order 订单对象
     */
    viewDetail(order = null) {
      this.currentOrder = order;
      this.showDetailModal = true;
    },
    /**
     * @description 关闭详情弹窗
     */
    closeDetailModal() {
      this.showDetailModal = false;
      this.currentOrder = null;
    },
    /**
     * @description 删除订单
     * @param {Object} order 订单对象
     */
    deleteOrder(order = null) {
      this.currentOrder = order;
      this.showDeleteModal = true;
    },
    /**
     * @description 确认删除订单
     */
    confirmDelete() {
      common_vendor.index.showToast({
        title: "删除成功",
        icon: "success"
      });
      this.showDeleteModal = false;
    },
    /**
     * @description 跳转到评价页面
     * @param {Object} order 订单对象
     */
    goToAppraise(order = null) {
      router_Router.Navigator.toAppraise(order.id);
    },
    goBack() {
      router_Router.Navigator.toMine();
    },
    /**
     * @description 教师确认订单
     * @param {Object} order 订单对象
     */
    confirmOrder(order = null) {
      this.currentOrder = order;
      this.showConfirmOrderModal = true;
    },
    /**
     * @description 教师确认接受订单操作
     */
    confirmOrderAction() {
      common_vendor.index.showToast({
        title: "已接受订单",
        icon: "success"
      });
      this.showConfirmOrderModal = false;
    }
  }
});
if (!Array) {
  const _component_Header = common_vendor.resolveComponent("Header");
  const _easycom_top_navbar2 = common_vendor.resolveComponent("top-navbar");
  (_component_Header + _easycom_top_navbar2)();
}
const _easycom_top_navbar = () => "../../components/top-navbar/top-navbar.js";
if (!Math) {
  _easycom_top_navbar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g;
  return common_vendor.e({
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      title: "我的订单"
    }),
    c: $data.userRole === "student"
  }, $data.userRole === "student" ? {
    d: common_vendor.f($data.orders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.time),
        b: common_vendor.t(order.title),
        c: common_vendor.t(order.teacherName || "暂无"),
        d: common_vendor.t(order.price),
        e: common_vendor.o(($event) => $options.cancelOrder(order), index),
        f: common_vendor.o(($event) => $options.payOrder(order), index),
        g: index
      };
    }),
    e: $data.currentTab === 0
  } : {
    f: common_vendor.f($data.teacherOrders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.time),
        b: common_vendor.t(order.title),
        c: common_vendor.t(order.studentName),
        d: common_vendor.t(order.price),
        e: common_vendor.o(($event) => $options.confirmOrder(order), index),
        f: index
      };
    }),
    g: $data.teacherCurrentTab === 0
  }, {
    h: $data.userRole === "student"
  }, $data.userRole === "student" ? {
    i: common_vendor.f($data.orders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.time),
        b: common_vendor.t(order.title),
        c: common_vendor.t(order.teacherName || "暂无"),
        d: common_vendor.t(order.price),
        e: common_vendor.o(($event) => $options.goToAppraise(order), index),
        f: index
      };
    }),
    j: $data.currentTab === 1
  } : {
    k: common_vendor.f($data.teacherOrders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.time),
        b: common_vendor.t(order.title),
        c: common_vendor.t(order.studentName),
        d: common_vendor.t(order.price),
        e: common_vendor.o(($event) => $options.viewDetail(order), index),
        f: index
      };
    }),
    l: $data.teacherCurrentTab === 1
  }, {
    m: $data.userRole === "student"
  }, $data.userRole === "student" ? {
    n: common_vendor.f($data.orders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.time),
        b: common_vendor.t(order.title),
        c: common_vendor.t(order.teacherName || "暂无"),
        d: common_vendor.t(order.price),
        e: common_vendor.o(($event) => $options.viewDetail(order), index),
        f: index
      };
    }),
    o: $data.currentTab === 2
  } : {
    p: common_vendor.f($data.teacherOrders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.time),
        b: common_vendor.t(order.title),
        c: common_vendor.t(order.studentName),
        d: common_vendor.t(order.price),
        e: common_vendor.o(($event) => $options.deleteOrder(order), index),
        f: index
      };
    }),
    q: $data.teacherCurrentTab === 2
  }, {
    r: $data.userRole === "student"
  }, $data.userRole === "student" ? {
    s: common_vendor.f($data.orders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.time),
        b: common_vendor.t(order.title),
        c: common_vendor.t(order.teacherName || "暂无"),
        d: common_vendor.t(order.price),
        e: common_vendor.o(($event) => $options.deleteOrder(order), index),
        f: index
      };
    }),
    t: $data.currentTab === 3
  } : {}, {
    v: common_vendor.o($options.onTabChange),
    w: common_vendor.p({
      navHeight: 60,
      userRole: $data.userRole,
      customTabs: $data.userRole === "student" ? $data.tabs.map((tab) => ({
        name: tab
      })) : $data.teacherTabs.map((tab) => ({
        name: tab
      }))
    }),
    x: $data.showCancelModal
  }, $data.showCancelModal ? {
    y: common_vendor.o(($event) => $data.showCancelModal = false),
    z: common_vendor.o((...args) => $options.confirmCancel && $options.confirmCancel(...args))
  } : {}, {
    A: $data.showPayModal
  }, $data.showPayModal ? {
    B: common_vendor.t((_a = $data.currentOrder) == null ? void 0 : _a.price),
    C: common_vendor.o(($event) => $data.showPayModal = false),
    D: common_vendor.o((...args) => $options.confirmPay && $options.confirmPay(...args))
  } : {}, {
    E: $data.showDetailModal
  }, $data.showDetailModal ? common_vendor.e({
    F: common_vendor.t((_b = $data.currentOrder) == null ? void 0 : _b.time),
    G: common_vendor.t((_c = $data.currentOrder) == null ? void 0 : _c.title),
    H: common_vendor.t((_d = $data.currentOrder) == null ? void 0 : _d.price),
    I: common_vendor.t((_e = $data.currentOrder) == null ? void 0 : _e.status),
    J: $data.userRole === "teacher" && ((_f = $data.currentOrder) == null ? void 0 : _f.studentName)
  }, $data.userRole === "teacher" && ((_g = $data.currentOrder) == null ? void 0 : _g.studentName) ? {
    K: common_vendor.t($data.currentOrder.studentName)
  } : {}, {
    L: common_vendor.o((...args) => $options.closeDetailModal && $options.closeDetailModal(...args))
  }) : {}, {
    M: $data.showDeleteModal
  }, $data.showDeleteModal ? {
    N: common_vendor.o(($event) => $data.showDeleteModal = false),
    O: common_vendor.o((...args) => $options.confirmDelete && $options.confirmDelete(...args))
  } : {}, {
    P: $data.showConfirmOrderModal
  }, $data.showConfirmOrderModal ? {
    Q: common_vendor.o(($event) => $data.showConfirmOrderModal = false),
    R: common_vendor.o((...args) => $options.confirmOrderAction && $options.confirmOrderAction(...args))
  } : {}, {
    S: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesMine/order/order_common.js.map
