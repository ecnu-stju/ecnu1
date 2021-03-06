const app = getApp()
var a;
//var obj;
//const api = require('../../config/api.js');
//var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toast1Hidden: true,
    modalHidden: true,
    notice_str: '',
    store: "、、",
    address: "XXXXXXXXXXX",
    phone: "138000000000",
    date: '2018-10-01',
    //time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2018,
    endYear: 2050
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onLoad: function (x) {
    //console.log(Number(x.timeid))
    this.setData({
      timeIndex: Number(x.timeid),
      //counterId: x.counterId
    })
    //console.log(this.data);

    var that = this;

    wx.cloud.init()
    const db = wx.cloud.database()

    if (!this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            //step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    }
  },


  ///
  /*
  onLoad: function () {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  */
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      date: e.detail.value
    })
    console.log(that.data.date);
  },
  //提交信息
  formSubmit: function (e) {
    //表单校验
    if (!this.checkForm(e)) {
      return false;
    }
    var that = this;
    var formData = e.detail.value;
    //提交表单
    wx.request({
      url: api.INFO,//提交路径
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.code)
        console.log(res.data.msg)
        if (res.data.code == 200) {
          wx.showToast({
            title: '预约成功',
            icon: 'succes',
            duration: 2000,
            mask: true
          })
        } else {
          wx.showToast({
            title: '服务器忙，请稍后再试',
            icon: 'succes',
            duration: 2000,
            mask: true
          })
        }

        //清空表单
        that.setData({
          username: '',
          phone1: '',
          count: ''
        })
      }
    })
  },
  // callPhone: function () {
  //   wx.makePhoneCall({
  //     phoneNumber: '13400000000' //需要拨打的电话号码
  //   })
  // },
  to_map: function () {
    console.log("map");
    wx.navigateTo({
      url: '/pages/map/map'
    })
  }, formBindsubmit: function (e) {
    if (e.detail.value.username.length == 0 || e.detail.value.phone.length == 0) {
      wx.showToast({
        title: '姓名或电话不为空',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
  },
  checkForm: function (e) {
    if (e.detail.value.username.length == 0) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return false;
    }
    var myreg = /^[1][0][0-9]{9}$/;
    if (!myreg.test(e.detail.value.phone)) {
      wx.showToast({
        title: '学号格式有误',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (e.detail.value.enterdate.length == 0) {
      wx.showToast({
        title: "请选择日期",
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return false;
    }
    if (e.detail.value.count.length == 0) {
      wx.showToast({
        title: "请填写人数",
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return false;
    }
    return true;
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  //小程序转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/index1/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功")
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  },

  ///
  submiANDback: function (res) {
    const db = wx.cloud.database()
    //console.log(this.data.counterId)


    var that = this
    db.collection('books').doc(that.data.counterId).get({

      success(res) {

        var b = res.data.tags;
        // obj = JSON.stringify(res.data.tags)
        // a = JSON.parse(obj)
        //console.log(that.data.timeIndex)
        b[that.data.timeIndex] = '约满';
        a = JSON.stringify(res.data.tags);
        that.setData({ bind: JSON.parse(a) });
        //console.log(a)

      },
    });



    db.collection('books').doc(this.data.counterId).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 tags 字段置为 a
        tags: that.data.bind,
      },
      success(res) {
        //console.log(that.data.bind)
        wx.showToast({
          title: '成功',
          duration: 1000,
        })
        wx.navigateTo({
          url: '/pages/index1/index',
        })
      }
    })

  }

})
