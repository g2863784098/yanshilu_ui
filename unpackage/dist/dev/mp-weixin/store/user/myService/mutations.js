"use strict";
const mutations = {
  /**
   * 设置用户服务列表
   * @param {Object} state - 当前模块的状态
   * @param {Array} services - 服务数组
   */
  SET_USER_SERVICES(state, services) {
    state.service = services;
  },
  /**
   * 用户修改服务信息
   * @param {Object} state - 当前模块的状态
   * @param {Object} payload - 包含服务ID和更新信息的对象
   * @param {string} payload.id - 要更新的服务ID
   * @param {Object} payload.updatedInfo - 用户修改后的服务信息
   */
  UPDATE_SERVICE_BY_USER(state, { id, updatedInfo }) {
    const serviceIndex = state.service.findIndex((service) => service.id === id);
    if (serviceIndex !== -1) {
      state.service[serviceIndex] = {
        ...state.service[serviceIndex],
        ...updatedInfo,
        updateTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        // 添加更新时间
      };
    }
  },
  /**
   * 添加新服务
   * @param {Object} state - 当前模块的状态
   * @param {Object} serviceData - 新服务数据
   */
  ADD_SERVICE(state, serviceData) {
    const now = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const newService = {
      ...serviceData,
      createTime: serviceData.createTime || now,
      updateTime: serviceData.updateTime || now,
      status: serviceData.status || "active"
    };
    state.service.unshift(newService);
  },
  /**
   * 删除服务
   * @param {Object} state - 当前模块的状态
   * @param {String} serviceId - 要删除的服务ID
   */
  DELETE_SERVICE(state, serviceId) {
    state.service = state.service.filter((service) => service.id !== serviceId);
  },
  /**
   * 设置当前正在编辑的服务
   * @param {Object} state - 当前模块的状态
   * @param {Object|null} service - 服务对象或null
   */
  SET_CURRENT_EDITING_SERVICE(state, service) {
    state.currentEditingService = service;
  },
  /**
   * 设置服务过滤条件
   * @param {Object} state - 当前模块的状态
   * @param {Object} filter - 过滤条件
   */
  SET_SERVICE_FILTER(state, filter) {
    state.filter = {
      ...state.filter,
      ...filter
    };
  },
  /**
   * 添加服务封面图片
   * @param {Object} state - 当前模块的状态
   * @param {Object} payload - 包含服务ID和图片URL的对象
   * @param {String} payload.id - 要更新的服务ID
   * @param {String} payload.imageUrl - 图片URL
   */
  ADD_SERVICE_COVER_IMAGE(state, { id, imageUrl }) {
    const serviceIndex = state.service.findIndex((service) => service.id === id);
    if (serviceIndex !== -1) {
      const service = state.service[serviceIndex];
      const imageUrls = service.imageUrls || [];
      state.service[serviceIndex] = {
        ...service,
        image: imageUrl,
        // 主封面图片
        imageUrls: [...imageUrls, imageUrl],
        // 所有图片列表
        updateTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
    }
  },
  /**
   * 删除服务封面图片
   * @param {Object} state - 当前模块的状态
   * @param {Object} payload - 包含服务ID和图片索引的对象
   * @param {String} payload.id - 要更新的服务ID
   * @param {Number} payload.index - 要删除的图片索引
   */
  DELETE_SERVICE_COVER_IMAGE(state, { id, index }) {
    const serviceIndex = state.service.findIndex((service) => service.id === id);
    if (serviceIndex !== -1) {
      const service = state.service[serviceIndex];
      if (service.imageUrls && service.imageUrls.length > index) {
        const newImageUrls = [...service.imageUrls];
        newImageUrls.splice(index, 1);
        state.service[serviceIndex] = {
          ...service,
          // 如果主封面被删除，则使用第一张图片或空字符串
          image: newImageUrls.length > 0 ? newImageUrls[0] : "",
          imageUrls: newImageUrls,
          updateTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        };
      }
    }
  },
  /**
   * 设置服务附件链接
   * @param {Object} state - 当前模块的状态
   * @param {Object} payload - 包含服务ID和附件链接的对象
   * @param {String} payload.id - 要更新的服务ID
   * @param {String} payload.fileLink - 附件链接
   */
  SET_SERVICE_FILE_LINK(state, { id, fileLink }) {
    const serviceIndex = state.service.findIndex((service) => service.id === id);
    if (serviceIndex !== -1) {
      state.service[serviceIndex] = {
        ...state.service[serviceIndex],
        fileLink,
        updateTime: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
    }
  }
};
exports.mutations = mutations;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/myService/mutations.js.map
