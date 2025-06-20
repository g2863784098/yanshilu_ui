"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_user_JWT = require("../JWT.js");
const actions = {
  /**
   * 获取用户所有服务信息
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   * @param {Object} [options={}] - 请求选项
   * @returns {Promise<Object>} 包含服务数据的Promise
   */
  async fetchUserServices({ commit }, options = {}) {
    try {
      const response = await store_user_JWT.apiRequest("/api/user/services", "GET", options);
      commit("SET_USER_SERVICES", response.data);
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:25", "获取用户服务失败:", error);
      throw error;
    }
  },
  /**
   * 获取服务详情
   * @param {Object} context - Vuex上下文对象 
   * @param {String} serviceId - 服务ID
   * @returns {Promise<Object>} 包含服务详情的Promise
   */
  async getServiceDetail(_, serviceId) {
    try {
      const response = await store_user_JWT.apiRequest(`/api/user/services/${serviceId}`, "GET");
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:41", "获取服务详情失败:", error);
      throw error;
    }
  },
  /**
   * 更新服务信息
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   * @param {Object} serviceData - 服务数据
   * @param {String} serviceData.id - 服务ID
   * @param {Object} serviceData.updatedInfo - 更新的信息
   * @returns {Promise<Object>} 更新结果Promise
   */
  async updateService({ commit }, { id, updatedInfo }) {
    try {
      const response = await store_user_JWT.apiRequest(`/api/user/services/${id}`, "PUT", updatedInfo);
      if (response.success) {
        commit("UPDATE_SERVICE_BY_USER", { id, updatedInfo });
      }
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:66", "更新服务信息失败:", error);
      throw error;
    }
  },
  /**
   * 添加新服务
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   * @param {Object} serviceData - 服务数据
   * @returns {Promise<Object>} 添加结果Promise
   */
  async addService({ commit }, serviceData) {
    try {
      const response = await store_user_JWT.apiRequest("/api/user/services", "POST", serviceData);
      if (response.success) {
        commit("ADD_SERVICE", response.data);
      }
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:89", "添加服务失败:", error);
      throw error;
    }
  },
  /**
   * 删除服务
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   * @param {String} serviceId - 服务ID
   * @returns {Promise<Object>} 删除结果Promise
   */
  async deleteService({ commit }, serviceId) {
    try {
      const response = await store_user_JWT.apiRequest(`/api/user/services/${serviceId}`, "DELETE");
      if (response.success) {
        commit("DELETE_SERVICE", serviceId);
      }
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:112", "删除服务失败:", error);
      throw error;
    }
  },
  /**
   * 设置当前正在编辑的服务
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   * @param {Object|null} service - 服务对象或null
   */
  setCurrentEditingService({ commit }, service) {
    commit("SET_CURRENT_EDITING_SERVICE", service);
  },
  /**
   * 上传服务封面图片
   * @param {Object} context - Vuex上下文对象
   * @param {Object} fileData - 文件数据
   * @param {String} fileData.serviceId - 服务ID
   * @param {File} fileData.file - 要上传的文件
   * @returns {Promise<Object>} 上传结果Promise
   */
  async uploadServiceCover(_, fileData) {
    try {
      const formData = new FormData();
      formData.append("file", fileData.file);
      const response = await store_user_JWT.apiRequest(`/api/user/services/${fileData.serviceId}/cover`, "POST", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:148", "上传服务封面失败:", error);
      throw error;
    }
  },
  /**
   * 上传服务附件
   * @param {Object} context - Vuex上下文对象
   * @param {Object} fileData - 文件数据
   * @param {String} fileData.serviceId - 服务ID
   * @param {File} fileData.file - 要上传的文件
   * @returns {Promise<Object>} 上传结果Promise
   */
  async uploadServiceAttachment(_, fileData) {
    try {
      const formData = new FormData();
      formData.append("file", fileData.file);
      const response = await store_user_JWT.apiRequest(`/api/user/services/${fileData.serviceId}/attachment`, "POST", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data;
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:174", "上传服务附件失败:", error);
      throw error;
    }
  },
  /**
   * 设置服务过滤条件
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   * @param {Object} filter - 过滤条件
   */
  setServiceFilter({ commit }, filter) {
    commit("SET_SERVICE_FILTER", filter);
  },
  /**
   * 根据服务类型筛选服务
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   * @param {String} type - 服务类型
   */
  filterServicesByType({ commit }, type) {
    commit("SET_SERVICE_FILTER", { type });
  },
  /**
   * 根据关键词搜索服务
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   * @param {String} keyword - 搜索关键词
   */
  searchServicesByKeyword({ commit }, keyword) {
    commit("SET_SERVICE_FILTER", { keyword });
  },
  /**
   * 模拟加载本地服务数据
   * @param {Object} context - Vuex上下文对象
   * @param {Function} context.commit - 提交mutation的函数
   */
  loadLocalServices({ commit }) {
    try {
      const servicesStr = common_vendor.index.getStorageSync("services");
      if (servicesStr) {
        const services = JSON.parse(servicesStr);
        commit("SET_USER_SERVICES", services);
      }
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:224", "加载本地服务数据失败:", error);
      return { success: false, error };
    }
  },
  /**
   * 保存服务到本地存储
   * @param {Object} context - Vuex上下文对象
   * @param {Object} state - Vuex状态对象
   */
  saveServicesToLocal({ state }) {
    try {
      common_vendor.index.setStorageSync("services", JSON.stringify(state.service));
      return { success: true };
    } catch (error) {
      common_vendor.index.__f__("error", "at store/user/myService/actions.js:240", "保存服务到本地存储失败:", error);
      return { success: false, error };
    }
  }
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/myService/actions.js.map
