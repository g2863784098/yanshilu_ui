"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const ChoiceSelected = () => "../components/combobox/combobox.js";
const Header = () => "../../components/navigationTitleBar/header.js";
const _sfc_main = common_vendor.defineComponent({
  components: {
    "choice-selected": ChoiceSelected,
    Header
  },
  data() {
    return {
      hasEdited: false,
      mode: "add",
      serviceId: "",
      coverUrls: [],
      avatarUrl: "",
      selectedServiceType: "",
      selectedServiceTypeIndex: -1,
      serviceTypes: [
        "一对一课程",
        "一对多课程",
        "学习资料"
      ],
      coursequantity: "",
      showServiceTypeDropdown: false,
      duration: "",
      description: "",
      price: "",
      files: [],
      showDuration: false,
      showAttachment: false,
      originalService: null,
      // 一对一课程相关数据
      serviceName: "",
      selectedHoursIndex: -1,
      hourOptions: ["1", "2", "4", "6", "8", "10", "12", "24", "48", "60", "120"],
      selectedMinutesIndex: -1,
      minuteOptions: ["0", "15", "30", "45"],
      // 一对多课程相关数据
      selectedMultiHoursIndex: -1,
      selectedMultiMinutesIndex: -1,
      multiServiceName: "",
      selectedPersonCountIndex: -1,
      personCountOptions: ["2", "4", "6", "8", "10", "15", "20", "30"],
      // 状态栏高度
      statusBarHeight: 0
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:206", "===============================");
    common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:207", "service_newbuilt onLoad:", options);
    this.setStatusBarHeight();
    if (options && options.mode) {
      this.mode = options.mode;
      common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:215", "当前模式:", this.mode);
      if (options.mode === "edit" && options.id) {
        this.serviceId = options.id;
        common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:220", "编辑服务ID:", this.serviceId);
        if (getApp().globalData && getApp().globalData.editingService) {
          common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:224", "全局状态中存在编辑服务数据:", getApp().globalData.editingService);
        } else {
          common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:226", "全局状态中不存在编辑服务数据");
        }
        this.loadEditingService();
      }
    } else {
      common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:233", "未检测到模式参数，默认为新建模式");
      this.mode = "add";
    }
    this.updateFormFields();
    common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:239", "===============================");
  },
  onUnload() {
    common_vendor.index.$off("serviceEdited", this.handleServiceEdited);
    if (getApp().globalData) {
      getApp().globalData.editingService = null;
    }
  },
  methods: {
    // 设置状态栏高度
    setStatusBarHeight() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight;
      if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.style.setProperty("--status-bar-height", `${this.statusBarHeight}px`);
      }
    },
    chooseAvatar() {
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.avatarUrl = res.tempFilePaths[0];
        }
      }));
    },
    chooseCover() {
      const remainCount = 9 - this.coverUrls.length;
      if (remainCount <= 0) {
        common_vendor.index.showToast({
          title: "最多只能上传9张图片",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: remainCount,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.coverUrls = [...this.coverUrls, ...res.tempFilePaths];
          this.hasEdited = true;
        }
      }));
    },
    deleteCover(index = null) {
      this.coverUrls.splice(index, 1);
      this.hasEdited = true;
    },
    loadEditingService() {
      try {
        common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:300", "开始加载编辑服务数据...");
        common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:301", "服务ID:", this.serviceId);
        if (getApp().globalData && getApp().globalData.editingService) {
          const editingService = getApp().globalData.editingService;
          common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:306", "从全局数据获取到编辑服务:", editingService);
          if (editingService.id.toString() === this.serviceId.toString()) {
            common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:310", "ID匹配，使用全局数据");
            this.originalService = editingService;
            this.fillFormWithServiceData(this.originalService);
            common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:315", "表单填充完成");
            return null;
          } else {
            common_vendor.index.__f__("warn", "at pagesMine/service/service_newbuilt.vue:318", "全局数据中的服务ID不匹配");
          }
        } else {
          common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:321", "全局数据中不存在编辑服务数据");
        }
        const servicesStr = common_vendor.index.getStorageSync("services");
        if (servicesStr) {
          const services = UTS.JSON.parse(servicesStr);
          common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:328", "从本地存储获取到服务列表，共", services.length, "条记录");
          const service = services.find((s = null) => {
            return s.id.toString() === this.serviceId.toString();
          });
          if (service) {
            common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:333", "在本地存储中找到匹配的服务:", service);
            this.originalService = service;
            this.fillFormWithServiceData(service);
            common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:338", "表单填充完成");
          } else {
            common_vendor.index.__f__("error", "at pagesMine/service/service_newbuilt.vue:340", "在本地存储中找不到匹配的服务");
            common_vendor.index.showToast({
              title: "找不到服务数据",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          }
        } else {
          common_vendor.index.__f__("error", "at pagesMine/service/service_newbuilt.vue:352", "本地存储中不存在服务数据");
          common_vendor.index.showToast({
            title: "找不到服务数据",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pagesMine/service/service_newbuilt.vue:364", "加载服务数据失败:", error);
        common_vendor.index.showToast({
          title: "加载数据失败",
          icon: "none"
        });
      }
    },
    fillFormWithServiceData(serviceData = null) {
      this.coverUrls = serviceData.imageUrls || (serviceData.imageUrl ? [serviceData.imageUrl] : []);
      if (serviceData.type && serviceData.type.typename) {
        this.selectedServiceType = serviceData.type.typename;
        this.selectedServiceTypeIndex = this.serviceTypes.findIndex((type) => {
          return type === serviceData.type.typename;
        });
      } else {
        this.selectedServiceType = serviceData.name || "";
        this.selectedServiceTypeIndex = this.serviceTypes.findIndex((type) => {
          return type === serviceData.name;
        });
      }
      this.price = serviceData.price ? serviceData.price.replace(/[¥￥]/g, "") : "";
      this.description = serviceData.description || "";
      if (this.selectedServiceType === "一对一课程") {
        this.serviceName = serviceData.serviceName || serviceData.name || "";
        if (serviceData.totalDuration) {
          const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/);
          if (match) {
            this.selectedHoursIndex = this.hourOptions.findIndex((h) => {
              return h === match[1];
            });
            this.selectedMinutesIndex = this.minuteOptions.findIndex((m) => {
              return m === match[2];
            });
          }
        } else if (serviceData.type && serviceData.type.fulllength) {
          const hours = serviceData.type.fulllength.hours || "";
          const minutes = serviceData.type.fulllength.minutes || "";
          const hoursMatch = hours.match(/(\d+)/);
          const minutesMatch = minutes.match(/(\d+)/);
          if (hoursMatch) {
            this.selectedHoursIndex = this.hourOptions.findIndex((h) => {
              return h === hoursMatch[1];
            });
          }
          if (minutesMatch) {
            this.selectedMinutesIndex = this.minuteOptions.findIndex((m) => {
              return m === minutesMatch[1];
            });
          }
        }
      } else if (this.selectedServiceType === "一对多课程") {
        this.multiServiceName = serviceData.serviceName || serviceData.name || "";
        if (serviceData.totalDuration) {
          const match = serviceData.totalDuration.match(/(\d+)小时(\d+)分钟/);
          if (match) {
            this.selectedMultiHoursIndex = this.hourOptions.findIndex((h) => {
              return h === match[1];
            });
            this.selectedMultiMinutesIndex = this.minuteOptions.findIndex((m) => {
              return m === match[2];
            });
          }
        } else if (serviceData.type && serviceData.type.fulllength) {
          const hours = serviceData.type.fulllength.hours || "";
          const minutes = serviceData.type.fulllength.minutes || "";
          const hoursMatch = hours.match(/(\d+)/);
          const minutesMatch = minutes.match(/(\d+)/);
          if (hoursMatch) {
            this.selectedMultiHoursIndex = this.hourOptions.findIndex((h) => {
              return h === hoursMatch[1];
            });
          }
          if (minutesMatch) {
            this.selectedMultiMinutesIndex = this.minuteOptions.findIndex((m) => {
              return m === minutesMatch[1];
            });
          }
        }
        if (serviceData.personCount) {
          this.selectedPersonCountIndex = this.personCountOptions.findIndex((p) => {
            return p === serviceData.personCount.toString();
          });
        } else if (serviceData.type && serviceData.type.studentnum) {
          this.selectedPersonCountIndex = this.personCountOptions.findIndex((p) => {
            return parseInt(p) === serviceData.type.studentnum;
          });
        }
      } else if (this.selectedServiceType === "学习资料") {
        this.coursequantity = serviceData.coursequantity || serviceData.name || "";
      }
      this.updateFormFields();
    },
    goBack() {
      if (this.hasEdited) {
        common_vendor.index.showModal(new UTSJSONObject({
          title: "提示",
          content: "是否保存已编辑的内容？",
          cancelText: "不保存",
          confirmText: "保存",
          success: (res) => {
            if (res.confirm) {
              this.submitForm();
            } else {
              router_Router.Navigator.toService();
            }
          }
        }));
      } else {
        router_Router.Navigator.toService();
      }
    },
    handleServiceTypeSelect(index = null) {
      this.selectedServiceTypeIndex = index;
      this.selectedServiceType = this.serviceTypes[index];
      if (this.selectedServiceType === "一对一课程") {
        this.selectedHoursIndex = -1;
        this.selectedMinutesIndex = -1;
        this.serviceName = "";
      } else if (this.selectedServiceType === "一对多课程") {
        this.selectedMultiHoursIndex = -1;
        this.selectedMultiMinutesIndex = -1;
        this.multiServiceName = "";
        this.selectedPersonCountIndex = -1;
      } else if (this.selectedServiceType === "学习资料") {
        this.coursequantity = "";
      }
      this.updateFormFields();
      this.hasEdited = true;
    },
    handleHoursSelect(index = null) {
      this.selectedHoursIndex = index;
      this.hasEdited = true;
    },
    handleMinutesSelect(index = null) {
      this.selectedMinutesIndex = index;
      this.hasEdited = true;
    },
    handleMultiHoursSelect(index = null) {
      this.selectedMultiHoursIndex = index;
      this.hasEdited = true;
    },
    handleMultiMinutesSelect(index = null) {
      this.selectedMultiMinutesIndex = index;
      this.hasEdited = true;
    },
    handlePersonCountSelect(index = null) {
      this.selectedPersonCountIndex = index;
      this.hasEdited = true;
    },
    updateFormFields() {
      if (this.selectedServiceType === "学习资料") {
        this.showDuration = false;
        this.showAttachment = true;
      } else {
        this.showDuration = true;
        this.showAttachment = this.selectedServiceType === "学习资料";
      }
    },
    chooseFile() {
      common_vendor.index.chooseImage(new UTSJSONObject({
        count: 1,
        success: (res) => {
          this.files = res.tempFilePaths;
          this.hasEdited = true;
        }
      }));
    },
    submitForm() {
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      if (this.coverUrls.length === 0) {
        common_vendor.index.showToast({
          title: "请上传封面图片",
          icon: "none"
        });
        common_vendor.index.hideLoading();
        return null;
      }
      if (!this.selectedServiceType) {
        common_vendor.index.showToast({
          title: "请选择服务类型",
          icon: "none"
        });
        common_vendor.index.hideLoading();
        return null;
      }
      if (this.selectedServiceType === "一对一课程") {
        if (this.selectedHoursIndex === -1 || this.selectedMinutesIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择课程时长",
            icon: "none"
          });
          common_vendor.index.hideLoading();
          return null;
        }
        if (!this.serviceName) {
          common_vendor.index.showToast({
            title: "请填写服务名称",
            icon: "none"
          });
          common_vendor.index.hideLoading();
          return null;
        }
      } else if (this.selectedServiceType === "一对多课程") {
        if (this.selectedMultiHoursIndex === -1 || this.selectedMultiMinutesIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择课程时长",
            icon: "none"
          });
          common_vendor.index.hideLoading();
          return null;
        }
        if (!this.multiServiceName) {
          common_vendor.index.showToast({
            title: "请填写服务名称",
            icon: "none"
          });
          common_vendor.index.hideLoading();
          return null;
        }
        if (this.selectedPersonCountIndex === -1) {
          common_vendor.index.showToast({
            title: "请选择课程人数",
            icon: "none"
          });
          common_vendor.index.hideLoading();
          return null;
        }
      } else if (this.selectedServiceType === "学习资料") {
        if (!this.coursequantity) {
          common_vendor.index.showToast({
            title: "请填写服务名称",
            icon: "none"
          });
          common_vendor.index.hideLoading();
          return null;
        }
      }
      if (!this.price) {
        common_vendor.index.showToast({
          title: "请填写服务价格",
          icon: "none"
        });
        common_vendor.index.hideLoading();
        return null;
      }
      let serviceData = new UTSJSONObject(
        {}
        // 编辑模式下保留原始服务的部分信息
      );
      if (this.mode === "edit" && this.originalService) {
        serviceData = new UTSJSONObject(Object.assign(Object.assign({}, this.originalService), {
          // 这些字段将被覆盖
          name: this.selectedServiceType,
          price: this.price.startsWith("¥") ? this.price : "¥" + this.price,
          description: this.description || `这是一个${this.selectedServiceType}服务`,
          imageUrls: this.coverUrls,
          imageUrl: this.coverUrls[0] || ""
        }));
      } else {
        serviceData = new UTSJSONObject({
          id: Date.now().toString(),
          name: this.selectedServiceType,
          price: this.price.startsWith("¥") ? this.price : "¥" + this.price,
          description: this.description || `这是一个${this.selectedServiceType}服务`,
          checked: false,
          imageUrls: this.coverUrls,
          imageUrl: this.coverUrls[0] || "",
          createTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          updateTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          status: "active"
        });
      }
      if (this.selectedServiceType === "一对一课程") {
        serviceData.serviceName = this.serviceName;
        serviceData.totalDuration = `${this.hourOptions[this.selectedHoursIndex]}小时${this.minuteOptions[this.selectedMinutesIndex]}分钟`;
        serviceData.type = new UTSJSONObject({
          typename: "一对一课程",
          fulllength: new UTSJSONObject({
            hours: `${this.hourOptions[this.selectedHoursIndex]}小时`,
            minutes: `${this.minuteOptions[this.selectedMinutesIndex]}分钟`
          })
        });
      } else if (this.selectedServiceType === "一对多课程") {
        serviceData.serviceName = this.multiServiceName;
        serviceData.totalDuration = `${this.hourOptions[this.selectedMultiHoursIndex]}小时${this.minuteOptions[this.selectedMultiMinutesIndex]}分钟`;
        serviceData.personCount = this.personCountOptions[this.selectedPersonCountIndex];
        serviceData.type = new UTSJSONObject({
          typename: "一对多课程",
          fulllength: new UTSJSONObject({
            hours: `${this.hourOptions[this.selectedMultiHoursIndex]}小时`,
            minutes: `${this.minuteOptions[this.selectedMultiMinutesIndex]}分钟`
          }),
          studentnum: parseInt(this.personCountOptions[this.selectedPersonCountIndex])
        });
      } else if (this.selectedServiceType === "学习资料") {
        serviceData.coursequantity = this.coursequantity;
        serviceData.serviceName = this.coursequantity;
        serviceData.type = new UTSJSONObject({
          typename: "学习资料",
          fileLink: "https://www.baidu.com"
          // 示例链接，实际应该由用户上传文件后获取
        });
      }
      serviceData.updateTime = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      if (this.mode === "edit") {
        this.updateExistingService(serviceData);
      } else {
        this.addNewService(serviceData);
      }
    },
    addNewService(newService = null) {
      try {
        const servicesStr = common_vendor.index.getStorageSync("services");
        let services = [];
        if (servicesStr) {
          services = UTS.JSON.parse(servicesStr);
        }
        const existingIndex = services.findIndex((s) => {
          return s.id === newService.id;
        });
        if (existingIndex !== -1) {
          services[existingIndex] = newService;
        } else {
          services.push(newService);
        }
        common_vendor.index.setStorageSync("services", UTS.JSON.stringify(services));
        getApp().globalData = getApp().globalData || new UTSJSONObject({});
        getApp().globalData.newServiceAdded = true;
        getApp().globalData.newService = newService;
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success"
        });
        this.hasEdited = false;
        setTimeout(() => {
          router_Router.Navigator.toService();
        }, 1500);
      } catch (e) {
        common_vendor.index.__f__("error", "at pagesMine/service/service_newbuilt.vue:769", "保存服务失败", e);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存失败，请重试",
          icon: "none"
        });
      }
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
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "更新成功",
          icon: "success"
        });
        this.hasEdited = false;
        setTimeout(() => {
          router_Router.Navigator.toService();
        }, 1500);
      } catch (e) {
        common_vendor.index.__f__("error", "at pagesMine/service/service_newbuilt.vue:821", "更新服务失败", e);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "更新失败，请重试",
          icon: "none"
        });
      }
    },
    handleServiceEdited(service = null) {
      common_vendor.index.__f__("log", "at pagesMine/service/service_newbuilt.vue:830", "Service edited", service);
    },
    trackChanges() {
      this.hasEdited = true;
    }
  },
  computed: {
    serviceNameModel: new UTSJSONObject({
      get() {
        return this.selectedServiceType === "一对多课程" ? this.multiServiceName : this.serviceName;
      },
      set(value = null) {
        if (this.selectedServiceType === "一对多课程") {
          this.multiServiceName = value;
        } else {
          this.serviceName = value;
        }
        this.trackChanges();
      }
    })
  }
});
if (!Array) {
  const _component_Header = common_vendor.resolveComponent("Header");
  const _easycom_choice_selected2 = common_vendor.resolveComponent("choice-selected");
  (_component_Header + _easycom_choice_selected2)();
}
const _easycom_choice_selected = () => "../components/combobox/combobox.js";
if (!Math) {
  _easycom_choice_selected();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      title: $data.mode === "edit" ? "修改信息" : "新建服务"
    }),
    c: $options.serviceNameModel,
    d: common_vendor.o(($event) => $options.serviceNameModel = $event.detail.value),
    e: common_vendor.o($options.handleServiceTypeSelect),
    f: common_vendor.p({
      choiceIndex: $data.selectedServiceTypeIndex,
      choiceList: $data.serviceTypes,
      defaultText: "请选择服务类型"
    }),
    g: common_vendor.o((index) => $data.selectedServiceType === "一对多课程" ? $options.handleMultiHoursSelect(index) : $options.handleHoursSelect(index)),
    h: common_vendor.p({
      choiceIndex: $data.selectedServiceType === "一对多课程" ? $data.selectedMultiHoursIndex : $data.selectedHoursIndex,
      choiceList: $data.hourOptions,
      defaultText: "小时"
    }),
    i: common_vendor.o((index) => $data.selectedServiceType === "一对多课程" ? $options.handleMultiMinutesSelect(index) : $options.handleMinutesSelect(index)),
    j: common_vendor.p({
      choiceIndex: $data.selectedServiceType === "一对多课程" ? $data.selectedMultiMinutesIndex : $data.selectedMinutesIndex,
      choiceList: $data.minuteOptions,
      defaultText: "分钟"
    }),
    k: $data.selectedServiceType === "一对多课程"
  }, $data.selectedServiceType === "一对多课程" ? {
    l: common_vendor.o($options.handlePersonCountSelect),
    m: common_vendor.p({
      choiceIndex: $data.selectedPersonCountIndex,
      choiceList: $data.personCountOptions,
      defaultText: "请选择课程人数"
    })
  } : {}, {
    n: common_vendor.o([($event) => $data.price = $event.detail.value, (...args) => $options.trackChanges && $options.trackChanges(...args)]),
    o: $data.price,
    p: common_vendor.o([($event) => $data.description = $event.detail.value, (...args) => $options.trackChanges && $options.trackChanges(...args)]),
    q: $data.description,
    r: common_vendor.o((...args) => $options.chooseCover && $options.chooseCover(...args)),
    s: $data.showAttachment
  }, $data.showAttachment ? {
    t: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
  } : {}, {
    v: $data.coverUrls.length > 0
  }, $data.coverUrls.length > 0 ? {
    w: common_vendor.f($data.coverUrls, (url, index, i0) => {
      return {
        a: url,
        b: common_vendor.o(($event) => $options.deleteCover(index), index),
        c: index
      };
    })
  } : {}, {
    x: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args)),
    y: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesMine/service/service_newbuilt.js.map
