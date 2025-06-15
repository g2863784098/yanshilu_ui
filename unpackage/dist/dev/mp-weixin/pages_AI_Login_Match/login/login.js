"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  methods: {
    /**
     * 选择用户身份并更新到Vuex中
     * @param {string} identity - 用户身份类型 ('student'或'teacher')
     */
    selectIdentity(identity = null) {
      common_vendor.index.__f__("log", "at pages_AI_Login_Match/login/login.vue:94", "选中的身份是:", identity);
      try {
        store_index.store.commit("user/baseInfo/updateRole", identity);
        router_Router.Navigator.toLoginDetail();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages_AI_Login_Match/login/login.vue:104", "选择身份时出错:", error);
        common_vendor.index.showToast({
          title: "系统错误，请重试",
          icon: "none"
        });
      }
    },
    /**
     * 返回到微信登录页面
     * @returns {void}
     */
    goBack() {
      router_Router.Navigator.toWechatLogin();
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: common_assets._imports_1$2,
    c: common_assets._imports_0$3,
    d: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    e: common_assets._imports_3$2,
    f: common_vendor.o(($event) => $options.selectIdentity("student")),
    g: common_assets._imports_4,
    h: common_vendor.o(($event) => $options.selectIdentity("teacher"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a040efd6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_AI_Login_Match/login/login.js.map
