"use strict";
const getServiceTypeByName = (typename) => {
  const baseType = { typename };
  switch (typename) {
    case "一对一课程":
      return {
        ...baseType,
        coursenum: 12,
        fulllength: {
          hours: "120小时",
          minutes: "30分钟"
        }
      };
    case "一对多课程":
      return {
        ...baseType,
        coursenum: 12,
        fulllength: {
          hours: "120小时",
          minutes: "30分钟"
        },
        studentnum: 4
      };
    case "学习资料":
      return baseType;
    default:
      return baseType;
  }
};
const state = {
  // 学校列表
  schoolList: "",
  // 专业课列表
  professionalList: "",
  // 非专业课列表
  nonProfessionalList: {
    math: "",
    english: "",
    politics: "",
    other: ""
  },
  // 排序方式
  sortMode: "",
  // 匹配列表
  matchList: [
    {
      id: "teacher001",
      name: "张老师",
      avatar: "/static/image/defaultAvatar/teacher-man.png",
      gender: "male",
      selfIntroduction: "清华大学计算机专业硕士，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉",
      certificate: 1,
      campusAmbassador: 1,
      // 是否为校园大使
      school: "清华大学",
      major: "计算机科学与技术",
      service: [
        /** @type {ServiceInfo} */
        {
          id: "service001",
          name: "考研规划咨询",
          type: getServiceTypeByName("一对一课程"),
          price: "200元",
          description: "提供考研全程规划指导不会不会给vui不会vu一部韩剧韩剧u一般会的给v保监局预估i保护局故意不回就搞不好健康环保",
          images: ["/static/image/defaultAvatar/teacher-man.png"]
        },
        /** @type {ServiceInfo} */
        {
          id: "service002",
          name: "一对多课程",
          type: getServiceTypeByName("一对多课程"),
          price: "300元",
          description: "计算机专业课一对一辅导",
          images: ["/static/image/defaultAvatar/teacher-man.png"]
        }
      ]
    },
    {
      id: "teacher002",
      name: "李老师",
      avatar: "/static/image/defaultAvatar/teacher-man.png",
      gender: "female",
      selfIntroduction: "北京大学经济学博士，3年教学经验",
      certificate: 1,
      campusAmbassador: 1,
      // 是否为校园大使
      school: "北京大学",
      major: "经济学",
      service: [
        /** @type {ServiceInfo} */
        {
          id: "service003",
          name: "经济学基础课程",
          type: getServiceTypeByName("学习资料"),
          price: "150元",
          description: "经济学基础理论讲解",
          images: ["/static/image/defaultAvatar/teacher-man.png"]
        }
      ]
    }
  ],
  currentPage: 1,
  pageSize: 10,
  hasMore: false,
  // 是否还有更多数据可加载
  isLoading: false
};
exports.state = state;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/store/user/match/state.js.map
