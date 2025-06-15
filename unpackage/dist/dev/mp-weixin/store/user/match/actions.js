"use strict";
const store_user_APIroute_match_api_match_api = require("../APIroute/match_api/match_api.js");
const fetchMatchTeacherList = ({ commit, rootState, state }, payload = {}) => {
  const userId = rootState.user.baseInfo.id;
  const isLoadMore = payload.loadMore === true;
  const currentPage = isLoadMore ? state.currentPage + 1 : 1;
  const params = {
    userId,
    schoolList: payload.schoolList || state.schoolList,
    professionalList: payload.professionalList || state.professionalList,
    nonProfessionalList: payload.nonProfessionalList || state.nonProfessionalList,
    sortMode: payload.sortMode || state.sortMode,
    currentPage,
    pageSize: payload.pageSize || state.pageSize
  };
  return new Promise((resolve, reject) => {
    store_user_APIroute_match_api_match_api.getMatchTeacherList(params).then((response) => {
      if (response && response.data) {
        if (isLoadMore) {
          commit("APPEND_MATCH_LIST", response.data);
        } else {
          commit("SET_MATCH_LIST", response.data);
        }
        commit("SET_PAGINATION", {
          currentPage,
          hasMore: response.hasMore || false
        });
      }
      resolve(response);
    }).catch((error) => {
      reject(error);
    });
  });
};
const fetchTeacherDetail = ({ commit, rootState }, { teacherId }) => {
  const userId = rootState.user.baseInfo.id;
  if (!teacherId) {
    return Promise.reject(new Error("老师ID不能为空"));
  }
  const params = {
    userId,
    teacherId
  };
  return new Promise((resolve, reject) => {
    store_user_APIroute_match_api_match_api.getTeacherDetail(params).then((response) => {
      if (response && response.data) {
        commit("SET_TEACHER_DETAIL", {
          teacherId,
          detail: response.data
        });
      }
      resolve(response);
    }).catch((error) => {
      reject(error);
    });
  });
};
const actions = {
  fetchMatchTeacherList,
  fetchTeacherDetail
};
exports.actions = actions;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/actions.js.map
