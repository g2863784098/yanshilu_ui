"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const store_index = require("../../store/index.js");
const common_assets = require("../../common/assets.js");
const TabBar = () => "../../components/tab-bar/tab-bar.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    TabBar
  },
  data() {
    return {
      userData: new UTSJSONObject({}),
      isLoggedIn: store_index.store.getters["user/baseInfo/id"] !== "",
      isLoading: false,
      isDebug: true
      // 显示调试信息
    };
  },
  computed: Object.assign({}, common_vendor.mapState("user/baseInfo", {
    storeId: (state = null) => {
      return state.id;
    },
    storeAvatar: (state = null) => {
      return state.avatar;
    },
    storeName: (state = null) => {
      return state.name;
    },
    storeGender: (state = null) => {
      return state.gender;
    },
    storeRole: (state = null) => {
      var _a;
      return ((_a = state.userInfo) === null || _a === void 0 ? null : _a.role) || "学生";
    },
    storeCertificate: (state = null) => {
      var _a;
      return ((_a = state.userInfo) === null || _a === void 0 ? null : _a.certificate) || 0;
    },
    storeCampusAmbassador: (state = null) => {
      return state.campusAmbassador;
    }
  })),
  onLoad() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:128", "mine_common.vue onLoad开始执行");
      try {
        yield this.$nextTick();
        this.initFromStore();
        yield this.loadUserData();
        common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:139", "mine_common.vue onLoad执行完成，userData:", UTS.JSON.stringify(this.userData));
        common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:140", "store中的name值:", this.storeName);
      } catch (error) {
        common_vendor.index.__f__("error", "at pagesMine/mine/mine_common.vue:142", "onLoad错误:", error);
      }
    });
  },
  onShow() {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:147", "mine_common.vue onShow开始执行");
      try {
        yield this.$nextTick();
        common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:153", "onShow检查store数据:", new UTSJSONObject({
          storeName: this.storeName,
          storeAvatar: this.storeAvatar
        }));
        this.initFromStore();
        const storedUserRole = common_vendor.index.getStorageSync("userRole");
        if (storedUserRole) {
          yield this.updateUserRole(storedUserRole);
        }
        if (!this.userData.name && !this.storeName) {
          common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:169", "用户数据为空，尝试重新加载");
          yield this.loadUserData();
        }
        common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:173", "mine_common.vue onShow执行完成，userData:", UTS.JSON.stringify(this.userData));
      } catch (error) {
        common_vendor.index.__f__("error", "at pagesMine/mine/mine_common.vue:175", "onShow错误:", error);
      }
    });
  },
  methods: {
    /**
     * @description 从store初始化数据
     */
    initFromStore() {
      common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:184", "initFromStore - 从store直接获取数据");
      common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:185", "store中的数据:", new UTSJSONObject({
        id: this.storeId,
        name: this.storeName,
        avatar: this.storeAvatar,
        role: this.storeRole
      }));
      if (this.storeName) {
        this.userData = new UTSJSONObject({
          id: this.storeId,
          avatar: this.storeAvatar,
          name: this.storeName,
          gender: this.storeGender
        });
        this.isLoggedIn = true;
        common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:201", "从store初始化userData成功:", this.userData);
      } else {
        common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:203", "store中没有用户数据");
      }
    },
    /**
     * @description 更新用户角色
     * @param {string} role - 用户角色
     */
    updateUserRole(role = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:213", "更新用户角色:", role);
          if (this.$store) {
            yield this.$store.dispatch("user/baseInfo/updateRole", role);
            common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:217", "角色更新成功, 新角色:", this.storeRole);
          } else {
            common_vendor.index.__f__("warn", "at pagesMine/mine/mine_common.vue:219", "$store不可用，直接使用本地存储");
            common_vendor.index.setStorageSync("userRole", role);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pagesMine/mine/mine_common.vue:223", "更新用户角色失败", error);
          common_vendor.index.setStorageSync("userRole", role);
        }
      });
    },
    /**
     * @description 加载用户数据
     */
    loadUserData() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:233", "loadUserData 开始执行");
        this.isLoading = true;
        try {
          if (this.$store) {
            common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:238", "使用Vuex获取用户数据");
            const result = yield this.$store.dispatch("user/baseInfo/getUserInfo");
            common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:242", "getUserInfo返回结果:", result);
            common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:245", "store中的数据是否更新:", new UTSJSONObject({
              storeName: this.storeName
            }));
            this.initFromStore();
            if (!this.userData.name && result) {
              common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:254", "使用API返回的结果更新userData");
              this.userData = new UTSJSONObject({
                id: result.id || "",
                avatar: result.avatar || "",
                name: result.name || result.nickname || "",
                gender: result.gender || ""
              });
              this.isLoggedIn = !!this.userData.name;
              common_vendor.index.setStorageSync("userData", UTS.JSON.stringify(this.userData));
              common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:265", "更新userData成功:", this.userData);
            } else if (!this.userData.name) {
              common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:267", "尝试从本地存储恢复数据");
              this.recoverFromLocalStorage();
            }
          } else {
            common_vendor.index.__f__("warn", "at pagesMine/mine/mine_common.vue:271", "$store不可用，从本地存储加载");
            this.recoverFromLocalStorage();
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pagesMine/mine/mine_common.vue:275", "加载用户数据失败", error);
          this.recoverFromLocalStorage();
        } finally {
          this.isLoading = false;
          common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:279", "loadUserData 执行完成, userData:", this.userData);
        }
      });
    },
    /**
     * @description 从本地存储恢复数据
     */
    recoverFromLocalStorage() {
      common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:287", "从本地存储恢复数据");
      const localUserData = common_vendor.index.getStorageSync("userData");
      if (localUserData) {
        try {
          const parsedData = UTS.JSON.parse(localUserData);
          this.userData = new UTSJSONObject({
            id: parsedData.id || "",
            avatar: parsedData.avatar || "",
            name: parsedData.name || "",
            gender: parsedData.gender || ""
          });
          this.isLoggedIn = !!this.userData.name;
          common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:299", "从userData恢复成功:", this.userData);
        } catch (e) {
          common_vendor.index.__f__("error", "at pagesMine/mine/mine_common.vue:301", "解析本地用户数据失败", e);
        }
      }
      if (!this.userData.name) {
        const baseInfo = common_vendor.index.getStorageSync("userBaseInfo");
        if (baseInfo) {
          try {
            const parsedInfo = UTS.JSON.parse(baseInfo);
            this.userData = new UTSJSONObject({
              id: parsedInfo.id || "",
              avatar: parsedInfo.avatar || "",
              name: parsedInfo.name || "",
              gender: parsedInfo.gender || ""
            });
            this.isLoggedIn = !!this.userData.name;
            common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:318", "从userBaseInfo恢复成功:", this.userData);
          } catch (e) {
            common_vendor.index.__f__("error", "at pagesMine/mine/mine_common.vue:320", "解析userBaseInfo失败", e);
          }
        } else {
          common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:323", "本地存储中没有用户数据");
        }
      }
    },
    /**
     * @description 处理头像点击
     */
    handleClick() {
      if (!this.isLoggedIn) {
        router_Router.Navigator.toWechatLogin();
      }
    },
    /**
     * @description 页面跳转方法
     * @param {string} url - 目标页面路径
     */
    navigateTo(url = null) {
      router_Router.Navigator.navigateTo(url);
    },
    /**
     * @description 跳转到订单列表页面
     */
    toOrderCommon() {
      router_Router.Navigator.toOrderCommon();
    },
    /**
     * @description 跳转到课程列表页面
     */
    toCourse() {
      router_Router.Navigator.toCourse();
    },
    /**
     * @description 跳转到资质认证页面
     */
    toQualification() {
      router_Router.Navigator.toQualification();
    },
    /**
     * @description 跳转到钱包页面
     */
    toBill() {
      router_Router.Navigator.toBill();
    },
    /**
     * @description 跳转到设置页面
     */
    toSettings() {
      router_Router.Navigator.toSettings();
    },
    toService() {
      router_Router.Navigator.toService();
    },
    /**
     * @description 处理联系我们
     */
    handleContactUs() {
      router_Router.Navigator.toChat(1);
    },
    getPhoneNumber: function(getPhoneNumberRes = null) {
      common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:391", "getPhoneNumberRes", getPhoneNumberRes);
      if (getPhoneNumberRes.detail.errMsg.includes("deny")) {
        common_vendor.wx$1.showModal(new UTSJSONObject({
          title: "提示",
          content: "授权失败，请重试"
        }));
        return null;
      }
      const _a = getPhoneNumberRes.detail, encryptedData = _a.encryptedData, iv = _a.iv;
      common_vendor.wx$1.login({
        success: (e = null) => {
          const code = e.code;
          var params = new UTSJSONObject({
            code,
            encryptedData,
            iv,
            avatar: "/profile/upload/2025/06/13/teacher-man_20250613211450A004.png",
            nickname: "师门43763"
          });
          debugger;
          common_vendor.index.request({
            url: "http://localhost:8080/phoneRegister",
            method: "POST",
            // header: {
            //   'Authorization': `Bearer ${this.token}`,
            //   'Content-Type': 'application/json'
            // },
            data: params,
            success: (res) => {
              common_vendor.index.__f__("log", "at pagesMine/mine/mine_common.vue:429", "res", res);
              debugger;
              common_vendor.index.hideLoading();
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pagesMine/mine/mine_common.vue:436", "用户信息提交失败", err);
            }
          });
        }
      });
    }
  }
});
if (!Array) {
  const _component_TabBar = common_vendor.resolveComponent("TabBar");
  _component_TabBar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$4,
    b: _ctx.storeCampusAmbassador && _ctx.storeRole === "老师"
  }, _ctx.storeCampusAmbassador && _ctx.storeRole === "老师" ? {
    c: common_assets._imports_1$3
  } : {}, {
    d: $data.userData.avatar || _ctx.storeAvatar || "/static/image/defaultAvatar/teacher-man.png",
    e: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args)),
    f: common_vendor.t($data.userData.name || _ctx.storeName || "登录"),
    g: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args)),
    h: _ctx.storeRole === "老师"
  }, _ctx.storeRole === "老师" ? {
    i: common_assets._imports_2$3
  } : {}, {
    j: _ctx.storeRole === "学生"
  }, _ctx.storeRole === "学生" ? {
    k: common_assets._imports_3$5
  } : {}, {
    l: _ctx.storeCertificate === 1 && _ctx.storeRole === "老师"
  }, _ctx.storeCertificate === 1 && _ctx.storeRole === "老师" ? {
    m: common_assets._imports_2$2
  } : {}, {
    n: _ctx.storeCertificate === 0 && _ctx.storeRole === "老师"
  }, _ctx.storeCertificate === 0 && _ctx.storeRole === "老师" ? {
    o: common_assets._imports_3$4
  } : {}, {
    p: common_assets._imports_6,
    q: common_vendor.o((...args) => $options.toOrderCommon && $options.toOrderCommon(...args)),
    r: common_assets._imports_7,
    s: common_vendor.o((...args) => $options.toCourse && $options.toCourse(...args)),
    t: common_assets._imports_8,
    v: common_vendor.o((...args) => $options.toBill && $options.toBill(...args)),
    w: common_assets._imports_9,
    x: common_vendor.o((...args) => $options.handleContactUs && $options.handleContactUs(...args)),
    y: common_assets._imports_10,
    z: common_vendor.o((...args) => $options.getPhoneNumber && $options.getPhoneNumber(...args)),
    A: common_assets._imports_11,
    B: _ctx.storeRole === "老师"
  }, _ctx.storeRole === "老师" ? {
    C: common_assets._imports_12,
    D: common_assets._imports_11,
    E: common_vendor.o((...args) => $options.toService && $options.toService(...args))
  } : {}, {
    F: _ctx.storeRole === "老师" && _ctx.storeCertificate === 0
  }, _ctx.storeRole === "老师" && _ctx.storeCertificate === 0 ? {
    G: common_assets._imports_13,
    H: common_assets._imports_11,
    I: common_vendor.o((...args) => $options.toQualification && $options.toQualification(...args))
  } : {}, {
    J: common_assets._imports_10,
    K: common_assets._imports_11,
    L: common_vendor.o((...args) => $options.toSettings && $options.toSettings(...args)),
    M: common_vendor.p({
      pageName: "mine"
    }),
    N: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesMine/mine/mine_common.js.map
