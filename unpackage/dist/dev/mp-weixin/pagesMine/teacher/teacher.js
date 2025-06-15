"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const common_assets = require("../../common/assets.js");
const Header = () => "../../components/navigationTitleBar/header.js";
const LoadingAnimation = () => "../../components/loading/LoadingAnimation.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    Header,
    LoadingAnimation
  },
  data() {
    return {
      teacherId: null,
      activeTab: "services",
      isLoading: false,
      showServiceDetail: false,
      currentService: null,
      isIntroExpanded: false,
      introMaxLength: 100
      // 简介最大显示字数
    };
  },
  computed: Object.assign(Object.assign({}, common_vendor.mapState("user/match", ["matchList"])), {
    /**
     * @description 根据ID获取当前教师数据
     * @returns {Object} 教师详细信息
     */
    teacherData() {
      const teacher = this.matchList.find((t = null) => {
        return t.id === this.teacherId;
      });
      return teacher || new UTSJSONObject({
        id: null,
        name: "",
        avatar: "/static/image/defaultAvatar/teacher-man.png",
        school: "",
        major: "",
        certificate: 0,
        campusAmbassador: 0,
        selfIntroduction: "暂无数据",
        service: []
      });
    },
    /**
     * @description 获取老师的服务列表
     * @returns {Array} 服务列表
     */
    services() {
      return this.teacherData && Array.isArray(this.teacherData.service) ? this.teacherData.service : [];
    },
    /**
     * @description 获取显示的简介内容
     * @returns {String} 显示的简介内容
     */
    displayIntroduction() {
      const intro = this.teacherData.selfIntroduction || "这位老师很懒，还没有填写个人简介。";
      if (!this.isIntroExpanded && intro.length > this.introMaxLength) {
        return intro.substring(0, this.introMaxLength) + "...";
      }
      return intro;
    },
    /**
     * @description 是否应该显示展开/收起按钮
     * @returns {Boolean} 是否显示按钮
     */
    shouldShowToggleBtn() {
      const intro = this.teacherData.selfIntroduction || "";
      return intro.length > this.introMaxLength;
    }
  }),
  onLoad(options) {
    this.teacherId = options.id || "";
    if (!this.teacherId) {
      common_vendor.index.showToast({
        title: "未获取到教师ID",
        icon: "none"
      });
      return null;
    }
    this.isLoading = true;
    setTimeout(() => {
      const teacherIndex = this.matchList.findIndex((t = null) => {
        return t.id === this.teacherId;
      });
      if (teacherIndex === -1) {
        common_vendor.index.showToast({
          title: "未找到该教师信息",
          icon: "none"
        });
      }
      this.isLoading = false;
    }, 1e3);
  },
  methods: {
    /**
     * @description 返回上一页
     */
    handleBack() {
      router_Router.Navigator.redirectTo(router_Router.MatchRoutes.MATCH);
    },
    /**
     * @description 切换标签页
     * @param {String} tab - 标签名称
     */
    switchTab(tab = null) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
      }
    },
    /**
     * @description 切换个人简介的展开/收起状态
     */
    toggleIntroduction() {
      this.isIntroExpanded = !this.isIntroExpanded;
    },
    /**
     * @description 发起咨询
     */
    startConsultation() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        router_Router.Navigator.toChat(this.teacherId);
      }, 500);
    },
    /**
     * @description 跳转到服务详情页
     * @param {String} serviceId - 服务ID
     */
    goToServiceDetail(serviceId = null) {
      const services = Array.isArray(this.services) ? this.services : [];
      const service = UTS.arrayFind(services, (s = null) => {
        return s.id === serviceId;
      });
      if (service) {
        this.currentService = service;
        this.showServiceDetail = true;
      } else {
        common_vendor.index.showToast({
          title: "未找到服务信息",
          icon: "none"
        });
      }
    },
    /**
     * @description 关闭服务详情浮窗
     */
    closeServiceDetail() {
      this.showServiceDetail = false;
      this.currentService = null;
    }
  }
});
if (!Array) {
  const _component_Header = common_vendor.resolveComponent("Header");
  const _component_loading_animation = common_vendor.resolveComponent("loading-animation");
  (_component_Header + _component_loading_animation)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_assets._imports_1$2,
    c: common_vendor.o($options.handleBack),
    d: common_vendor.p({
      title: "导师详情"
    }),
    e: $data.isLoading
  }, $data.isLoading ? {
    f: common_vendor.p({
      src: "https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json",
      width: "150rpx",
      height: "150rpx",
      showText: true,
      text: "加载中..."
    })
  } : {}, {
    g: !$data.isLoading
  }, !$data.isLoading ? common_vendor.e({
    h: $options.teacherData.avatar || "/static/image/defaultAvatar/teacher-man.png",
    i: common_vendor.t($options.teacherData.name),
    j: $options.teacherData.certificate
  }, $options.teacherData.certificate ? {
    k: common_assets._imports_2$2
  } : {
    l: common_assets._imports_3$4
  }, {
    m: $options.teacherData.campusAmbassador
  }, $options.teacherData.campusAmbassador ? {
    n: common_assets._imports_4$1
  } : {}, {
    o: common_vendor.t($options.teacherData.school),
    p: common_vendor.t($options.teacherData.major),
    q: common_vendor.t($options.displayIntroduction),
    r: $options.shouldShowToggleBtn
  }, $options.shouldShowToggleBtn ? {
    s: common_vendor.t($data.isIntroExpanded ? "收起" : "展开"),
    t: common_vendor.o((...args) => $options.toggleIntroduction && $options.toggleIntroduction(...args))
  } : {}, {
    v: $data.activeTab === "services" ? 1 : "",
    w: common_vendor.o(($event) => $options.switchTab("services")),
    x: $data.activeTab === "services"
  }, $data.activeTab === "services" ? common_vendor.e({
    y: $options.teacherData.service && $options.teacherData.service.length > 0
  }, $options.teacherData.service && $options.teacherData.service.length > 0 ? {
    z: common_vendor.f($options.teacherData.service, (service, index, i0) => {
      return {
        a: service.image || "../static/teacher/test.png",
        b: common_vendor.t(service.name),
        c: common_vendor.t(service.price),
        d: common_vendor.t(service.description.length >= 40 ? service.description.slice(0, 40) + "..." : service.description),
        e: index,
        f: common_vendor.o(($event) => $options.goToServiceDetail(service.id), index)
      };
    })
  } : {}) : {}, {
    A: common_assets._imports_5,
    B: common_vendor.o((...args) => $options.startConsultation && $options.startConsultation(...args))
  }) : {}, {
    C: $data.showServiceDetail
  }, $data.showServiceDetail ? common_vendor.e({
    D: common_vendor.o((...args) => $options.closeServiceDetail && $options.closeServiceDetail(...args)),
    E: $data.currentService.image || "../static/teacher/test.png",
    F: common_vendor.t($data.currentService.name),
    G: common_vendor.t($data.currentService.price),
    H: common_vendor.t($data.currentService.type.typename),
    I: $data.currentService.type.typename === "一对一课程" || $data.currentService.type.typename === "一对多课程"
  }, $data.currentService.type.typename === "一对一课程" || $data.currentService.type.typename === "一对多课程" ? {} : {}, {
    J: $data.currentService.type.typename === "一对一课程" || $data.currentService.type.typename === "一对多课程"
  }, $data.currentService.type.typename === "一对一课程" || $data.currentService.type.typename === "一对多课程" ? {
    K: common_vendor.t($data.currentService.type.coursenum)
  } : {}, {
    L: $data.currentService.type.typename === "一对一课程" || $data.currentService.type.typename === "一对多课程"
  }, $data.currentService.type.typename === "一对一课程" || $data.currentService.type.typename === "一对多课程" ? {} : {}, {
    M: $data.currentService.type.typename === "一对一课程" || $data.currentService.type.typename === "一对多课程"
  }, $data.currentService.type.typename === "一对一课程" || $data.currentService.type.typename === "一对多课程" ? {
    N: common_vendor.t($data.currentService.type.fulllength.hours),
    O: common_vendor.t($data.currentService.type.fulllength.minutes)
  } : {}, {
    P: $data.currentService.type.typename === "一对多课程"
  }, $data.currentService.type.typename === "一对多课程" ? {} : {}, {
    Q: $data.currentService.type.typename === "一对多课程"
  }, $data.currentService.type.typename === "一对多课程" ? {
    R: common_vendor.t($data.currentService.type.studentnum)
  } : {}, {
    S: common_vendor.t($data.currentService.description)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesMine/teacher/teacher.js.map
