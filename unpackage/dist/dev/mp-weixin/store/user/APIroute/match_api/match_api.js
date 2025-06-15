"use strict";
const common_vendor = require("../../../../common/vendor.js");
const store_user_API = require("../../API.js");
const getMatchTeacherList = (params) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: store_user_API.MATCH_API_BASE_URL,
      method: "POST",
      data: {
        userId: params.userId,
        schoolList: params.schoolList,
        professionalList: params.professionalList,
        nonProfessionalList: params.nonProfessionalList,
        sortMode: params.sortMode,
        currentPage: params.currentPage,
        pageSize: params.pageSize
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const getTeacherDetail = (params) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: store_user_API.USER_TEACHER_DETAIL_URL,
      method: "POST",
      data: {
        userId: params.userId,
        teacherId: params.teacherId
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
exports.getMatchTeacherList = getMatchTeacherList;
exports.getTeacherDetail = getTeacherDetail;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/store/user/APIroute/match_api/match_api.js.map
