"use strict";
const common_vendor = require("../../common/vendor.js");
const router_Router = require("../../router/Router.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = common_vendor.defineComponent({
  data() {
    return {
      openid: "",
      userEntity: null,
      terminal: "",
      osVersion: "",
      phoneNumber: "",
      userInfo: null,
      loginstate: "",
      showModal: false,
      showAgreementModal: false,
      showPrivacyModal: false
    };
  },
  // 在页面加载的时候，判断缓存中是否有内容，如果有，存入到对应的字段里
  onLoad() {
    common_vendor.index.getStorage({
      key: "openid",
      success: (res) => {
        this.openid = res.data;
      },
      fail: () => {
        this.getcode();
      }
    });
    common_vendor.index.getStorage({
      key: "userEntity",
      success: (res) => {
        this.userEntity = res.data;
      },
      fail: () => {
        common_vendor.index.__f__("log", "at pages_AI_Login_Match/login/wechat_login.vue:161", "fail1");
      }
    });
    common_vendor.index.getStorage({
      key: "loginstate",
      success: (res) => {
        this.loginstate = res.data;
      },
      fail: () => {
        common_vendor.index.__f__("log", "at pages_AI_Login_Match/login/wechat_login.vue:172", "fail2");
      }
    });
    common_vendor.index.getStorage({
      key: "userinfo",
      success: (res) => {
        this.userInfo = res.data;
      }
    });
  },
  methods: {
    /**
     * 用户点击登录按钮，获取用户信息授权
     * @param {Object} e - 事件对象
     */
    onGotUserInfo(e = null) {
      common_vendor.index.showModal(new UTSJSONObject({
        title: "授权提示",
        content: "应用需要获取您的昵称、头像、地区及性别等信息",
        success: (res) => {
          if (res.confirm) {
            this.getUserProfileInfo();
          } else if (res.cancel) {
            common_vendor.index.showToast({
              title: "您取消了授权",
              icon: "none"
            });
          }
        }
      }));
    },
    /**
     * 获取用户信息
     */
    getUserProfileInfo() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      common_vendor.index.getUserProfile(new UTSJSONObject({
        desc: "用于完善会员资料",
        lang: "zh_CN",
        success: (res = null) => {
          common_vendor.index.hideLoading();
          if (res.userInfo) {
            const userInfo = res.userInfo;
            common_vendor.index.setStorage({
              key: "userinfo",
              data: userInfo
            });
            this.userInfo = userInfo;
            common_vendor.index.__f__("log", "at pages_AI_Login_Match/login/wechat_login.vue:237", "获取用户信息成功", userInfo);
            common_vendor.index.showToast({
              title: "授权成功",
              icon: "success",
              duration: 1500
            });
            setTimeout(() => {
              this.showDialogBtn();
            }, 1500);
          }
        },
        fail: (err = null) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages_AI_Login_Match/login/wechat_login.vue:254", "获取用户信息失败", err);
          common_vendor.index.showToast({
            title: "获取信息失败",
            icon: "none"
          });
        }
      }));
    },
    /**
     * 获取微信code码
     */
    getcode() {
      common_vendor.index.login(new UTSJSONObject({
        provider: "weixin",
        success: (res) => {
          if (res.code) {
            common_vendor.index.request({
              url: "登录接口",
              method: "POST",
              data: new UTSJSONObject({
                account: "1514382701",
                jscode: res.code
              }),
              header: new UTSJSONObject({
                "content-type": "application/json"
              }),
              success: (res2) => {
                if (res2.data.r == "T") {
                  common_vendor.index.setStorage({
                    key: "openid",
                    data: res2.data.openid
                  });
                  common_vendor.index.setStorage({
                    key: "sessionkey",
                    data: res2.data.sessionkey
                  });
                  this.openid = res2.data.openid;
                }
              }
            });
          }
        }
      }));
    },
    /**
     * 显示一键获取手机号弹窗
     */
    showDialogBtn() {
      this.showModal = true;
    },
    /**
     * 隐藏一键获取手机号弹窗
     */
    hideModal() {
      this.showModal = false;
    },
    /**
     * 处理登录信息并提交到服务器
     * @param {String} openid - 用户openid
     * @param {Object} userInfo - 用户信息
     * @param {String} phoneNumber - 用户手机号
     */
    onshow(openid = null, userInfo = null, phoneNumber = null) {
      common_vendor.index.getSystemInfo(new UTSJSONObject({
        success: (res) => {
          this.terminal = res.model;
          this.osVersion = res.system;
        }
      }));
      common_vendor.index.request({
        url: "登录接口",
        method: "POST",
        header: new UTSJSONObject({
          "content-type": "application/json"
        }),
        data: new UTSJSONObject({
          username: phoneNumber,
          parentuser: "xudeihai",
          wximg: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          identity: "",
          terminal: this.terminal,
          osVersion: this.osVersion,
          logintype: "10",
          openid: this.openid
        }),
        success: (res) => {
          if (res.data.r == "T") {
            this.userEntity = res.data.d;
            common_vendor.index.setStorage({
              key: "userEntity",
              data: res.data.d
            });
            this.loginstate = "1";
            common_vendor.index.setStorage({
              key: "loginstate",
              data: "1"
            });
            common_vendor.index.setStorage({
              key: "userinfo",
              data: userInfo
              // 保存完整的用户信息对象
            });
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1500
            });
            setTimeout(() => {
              this.toHome();
            }, 1500);
          }
        },
        fail(res) {
          common_vendor.index.__f__("log", "at pages_AI_Login_Match/login/wechat_login.vue:378", res);
          common_vendor.index.showToast({
            title: "登录失败",
            icon: "none"
          });
        }
      });
    },
    /**
     * 获取手机号
     * @param {Object} e - 事件对象，包含加密数据
     */
    getPhoneNumber(e = null) {
      this.hideModal();
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        common_vendor.index.showToast({
          title: "未授权手机号",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.showLoading({
        title: "处理中..."
      });
      common_vendor.index.checkSession(new UTSJSONObject({
        success: () => {
          this.requestPhoneNumber(e);
        },
        fail: () => {
          common_vendor.index.login(new UTSJSONObject({
            provider: "weixin",
            success: (res) => {
              common_vendor.index.request({
                url: "自己的登录接口",
                data: new UTSJSONObject({
                  account: "1514382701",
                  jscode: res.code
                }),
                method: "POST",
                header: new UTSJSONObject({
                  "content-type": "application/json"
                }),
                success: (res2) => {
                  if (res2.data.r == "T") {
                    common_vendor.index.setStorage({
                      key: "openid",
                      data: res2.data.openid
                    });
                    common_vendor.index.setStorage({
                      key: "sessionkey",
                      data: res2.data.sessionkey
                    });
                    this.decryptPhoneNumber(e, res2.data.sessionkey);
                  } else {
                    common_vendor.index.hideLoading();
                    common_vendor.index.showToast({
                      title: "登录失败",
                      icon: "none"
                    });
                  }
                },
                fail: () => {
                  common_vendor.index.hideLoading();
                  common_vendor.index.showToast({
                    title: "网络请求失败",
                    icon: "none"
                  });
                }
              });
            },
            fail: () => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "登录失败",
                icon: "none"
              });
            }
          }));
        }
      }));
    },
    /**
     * 请求手机号（会话有效时）
     * @param {Object} e - 事件对象
     */
    requestPhoneNumber(e = null) {
      common_vendor.index.login(new UTSJSONObject({
        provider: "weixin",
        success: (res) => {
          common_vendor.index.request({
            url: "自己的登录接口",
            data: new UTSJSONObject({
              account: "1514382701",
              jscode: res.code
            }),
            method: "POST",
            header: new UTSJSONObject({
              "content-type": "application/json"
            }),
            success: (res2) => {
              if (res2.data.r == "T") {
                common_vendor.index.setStorage({
                  key: "openid",
                  data: res2.data.openid
                });
                common_vendor.index.setStorage({
                  key: "sessionkey",
                  data: res2.data.sessionkey
                });
                common_vendor.index.setStorageSync("sessionkey", res2.data.sessionkey);
                this.decryptPhoneNumber(e, common_vendor.index.getStorageSync("sessionkey"));
              } else {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "登录失败",
                  icon: "none"
                });
              }
            },
            fail: () => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "网络请求失败",
                icon: "none"
              });
            }
          });
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "登录失败",
            icon: "none"
          });
        }
      }));
    },
    /**
     * 解密手机号
     * @param {Object} e - 事件对象
     * @param {String} sessionkey - 会话密钥
     */
    decryptPhoneNumber(e = null, sessionkey = null) {
      common_vendor.index.request({
        url: "自己的解密接口",
        data: new UTSJSONObject({
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          code: sessionkey
        }),
        method: "post",
        header: new UTSJSONObject({
          "content-type": "application/json"
        }),
        success: (res) => {
          common_vendor.index.hideLoading();
          if (res.data.r == "T") {
            this.onshow(this.openid, this.userInfo, res.data.d.phoneNumber);
            common_vendor.index.__f__("log", "at pages_AI_Login_Match/login/wechat_login.vue:547", "登录成功");
            common_vendor.index.__f__("log", "at pages_AI_Login_Match/login/wechat_login.vue:548", res.data.d.phoneNumber);
          } else {
            common_vendor.index.__f__("log", "at pages_AI_Login_Match/login/wechat_login.vue:550", res);
            common_vendor.index.showToast({
              title: "获取手机号失败",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        }
      });
    },
    /**
     * 跳转到首页
     */
    toHome() {
      router_Router.Navigator.toIndex();
    },
    /**
     * 返回上一页
     */
    goBack() {
      router_Router.Navigator.toIndex();
    },
    /**
     * 显示用户协议弹窗
     */
    showAgreement() {
      this.showAgreementModal = true;
    },
    /**
     * 显示隐私政策弹窗
     */
    showPrivacy() {
      this.showPrivacyModal = true;
    },
    /**
     * 关闭弹窗
     * @param {string} type - 要关闭的弹窗类型（'agreement'或'privacy'）
     */
    closeModal(type = null) {
      if (type === "agreement") {
        this.showAgreementModal = false;
      } else if (type === "privacy") {
        this.showPrivacyModal = false;
      }
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_assets._imports_1$2,
    c: common_assets._imports_0$3,
    d: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    e: $data.userInfo && $data.userInfo.avatarUrl ? $data.userInfo.avatarUrl : "/static/image/defaultAvatar/teacher-man.png",
    f: $data.userInfo && $data.userInfo.nickName
  }, $data.userInfo && $data.userInfo.nickName ? {
    g: common_vendor.t($data.userInfo.nickName)
  } : {}, {
    h: !$data.loginstate
  }, !$data.loginstate ? {
    i: common_assets._imports_3$1,
    j: common_vendor.o((...args) => $options.onGotUserInfo && $options.onGotUserInfo(...args))
  } : {
    k: common_vendor.o((...args) => $options.toHome && $options.toHome(...args))
  }, {
    l: common_vendor.o((...args) => $options.showAgreement && $options.showAgreement(...args)),
    m: common_vendor.o((...args) => $options.showPrivacy && $options.showPrivacy(...args)),
    n: $data.showAgreementModal
  }, $data.showAgreementModal ? {
    o: common_vendor.o(($event) => $options.closeModal("agreement")),
    p: common_vendor.o(() => {
    }),
    q: common_vendor.o(($event) => $options.closeModal("agreement"))
  } : {}, {
    r: $data.showPrivacyModal
  }, $data.showPrivacyModal ? {
    s: common_vendor.o(($event) => $options.closeModal("privacy")),
    t: common_vendor.o(() => {
    }),
    v: common_vendor.o(($event) => $options.closeModal("privacy"))
  } : {}, {
    w: $data.showModal
  }, $data.showModal ? {
    x: common_vendor.o((...args) => $options.getPhoneNumber && $options.getPhoneNumber(...args)),
    y: common_vendor.o((...args) => $options.hideModal && $options.hideModal(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages_AI_Login_Match/login/wechat_login.js.map
