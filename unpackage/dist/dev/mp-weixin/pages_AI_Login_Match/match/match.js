"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const router_Router = require("../../router/Router.js");
const pages_AI_Login_Match_components_combobox_graduate_school_major = require("../components/combobox/graduate_school_major.js");
if (!Math) {
  common_vendor.unref(Header)();
}
const Header = () => "../../components/navigationTitleBar/header.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "match",
  setup(__props) {
    const store = common_vendor.useStore();
    const searchText = common_vendor.ref("");
    const options = [
      new UTSJSONObject({ key: "school", label: "学校" }),
      new UTSJSONObject({ key: "professional", label: "专业课" }),
      new UTSJSONObject({ key: "nonProfessional", label: "非专业课" }),
      new UTSJSONObject({ key: "sort", label: "排序方式" })
    ];
    const currentOption = common_vendor.ref("");
    const showPopup = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const activeNonProTab = common_vendor.ref("");
    const nonProTabs = [
      new UTSJSONObject({ key: "math", label: "数学" }),
      new UTSJSONObject({ key: "english", label: "英语" }),
      new UTSJSONObject({ key: "politics", label: "政治" }),
      new UTSJSONObject({ key: "other", label: "其他" })
    ];
    const tabLabelMap = new UTSJSONObject(
      {
        math: "考研数学",
        english: "考研英语",
        politics: "考研政治",
        other: "其他科目"
      }
      // 从store中获取匹配的老师列表
    );
    const matchTeachers = common_vendor.computed(() => {
      return store.state.user.match.matchList || [];
    });
    const currentPage = common_vendor.computed(() => {
      return store.state.user.match.currentPage;
    });
    const hasMore = common_vendor.computed(() => {
      return store.state.user.match.hasMore;
    });
    const formData = common_vendor.reactive(new UTSJSONObject({
      targetSchoolIndex: -1,
      targetMajorIndex: -1,
      targetSchool: "",
      targetMajor: "",
      // 非专业课筛选数据
      mathIndex: -1,
      englishIndex: -1,
      politicsIndex: -1,
      otherIndex: -1,
      // 排序方式
      sortIndex: -1
    }));
    const targetSchoolList = common_vendor.ref([]);
    const targetMajorList = common_vendor.ref([]);
    const graduateStore = common_vendor.ref(null);
    const mathOptions = common_vendor.ref(["数学一", "数学二", "数学三"]);
    const englishOptions = common_vendor.ref(["英语一", "英语二"]);
    const politicsOptions = common_vendor.ref(["政治必修", "政治选修"]);
    const otherOptions = common_vendor.ref(["经济学", "管理学", "教育学", "历史学"]);
    const sortOptions = common_vendor.ref(["综合评分从高到低", "价格从低到高", "价格从高到低", "最新发布"]);
    const schoolInput = common_vendor.ref("");
    const majorInput = common_vendor.ref("");
    const filteredSchoolList = common_vendor.ref([]);
    const filteredMajorList = common_vendor.ref([]);
    const oneToOneMatchPrice = (matchTeachers2 = null) => {
      const result = new UTSJSONObject({});
      if (!matchTeachers2 || !Array.isArray(matchTeachers2)) {
        return result;
      }
      matchTeachers2.forEach((teacher = null) => {
        var _a;
        const oneToOneService = (_a = teacher.service) === null || _a === void 0 ? null : _a.find((service = null) => {
          var _a2;
          return ((_a2 = service.type) === null || _a2 === void 0 ? null : _a2.typename) === "一对一课程";
        });
        if (oneToOneService) {
          const priceValue = parseFloat(oneToOneService.price.replace(/[^0-9.]/g, ""));
          const hourValue = parseFloat(oneToOneService.type.fulllength.hours.replace(/[^0-9.]/g, ""));
          const minuteValue = parseFloat(oneToOneService.type.fulllength.minutes.replace(/[^0-9.]/g, ""));
          const totalHours = hourValue + minuteValue / 60;
          if (totalHours > 0) {
            result[teacher.id] = new UTSJSONObject({
              name: teacher.name,
              hourlyPrice: (priceValue / totalHours).toFixed(2)
            });
          }
        }
      });
      return result;
    };
    const isActive = (key = null) => {
      if (key === "school") {
        return !!store.state.user.match.schoolList;
      }
      if (key === "professional") {
        return !!store.state.user.match.professionalList;
      }
      if (key === "nonProfessional") {
        const nonProfList = store.state.user.match.nonProfessionalList;
        return !!(nonProfList.math || nonProfList.english || nonProfList.politics || nonProfList.other);
      }
      if (key === "sort") {
        return !!store.state.user.match.sortMode;
      }
      return currentOption.value === key;
    };
    const onOptionClick = (key = null) => {
      if (currentOption.value === key && showPopup.value) {
        showPopup.value = false;
        currentOption.value = "";
        return null;
      }
      currentOption.value = key;
      showPopup.value = true;
      syncStateToForm(key);
    };
    const syncStateToForm = (key = null) => {
      if (key === "school") {
        const schoolList = store.state.user.match.schoolList;
        schoolInput.value = schoolList || "";
        if (schoolList) {
          formData.targetSchool = schoolList;
          const idx = filteredSchoolList.value.findIndex((s) => {
            return s === schoolList;
          });
          if (idx >= 0) {
            formData.targetSchoolIndex = idx;
          }
        }
        updateFilteredSchoolList();
      }
      if (key === "professional") {
        const professionalList = store.state.user.match.professionalList;
        majorInput.value = professionalList || "";
        if (professionalList) {
          formData.targetMajor = professionalList;
          const idx = filteredMajorList.value.findIndex((m) => {
            return m === professionalList;
          });
          if (idx >= 0) {
            formData.targetMajorIndex = idx;
          }
        }
        updateFilteredMajorList();
      }
      if (key === "nonProfessional") {
        const nonProfList = store.state.user.match.nonProfessionalList;
        if (nonProfList.math) {
          const idx = mathOptions.value.findIndex((opt) => {
            return opt === nonProfList.math;
          });
          if (idx >= 0) {
            formData.mathIndex = idx;
            activeNonProTab.value = "math";
          }
        } else if (nonProfList.english) {
          const idx = englishOptions.value.findIndex((opt) => {
            return opt === nonProfList.english;
          });
          if (idx >= 0) {
            formData.englishIndex = idx;
            activeNonProTab.value = "english";
          }
        } else if (nonProfList.politics) {
          const idx = politicsOptions.value.findIndex((opt) => {
            return opt === nonProfList.politics;
          });
          if (idx >= 0) {
            formData.politicsIndex = idx;
            activeNonProTab.value = "politics";
          }
        } else if (nonProfList.other) {
          const idx = otherOptions.value.findIndex((opt) => {
            return opt === nonProfList.other;
          });
          if (idx >= 0) {
            formData.otherIndex = idx;
            activeNonProTab.value = "other";
          }
        }
      }
      if (key === "sort") {
        const sortMode = store.state.user.match.sortMode;
        if (sortMode) {
          const idx = sortOptions.value.findIndex((opt) => {
            return opt === sortMode;
          });
          if (idx >= 0) {
            formData.sortIndex = idx;
          }
        }
      }
    };
    const onPopupClose = () => {
      showPopup.value = false;
      currentOption.value = "";
    };
    const handleSchoolChange = (school = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!school) {
          resetMajorSelection();
          return Promise.resolve(null);
        }
        pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.actions.selectSchool(new UTSJSONObject({
          commit: (mutation = null, payload = null) => {
            pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations[mutation](graduateStore.value, payload);
          }
        }), school);
        if (graduateStore.value.schools[school]) {
          graduateStore.value.schools[school].length;
          targetMajorList.value = graduateStore.value.schools[school].slice(0, 100);
          if (store.state.user.match.professionalList) {
            const savedMajor = store.state.user.match.professionalList;
            const majorIndex = targetMajorList.value.findIndex((major) => {
              return major === savedMajor;
            });
            if (majorIndex >= 0) {
              formData.targetMajorIndex = majorIndex;
              formData.targetMajor = savedMajor;
            } else {
              resetMajorSelection();
              store.dispatch("user/match/updateProfessionalList", "");
            }
          }
        } else {
          resetMajorSelection();
        }
      });
    };
    const initGraduateData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          graduateStore.value = UTS.JSON.parse(UTS.JSON.stringify(pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.state));
          pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.initSchoolFuse(graduateStore.value);
          const schools = Object.keys(graduateStore.value.schools).slice(0, 50);
          targetSchoolList.value = schools;
        } catch (error) {
          targetSchoolList.value = ["北京大学", "清华大学", "复旦大学"];
        }
      });
    };
    const onSchoolInput = (e = null) => {
      const keyword = e.detail.value || schoolInput.value;
      pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setSchoolKeyword(graduateStore.value, keyword);
      if (!keyword) {
        formData.targetSchoolIndex = -1;
        formData.targetSchool = "";
        majorInput.value = "";
        formData.targetMajorIndex = -1;
        formData.targetMajor = "";
      }
      updateFilteredSchoolList();
    };
    const onMajorInput = (e = null) => {
      if (!formData.targetSchool)
        return null;
      const keyword = e.detail.value || majorInput.value;
      pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, keyword);
      if (!keyword) {
        formData.targetMajorIndex = -1;
        formData.targetMajor = "";
      }
      updateFilteredMajorList(keyword);
    };
    const updateFilteredSchoolList = () => {
      filteredSchoolList.value = pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.getters.filteredSchoolList(graduateStore.value);
    };
    const updateFilteredMajorList = (forceKeyword = null) => {
      var _a;
      if (!formData.targetSchool) {
        filteredMajorList.value = [];
        return null;
      }
      pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setSelectedSchool(graduateStore.value, formData.targetSchool);
      const currentKeyword = forceKeyword !== void 0 ? forceKeyword : graduateStore.value.majorKeyword || "";
      if (forceKeyword && forceKeyword !== graduateStore.value.majorKeyword) {
        pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, forceKeyword);
      }
      let originalMajorList = [];
      if (currentKeyword) {
        const originalKeyword = graduateStore.value.majorKeyword;
        pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, currentKeyword);
        originalMajorList = pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.getters.filteredMajorList(graduateStore.value);
        if (originalKeyword !== currentKeyword) {
          pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, originalKeyword);
        }
      } else {
        originalMajorList = ((_a = graduateStore.value.schools[formData.targetSchool]) === null || _a === void 0 ? null : _a.slice(0, 100)) || [];
      }
      filteredMajorList.value = originalMajorList;
      if (!currentKeyword) {
        customSortMajorList();
      } else {
        ensureSelectedMajorVisible();
      }
    };
    const ensureSelectedMajorVisible = () => {
      if (!formData.targetMajor || !filteredMajorList.value.length) {
        return null;
      }
      const index = filteredMajorList.value.findIndex((major) => {
        return major === formData.targetMajor;
      });
      if (index === -1) {
        filteredMajorList.value.unshift(formData.targetMajor);
      } else if (index > 0) {
        const selectedMajor = filteredMajorList.value.splice(index, 1)[0];
        filteredMajorList.value.unshift(selectedMajor);
      }
    };
    const customSortMajorList = () => {
      if (!filteredMajorList.value || filteredMajorList.value.length === 0) {
        return null;
      }
      filteredMajorList.value.sort((a, b) => {
        if (a === formData.targetMajor)
          return -1;
        if (b === formData.targetMajor)
          return 1;
        if (formData.targetSchool === "同济大学") {
          const aHasComputer = a.includes("计算") || a.includes("软件") || a.includes("信息") || a.includes("通信");
          const bHasComputer = b.includes("计算") || b.includes("软件") || b.includes("信息") || b.includes("通信");
          if (aHasComputer && !bHasComputer)
            return -1;
          if (!aHasComputer && bHasComputer)
            return 1;
        }
        return a.localeCompare(b, "zh-CN");
      });
    };
    const selectSchoolTemp = (idx = null, school = null) => {
      formData.targetSchoolIndex = idx;
      formData.targetSchool = school;
      schoolInput.value = school;
    };
    const confirmSchoolFilter = () => {
      store.commit("user/match/SET_SCHOOL_LIST", formData.targetSchool);
      if (formData.targetSchool) {
        handleSchoolChange(formData.targetSchool);
      } else {
        majorInput.value = "";
        formData.targetMajorIndex = -1;
        formData.targetMajor = "";
        updateFilteredMajorList();
      }
      applyFilters();
      showPopup.value = false;
      currentOption.value = "";
    };
    const selectMajorTemp = (idx = null, major = null) => {
      formData.targetMajorIndex = idx;
      formData.targetMajor = major;
      majorInput.value = major;
    };
    const prepareProfessionalFilter = () => {
      if (!formData.targetMajor && majorInput.value && filteredMajorList.value.length > 0) {
        const keyword = majorInput.value;
        let searchResults = [];
        if (keyword) {
          const originalKeyword = graduateStore.value.majorKeyword;
          pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, keyword);
          searchResults = pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.getters.filteredMajorList(graduateStore.value);
          pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, originalKeyword);
        }
        if (searchResults.length > 0) {
          formData.targetMajor = searchResults[0];
        } else {
          formData.targetMajor = filteredMajorList.value[0];
        }
        formData.targetMajorIndex = 0;
        majorInput.value = formData.targetMajor;
      }
      return formData.targetMajor;
    };
    const confirmProfessionalFilter = () => {
      const selectedMajor = prepareProfessionalFilter();
      if (selectedMajor) {
        formData.mathIndex = -1;
        formData.englishIndex = -1;
        formData.politicsIndex = -1;
        formData.otherIndex = -1;
        store.commit("user/match/SET_NON_PROFESSIONAL_LIST", new UTSJSONObject({
          math: "",
          english: "",
          politics: "",
          other: ""
        }));
      }
      store.commit("user/match/SET_PROFESSIONAL_LIST", selectedMajor);
      if (graduateStore.value) {
        pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, "");
      }
      applyFilters();
      showPopup.value = false;
      currentOption.value = "";
    };
    const getChoiceIndex = (key = null) => {
      switch (key) {
        case "math":
          return formData.mathIndex;
        case "english":
          return formData.englishIndex;
        case "politics":
          return formData.politicsIndex;
        case "other":
          return formData.otherIndex;
        default:
          return -1;
      }
    };
    const handleChoiceSelect = (key = null, index = null) => {
      if (key === "math" && formData.mathIndex === index || key === "english" && formData.englishIndex === index || key === "politics" && formData.politicsIndex === index || key === "other" && formData.otherIndex === index) {
        formData.mathIndex = -1;
        formData.englishIndex = -1;
        formData.politicsIndex = -1;
        formData.otherIndex = -1;
        return null;
      }
      formData.mathIndex = -1;
      formData.englishIndex = -1;
      formData.politicsIndex = -1;
      formData.otherIndex = -1;
      switch (key) {
        case "math":
          formData.mathIndex = index;
          break;
        case "english":
          formData.englishIndex = index;
          break;
        case "politics":
          formData.politicsIndex = index;
          break;
        case "other":
          formData.otherIndex = index;
          break;
      }
    };
    const confirmNonProfessionalFilter = () => {
      const updateObj = new UTSJSONObject(
        {
          math: formData.mathIndex >= 0 ? mathOptions.value[formData.mathIndex] : "",
          english: formData.englishIndex >= 0 ? englishOptions.value[formData.englishIndex] : "",
          politics: formData.politicsIndex >= 0 ? politicsOptions.value[formData.politicsIndex] : "",
          other: formData.otherIndex >= 0 ? otherOptions.value[formData.otherIndex] : ""
        }
        // 直接使用 commit 修改状态
      );
      store.commit("user/match/SET_NON_PROFESSIONAL_LIST", updateObj);
      if (formData.mathIndex >= 0 || formData.englishIndex >= 0 || formData.politicsIndex >= 0 || formData.otherIndex >= 0) {
        formData.targetMajorIndex = -1;
        formData.targetMajor = "";
        store.commit("user/match/SET_PROFESSIONAL_LIST", "");
      }
      applyFilters();
      showPopup.value = false;
      currentOption.value = "";
    };
    const handleSortSelect = (index = null) => {
      if (formData.sortIndex === index) {
        formData.sortIndex = -1;
      } else {
        formData.sortIndex = index;
      }
    };
    const confirmSortFilter = () => {
      const sortValue = formData.sortIndex >= 0 ? sortOptions.value[formData.sortIndex] : "";
      store.commit("user/match/SET_SORT_MODE", sortValue);
      applyFilters();
      showPopup.value = false;
      currentOption.value = "";
    };
    const viewTeacherDetail = (teacherId = null) => {
      router_Router.Navigator.toTeacher(teacherId);
    };
    const handleCommunicate = (teacherId = null) => {
      router_Router.Navigator.toChat(teacherId);
    };
    const loadMoreTeachers = () => {
      if (isLoading.value || !hasMore.value)
        return null;
      isLoading.value = true;
      const payload = new UTSJSONObject(
        {
          loadMore: true,
          schoolList: store.state.user.match.schoolList,
          professionalList: store.state.user.match.professionalList,
          nonProfessionalList: store.state.user.match.nonProfessionalList,
          sortMode: store.state.user.match.sortMode,
          currentPage: currentPage.value + 1,
          pageSize: store.state.user.match.pageSize
        }
        // 模拟获取数据
      );
      setTimeout(() => {
        store.commit("user/match/SET_PAGINATION", new UTSJSONObject({
          currentPage: payload.currentPage,
          hasMore: true
          // 假设还有更多数据
        }));
        isLoading.value = false;
      }, 1e3);
    };
    const resetMajorSelection = () => {
      formData.targetMajorIndex = -1;
      formData.targetMajor = "";
    };
    const selectNonProTab = (key = null) => {
      activeNonProTab.value = key;
    };
    const getChoiceList = (key = null) => {
      switch (key) {
        case "math":
          return mathOptions.value;
        case "english":
          return englishOptions.value;
        case "politics":
          return politicsOptions.value;
        case "other":
          return otherOptions.value;
        default:
          return [];
      }
    };
    const applyFilters = () => {
      isLoading.value = true;
      const payload = new UTSJSONObject(
        {
          schoolList: store.state.user.match.schoolList,
          professionalList: store.state.user.match.professionalList,
          nonProfessionalList: store.state.user.match.nonProfessionalList,
          sortMode: store.state.user.match.sortMode,
          currentPage: 1
          // 重置为第一页
        }
        // 重置分页
      );
      store.commit("user/match/SET_PAGINATION", new UTSJSONObject({
        currentPage: payload.currentPage,
        hasMore: true
        // 假设还有更多数据
      }));
      setTimeout(() => {
        isLoading.value = false;
      }, 1e3);
    };
    const filterSummary = common_vendor.computed(() => {
      const summary = new UTSJSONObject({});
      summary.school = store.state.user.match.schoolList || "";
      summary.professional = store.state.user.match.professionalList || "";
      const nonProfList = store.state.user.match.nonProfessionalList;
      const nonProfItems = [];
      if (nonProfList.math)
        nonProfItems.push(nonProfList.math);
      if (nonProfList.english)
        nonProfItems.push(nonProfList.english);
      if (nonProfList.politics)
        nonProfItems.push(nonProfList.politics);
      if (nonProfList.other)
        nonProfItems.push(nonProfList.other);
      summary.nonProfessional = nonProfItems.join(", ");
      summary.sort = store.state.user.match.sortMode || "";
      return summary;
    });
    const resetSchoolFilter = () => {
      schoolInput.value = "";
      formData.targetSchoolIndex = -1;
      formData.targetSchool = "";
      majorInput.value = "";
      formData.targetMajorIndex = -1;
      formData.targetMajor = "";
      updateFilteredSchoolList();
    };
    const resetProfessionalFilter = () => {
      majorInput.value = "";
      formData.targetMajorIndex = -1;
      formData.targetMajor = "";
      store.commit("user/match/SET_PROFESSIONAL_LIST", "");
      if (formData.targetSchool && graduateStore.value) {
        pages_AI_Login_Match_components_combobox_graduate_school_major.GraduateStore.mutations.setMajorKeyword(graduateStore.value, "");
      }
      updateFilteredMajorList();
    };
    const handleBack = () => {
      router_Router.Navigator.toIndex();
    };
    common_vendor.onMounted(() => {
      initGraduateData().then(() => {
        var _a;
        updateFilteredSchoolList();
        updateFilteredMajorList();
        const selectedSchool = store.state.user.match.schoolList;
        if (selectedSchool && ((_a = graduateStore.value) === null || _a === void 0 ? null : _a.schools[selectedSchool])) {
          const majors = graduateStore.value.schools[selectedSchool].slice(0, 100);
          targetMajorList.value = majors;
        }
      });
      isLoading.value = true;
      setTimeout(() => {
        store.commit("user/match/SET_PAGINATION", new UTSJSONObject({
          currentPage: 1,
          hasMore: true
        }));
        isLoading.value = false;
      }, 1e3);
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_assets._imports_0$2,
        b: common_assets._imports_1$2,
        c: common_vendor.o(handleBack),
        d: common_vendor.p(new UTSJSONObject({
          title: "精准匹配"
        })),
        e: searchText.value,
        f: common_vendor.o(($event = null) => {
          return searchText.value = $event.detail.value;
        }),
        g: common_vendor.f(options, (item = null, k0 = null, i0 = null) => {
          return common_vendor.e(new UTSJSONObject({
            a: common_vendor.t(item.label),
            b: isActive(item.key) ? 1 : "",
            c: filterSummary.value[item.key]
          }), filterSummary.value[item.key] ? new UTSJSONObject({
            d: common_vendor.t(filterSummary.value[item.key])
          }) : new UTSJSONObject({}), new UTSJSONObject({
            e: isActive(item.key) ? 1 : "",
            f: currentOption.value === item.key ? 1 : "",
            g: item.key,
            h: isActive(item.key) ? 1 : "",
            i: common_vendor.o(($event = null) => {
              return onOptionClick(item.key);
            }, item.key)
          }));
        }),
        h: showPopup.value
      }), showPopup.value ? common_vendor.e(new UTSJSONObject({
        i: currentOption.value === "school"
      }), currentOption.value === "school" ? common_vendor.e(new UTSJSONObject({
        j: common_vendor.o([($event = null) => {
          return schoolInput.value = $event.detail.value;
        }, onSchoolInput]),
        k: common_vendor.o(() => {
        }),
        l: schoolInput.value,
        m: schoolInput.value
      }), schoolInput.value ? new UTSJSONObject({
        n: common_vendor.o(resetSchoolFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        o: common_vendor.f(filteredSchoolList.value, (school = null, idx = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(school),
            b: school,
            c: idx === formData.targetSchoolIndex ? 1 : "",
            d: common_vendor.o(($event = null) => {
              return selectSchoolTemp(idx, school);
            }, school)
          });
        }),
        p: common_assets._imports_2,
        q: common_vendor.o(confirmSchoolFilter),
        r: common_vendor.o(() => {
        })
      })) : new UTSJSONObject({}), new UTSJSONObject({
        s: currentOption.value === "professional"
      }), currentOption.value === "professional" ? common_vendor.e(new UTSJSONObject({
        t: formData.targetSchool ? "请输入专业名称" : "请先选择学校",
        v: !formData.targetSchool,
        w: common_vendor.o([($event = null) => {
          return majorInput.value = $event.detail.value;
        }, onMajorInput]),
        x: common_vendor.o(() => {
        }),
        y: majorInput.value,
        z: majorInput.value
      }), majorInput.value ? new UTSJSONObject({
        A: common_vendor.o(resetProfessionalFilter)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        B: common_vendor.f(filteredMajorList.value, (major = null, idx = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(major),
            b: major,
            c: idx === formData.targetMajorIndex ? 1 : "",
            d: common_vendor.o(($event = null) => {
              return selectMajorTemp(idx, major);
            }, major)
          });
        }),
        C: common_assets._imports_2,
        D: common_vendor.o(confirmProfessionalFilter),
        E: common_vendor.o(() => {
        })
      })) : new UTSJSONObject({}), new UTSJSONObject({
        F: currentOption.value === "nonProfessional"
      }), currentOption.value === "nonProfessional" ? new UTSJSONObject({
        G: common_vendor.f(nonProTabs, (tab = null, k0 = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(tab.label),
            b: tab.key,
            c: common_vendor.n(activeNonProTab.value === tab.key ? "active" : ""),
            d: common_vendor.o(($event = null) => {
              return selectNonProTab(tab.key);
            }, tab.key)
          });
        }),
        H: common_vendor.t(tabLabelMap[activeNonProTab.value]),
        I: common_vendor.f(getChoiceList(activeNonProTab.value), (option = null, index = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(option),
            b: index,
            c: index === getChoiceIndex(activeNonProTab.value) ? 1 : "",
            d: common_vendor.o(($event = null) => {
              return handleChoiceSelect(activeNonProTab.value, index);
            }, index)
          });
        }),
        J: common_assets._imports_2,
        K: common_vendor.o(confirmNonProfessionalFilter),
        L: common_vendor.o(() => {
        })
      }) : new UTSJSONObject({}), new UTSJSONObject({
        M: currentOption.value === "sort"
      }), currentOption.value === "sort" ? new UTSJSONObject({
        N: common_vendor.f(sortOptions.value, (option = null, index = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(option),
            b: index,
            c: index === formData.sortIndex ? 1 : "",
            d: common_vendor.o(($event = null) => {
              return handleSortSelect(index);
            }, index)
          });
        }),
        O: common_assets._imports_2,
        P: common_vendor.o(confirmSortFilter),
        Q: common_vendor.o(() => {
        })
      }) : new UTSJSONObject({}), new UTSJSONObject({
        R: common_vendor.o(onPopupClose)
      })) : new UTSJSONObject({}), new UTSJSONObject({
        S: common_vendor.f(matchTeachers.value, (teacher = null, index = null, i0 = null) => {
          return common_vendor.e(new UTSJSONObject({
            a: teacher.avatar || "/static/image/defaultAvatar/teacher-man.png",
            b: common_vendor.o(($event = null) => {
              return viewTeacherDetail(teacher.id);
            }, teacher.id || index),
            c: common_vendor.t(teacher.name),
            d: teacher.certificate ? "/static/image/certify/certified.png" : "/static/image/certify/uncertified.png",
            e: teacher.certificate ? "已认证" : "未认证",
            f: common_vendor.t(teacher.school),
            g: common_vendor.t(teacher.major),
            h: oneToOneMatchPrice(matchTeachers.value)[teacher.id]
          }), oneToOneMatchPrice(matchTeachers.value)[teacher.id] ? new UTSJSONObject({
            i: common_vendor.t(oneToOneMatchPrice(matchTeachers.value)[teacher.id].hourlyPrice)
          }) : new UTSJSONObject({}), new UTSJSONObject({
            j: common_vendor.o(($event = null) => {
              return handleCommunicate(teacher.id);
            }, teacher.id || index),
            k: teacher.id || index
          }));
        }),
        T: common_assets._imports_3,
        U: matchTeachers.value.length === 0 && !isLoading.value
      }), matchTeachers.value.length === 0 && !isLoading.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        V: common_vendor.sei("step2", "scroll-view"),
        W: common_vendor.o(loadMoreTeachers)
      }));
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd318616"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_AI_Login_Match/match/match.js.map
