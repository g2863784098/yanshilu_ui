"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const createSignature = (data, secret) => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return btoa(hash + secret);
};
const verifyToken = (token, secret = "yanshilu-jwt-secret") => {
  try {
    const [headerBase64, payloadBase64, signature] = token.split(".");
    const expectedSignature = createSignature(`${headerBase64}.${payloadBase64}`, secret);
    if (signature !== expectedSignature) {
      return false;
    }
    const payload = JSON.parse(atob(payloadBase64));
    const currentTime = Math.floor(Date.now() / 1e3);
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/JWT.js:88", "JWT验证失败:", error);
    return false;
  }
};
const getUserIdFromToken = (token) => {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.userId || null;
  } catch (error) {
    common_vendor.index.__f__("error", "at store/user/JWT.js:104", "解析JWT令牌失败:", error);
    return null;
  }
};
const getCurrentToken = () => {
  return common_vendor.index.getStorageSync("user-token") || null;
};
const apiRequest = (url, method = "GET", data = {}, options = {}) => {
  const defaultOptions = {
    autoAddUserId: true,
    requireAuth: true,
    showError: true,
    customHeader: {}
  };
  const finalOptions = { ...defaultOptions, ...options };
  return new Promise((resolve, reject) => {
    const token = getCurrentToken();
    if (finalOptions.requireAuth && (!token || !verifyToken(token))) {
      const error = {
        success: false,
        error: {
          code: 401,
          message: "未登录或认证已过期，请重新登录"
        }
      };
      if (finalOptions.showError) {
        common_vendor.index.showToast({
          title: error.error.message,
          icon: "none",
          duration: 2e3
        });
      }
      reject(error);
      return;
    }
    let requestData = { ...data };
    if (finalOptions.autoAddUserId && token) {
      const userId = getUserIdFromToken(token);
      if (userId) {
        requestData = method.toUpperCase() === "GET" ? { ...requestData, userId } : { ...requestData, userId };
      }
    }
    const headers = {
      "Content-Type": "application/json",
      ...finalOptions.customHeader
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    common_vendor.index.request({
      url,
      method: method.toUpperCase(),
      data: requestData,
      header: headers,
      success: (res) => {
        var _a, _b;
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          resolve({
            success: true,
            data: res.data.data
          });
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          common_vendor.index.removeStorageSync("user-token");
          common_vendor.index.removeStorageSync("userId");
          const error = {
            success: false,
            error: {
              statusCode: res.statusCode,
              message: ((_a = res.data) == null ? void 0 : _a.msg) || (res.statusCode === 401 ? "认证已过期，请重新登录" : "无权访问")
            }
          };
          if (finalOptions.showError) {
            common_vendor.index.showToast({
              title: error.error.message,
              icon: "none",
              duration: 2e3
            });
            setTimeout(() => {
              router_Router.Navigator.toLogin();
            }, 2e3);
          }
          reject(error);
        } else {
          const error = {
            success: false,
            error: {
              statusCode: res.statusCode,
              message: ((_b = res.data) == null ? void 0 : _b.msg) || "请求失败"
            }
          };
          if (finalOptions.showError) {
            common_vendor.index.showToast({
              title: error.error.message,
              icon: "none",
              duration: 2e3
            });
          }
          reject(error);
        }
      },
      fail: (err) => {
        const error = {
          success: false,
          error: {
            message: err.errMsg || "网络请求失败"
          }
        };
        if (finalOptions.showError) {
          common_vendor.index.showToast({
            title: error.error.message,
            icon: "none",
            duration: 2e3
          });
        }
        reject(error);
      }
    });
  });
};
exports.apiRequest = apiRequest;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/user/JWT.js.map
