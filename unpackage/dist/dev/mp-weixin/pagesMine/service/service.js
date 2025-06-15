"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const common_assets = require("../../common/assets.js");
const Header = () => "../../components/navigationTitleBar/header.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    Header
  },
  data() {
    return {
      defaultCoverImage: "/static/image/service/default_cover.jpg",
      services: [],
      selectedService: null,
      isDetailExpanded: false,
      overlayVisible: false
    };
  },
  onShow() {
    if (getApp().globalData && getApp().globalData.newServiceAdded) {
      getApp().globalData.newServiceAdded = false;
      if (getApp().globalData.newService) {
        const newService = getApp().globalData.newService;
        if (newService.price && !newService.price.startsWith("¥")) {
          newService.price = "¥" + newService.price;
        }
        this.loadServices();
        const existingServiceIndex = this.services.findIndex((s) => {
          return s.id === newService.id;
        });
        if (existingServiceIndex === -1) {
          this.services.unshift(newService);
          this.saveServices();
        }
        this.selectedService = newService;
        common_vendor.index.showToast({
          title: "新服务已添加",
          icon: "success"
        });
        getApp().globalData.newService = null;
      } else {
        this.loadServices();
      }
    } else {
      this.loadServices();
    }
  },
  onLoad() {
    common_vendor.index.$on("serviceAdded", this.handleServiceAdded);
    common_vendor.index.$on("serviceEdited", this.handleServiceEdited);
    getApp().globalData = getApp().globalData || new UTSJSONObject({});
  },
  onUnload() {
    common_vendor.index.$off("serviceAdded", this.handleServiceAdded);
    common_vendor.index.$off("serviceEdited", this.handleServiceEdited);
  },
  methods: {
    goBack() {
      router_Router.Navigator.toMine();
    },
    toggleService(index = null) {
      this.services[index].checked = !this.services[index].checked;
    },
    editService(index = null) {
      try {
        common_vendor.index.showLoading({
          title: "加载中..."
        });
        const currentService = this.services[index];
        common_vendor.index.__f__("log", "at pagesMine/service/service.vue:171", "准备编辑服务:", currentService);
        getApp().globalData = getApp().globalData || new UTSJSONObject({});
        getApp().globalData.editingService = UTS.JSON.parse(UTS.JSON.stringify(currentService));
        setTimeout(() => {
          common_vendor.index.hideLoading();
          common_vendor.index.navigateTo({
            url: "./service_newbuilt?mode=edit&id=" + currentService.id,
            success: () => {
              common_vendor.index.__f__("log", "at pagesMine/service/service.vue:186", "跳转到编辑页面成功");
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pagesMine/service/service.vue:189", "跳转失败：", err);
              common_vendor.index.showToast({
                title: "跳转失败，请重试",
                icon: "none"
              });
            }
          });
        }, 500);
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pagesMine/service/service.vue:199", "编辑服务出错：", error);
        common_vendor.index.showToast({
          title: "操作失败，请重试",
          icon: "none"
        });
      }
    },
    deleteService(index = null) {
      const serviceToDeleteId = this.services[index].id;
      common_vendor.index.showModal(new UTSJSONObject({
        title: "确认删除",
        content: "确定要删除此服务吗？此操作无法撤销。",
        confirmText: "确认删除",
        confirmColor: "#ff4d4f",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            try {
              common_vendor.index.showLoading({
                title: "删除中..."
              });
              setTimeout(() => {
                common_vendor.index.hideLoading();
                if (this.selectedService && this.selectedService.id === serviceToDeleteId) {
                  this.isDetailExpanded = false;
                  this.overlayVisible = false;
                  this.selectedService = null;
                }
                this.services.splice(index, 1);
                this.saveServices();
                common_vendor.index.showToast({
                  title: "服务已删除",
                  icon: "success"
                });
              }, 500);
            } catch (error) {
              common_vendor.index.hideLoading();
              common_vendor.index.__f__("error", "at pagesMine/service/service.vue:252", "删除服务出错：", error);
              common_vendor.index.showToast({
                title: "删除失败，请重试",
                icon: "none"
              });
            }
          }
        }
      }));
    },
    handleAddService() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      if (getApp().globalData) {
        getApp().globalData.editingService = null;
      }
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.navigateTo({
          url: "./service_newbuilt",
          fail: (err) => {
            common_vendor.index.__f__("error", "at pagesMine/service/service.vue:283", "跳转失败：", err);
            common_vendor.index.showToast({
              title: "跳转失败，请重试",
              icon: "none"
            });
          }
        });
      }, 300);
    },
    // 处理新添加的服务
    handleServiceAdded(newService = null) {
      if (newService.price && !newService.price.startsWith("¥")) {
        newService.price = "¥" + newService.price;
      }
      const existingIndex = this.services.findIndex((service) => {
        return service.id === newService.id;
      });
      if (existingIndex !== -1) {
        this.services[existingIndex] = newService;
      } else {
        this.services.unshift(newService);
      }
      this.selectedService = newService;
      this.saveServices();
      common_vendor.index.showToast({
        title: "新服务已添加",
        icon: "success"
      });
    },
    // 处理编辑后的服务
    handleServiceEdited(editedService = null) {
      const index = this.services.findIndex((service) => {
        return service.id === editedService.id;
      });
      if (index !== -1) {
        this.services[index] = editedService;
        this.saveServices();
        common_vendor.index.showToast({
          title: "服务已修改",
          icon: "success"
        });
      }
    },
    // 保存服务列表到本地存储
    saveServices() {
      try {
        common_vendor.index.setStorageSync("services", UTS.JSON.stringify(this.services));
      } catch (e) {
        common_vendor.index.__f__("error", "at pagesMine/service/service.vue:345", "保存服务列表失败", e);
      }
    },
    // 从本地存储加载服务列表
    loadServices() {
      try {
        const servicesStr = common_vendor.index.getStorageSync("services");
        if (servicesStr) {
          const storedServices = UTS.JSON.parse(servicesStr);
          if (storedServices && storedServices.length > 0) {
            this.services = storedServices;
            this.selectedService = this.services[0];
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pagesMine/service/service.vue:362", "加载服务列表失败", e);
      }
    },
    showServiceDetail(index = null) {
      if (index >= 0 && index < this.services.length) {
        this.selectedService = this.services[index];
        this.overlayVisible = true;
        setTimeout(() => {
          this.isDetailExpanded = true;
        }, 20);
      }
    },
    hideServiceDetail() {
      this.isDetailExpanded = false;
      setTimeout(() => {
        this.overlayVisible = false;
      }, 300);
    },
    // 服务卡片中使用封面图片或默认图片
    getServiceCover(service = null) {
      return service.imageUrl || (service.imageUrls && service.imageUrls.length > 0 ? service.imageUrls[0] : this.defaultCoverImage);
    },
    updateExistingService(updatedService = null) {
      try {
        const servicesStr = common_vendor.index.getStorageSync("services");
        let services = [];
        if (servicesStr) {
          services = UTS.JSON.parse(servicesStr);
        }
        const index = services.findIndex((s) => {
          return s.id == this.serviceId;
        });
        if (index !== -1) {
          services[index] = updatedService;
        } else {
          services.push(updatedService);
        }
        common_vendor.index.setStorageSync("services", UTS.JSON.stringify(services));
        getApp().globalData = getApp().globalData || new UTSJSONObject({});
        getApp().globalData.serviceEdited = true;
        getApp().globalData.editedService = updatedService;
        this.$refs.loadingRef.hide();
        common_vendor.index.showToast({
          title: "更新成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack(new UTSJSONObject({
            delta: 1,
            success: () => {
              common_vendor.index.$emit("serviceEdited", updatedService);
            }
          }));
        }, 1500);
      } catch (e) {
        common_vendor.index.__f__("error", "at pagesMine/service/service.vue:439", "更新服务失败", e);
        this.$refs.loadingRef.hide();
        common_vendor.index.showToast({
          title: "更新失败，请重试",
          icon: "none"
        });
      }
    }
  }
});
if (!Array) {
  const _component_Header = common_vendor.resolveComponent("Header");
  _component_Header();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      title: "我的服务"
    }),
    c: $data.services.length === 0
  }, $data.services.length === 0 ? {} : {}, {
    d: common_vendor.f($data.services, (service, index, i0) => {
      return {
        a: `url(${$options.getServiceCover(service)})`,
        b: common_vendor.t(service.serviceName || service.name),
        c: common_vendor.t(service.price),
        d: common_vendor.o(($event) => $options.editService(index), service.id),
        e: common_vendor.o(($event) => $options.deleteService(index), service.id),
        f: common_vendor.o(() => {
        }, service.id),
        g: service.id,
        h: service.checked ? 1 : "",
        i: common_vendor.o(($event) => $options.showServiceDetail(index), service.id)
      };
    }),
    e: common_assets._imports_0$6,
    f: common_assets._imports_1$4,
    g: $data.selectedService
  }, $data.selectedService ? {
    h: common_vendor.o((...args) => $options.hideServiceDetail && $options.hideServiceDetail(...args)),
    i: `url(${$options.getServiceCover($data.selectedService)})`,
    j: common_vendor.t($data.selectedService.serviceName || $data.selectedService.name),
    k: common_vendor.t($data.selectedService.price),
    l: common_vendor.t($data.selectedService.description),
    m: $data.isDetailExpanded ? 1 : ""
  } : {}, {
    n: common_vendor.o((...args) => $options.handleAddService && $options.handleAddService(...args)),
    o: $data.overlayVisible
  }, $data.overlayVisible ? {
    p: common_vendor.o((...args) => $options.hideServiceDetail && $options.hideServiceDetail(...args))
  } : {}, {
    q: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesMine/service/service.js.map
