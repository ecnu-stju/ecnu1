// pages/stat/stat.js
const app = getApp();
var a;
//var obj;
//const api = require('../../config/api.js');
//var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({
  data: {
    motto: 'Hello World',
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

  ///
  onLoad: function (x) {
    //console.log(Number(x.timeid))
    this.setData({
      timeIndex: Number(x.timeid),
      counterId: x.nowdID
    })
    //console.log(this.data);
    

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
  // bindDateChange: function (e) {
  //   var that = this;
  //   that.setData({
  //     date: e.detail.value
  //   })
  //   console.log(that.data.date);
  // },
  //提交信息
  formSubmit: function (e) {
    //表单校验
    if (!this.checkForm(e)) {
      return false;
    }
    var that = this;
    var formData = e.detail.value;

    //提交表单
    ///
    const db = wx.cloud.database()
    //console.log(this.data)


    //var that = this
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



    db.collection('books').doc(that.data.counterId).update({
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
        });
        setTimeout(function () {
        wx.reLaunch({
          url: '/pages/index1/index',
        });
        },1000);
        //清空表单
        // that.setData({
        //   username: '',
        //   phone1: '',
        //   count: ''
        // })
      }
    })
    ///
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
    // if (e.detail.value.enterdate.length == 0) {
    //   wx.showToast({
    //     title: "请选择日期",
    //     icon: 'loading',
    //     duration: 1000,
    //     mask: true
    //   })
    //   return false;
    // }
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
  // submiANDback: function (res) {
  //   const db = wx.cloud.database()
  //   //console.log(this.data.counterId)

    
  //   var that = this
  //   db.collection('books').doc(that.data.counterId).get({
     
  //     success(res) {
        
  //       var b = res.data.tags;
  //       // obj = JSON.stringify(res.data.tags)
  //       // a = JSON.parse(obj)
  //       //console.log(that.data.timeIndex)
  //       b[that.data.timeIndex] = '约满';
  //       a = JSON.stringify(res.data.tags);
  //       that.setData({ bind: JSON.parse(a)});
  //       //console.log(a)
        
  //     },
  //   });
    
    

  //   db.collection('books').doc(this.data.counterId).update({
  //     // data 传入需要局部更新的数据
  //     data: {
  //       // 表示将 tags 字段置为 a
  //       tags: that.data.bind,
  //     },
  //     success(res) {
  //       //console.log(that.data.bind)
  //       wx.showToast({
  //         title: '成功',
  //       })
  //       wx.navigateTo({
  //         url: '/pages/index1/index',
  //       })
  //     }
  //   })
  
  // }

  ///
})