
//index.js
//获取应用实例
const app = getApp()

// pages/orderTime/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cacheDate: '',
    calendar: [],
    width: 0,
    currentIndex: 0,
    currentTime: 0,
    status1:"空闲",
    status2:"约满",
    timeArr: [
      { "time": "8:00-9:00", "status": "空闲" },
      { "time": "9:00-10:00", "status": "约满" },
      { "time": "10:00-11:00", "status": "约满" },
      { "time": "11:00-12:00", "status": "空闲" },
      { "time": "12:00-13:00", "status": "空闲" },
      { "time": "13:00-14:00", "status": "空闲" },
      { "time": "14:00-15:00", "status": "空闲" },
      { "time": "15:00-16:00", "status": "约满" },
      { "time": "16:00-17:00", "status": "约满" },
      { "time": "17:00-18:00", "status": "约满" },
      { "time": "18:00-19:00", "status": "空闲" },
      { "time": "19:00-20:00", "status": "空闲" },
      { "time": "20:00-21:00", "status": "空闲" }
    ]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
///
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

    function getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    }
    // 计算每月第一天是星期几
    function getFirstDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_date = date.getDate();
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    //利用构造函数创建对象
    function calendar(date, week) {
      this.date = cur_year + '-' + cur_month + '-' + date;
      if (date == cur_date) {
        this.week = "今天";
      } else if (date == cur_date + 1) {
        this.week = "明天";
      } else {
        this.week = '星期' + week;
      }
    }
    //当前月份的天数
    var monthLength = getThisMonthDays(cur_year, cur_month)
    //当前月份的第一天是星期几
    var week = getFirstDayOfWeek(cur_year, cur_month)
    var x = week;
    for (var i = 1; i <= monthLength; i++) {
      //当循环完一周后，初始化再次循环
      if (x > 6) {
        x = 0;
      }
      //利用构造函数创建对象
      that.data.calendar[i] = new calendar(i, [weeks_ch[x]][0])
      x++;
    }
    //限制要渲染的日历数据天数为7天以内（用户体验）
    var flag = that.data.calendar.splice(cur_date, that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7)
    that.setData({
      calendar: flag
    })
    //设置scroll-view的子容器的宽度
    that.setData({
      width: 186 * parseInt(that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7)
    })

    //console.log(that.data.calendar[0].date=="2019-3-1");

    db.collection('books').where({
      isFirst: true // 填入当前所需
    }).get({
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        that.setData({   //注意这里用that
          cacheDate: res.data[0].description
        })

        console.log('初查 成功，记录 _id: \n', res.data[0].tags)
        
      },
    });
    // console.log(db.collection('books').where({
    //   description: that.data.calendar[0].date // 填入当前所需
    // }))

//先不进

    console.log(that.data.cacheDate)
    
    if (that.data.cacheDate == that.data.calendar[0].date){
      console.log('进入分支');
      console.log(that.data.cacheDate);
      console.log(that.data.calendar[0].date);
      db.collection('books').where({
        description: that.data.cacheDate // 填入当前所需
      }).get({
        success(res){
          that.setData({
            cacheID: res.data[0]._id

          })
        },
        fail: console.error
      })

      db.collection('books').doc(that.data.cacheID).remove({
        success: console.log,
        fail: console.error
      })

      db.collection('books').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _id: 'todo-identifiant-aleatoire', 
          // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          description: that.data.calendar[6].date,
          //假定为7天
          isFirst: false,
          tags: [
            '空闲', '空闲', '空闲', '空闲', '空闲',
            '空闲', '空闲', '空闲', '空闲', '空闲',
            '空闲', '空闲', '空闲'
          ],
        },
        success(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log('增了！')
        },
        fail: console.error
      })

//update前查
      db.collection('books').where({
        description: that.data.calendar[0].date // 填入当前所需的新的第一天
      }).get({
        success(res) {
          that.setData({
            new1dID: res.data[0]._id

          })
        },
        fail: console.error
      })

      db.collection('books').doc(that.data.new1dID).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 tags 字段置为 a
          isFirst: true,
        },
        success(res) {
          //console.log(that.data.bind)
        console.log('增减成功！！')
        }
      })

    };


    db.collection('books').where({
      description: that.data.calendar[0].date // 填入当前所需
    }).get({

      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        that.setData({   //注意这里用that
          counterId: res.data[0]._id
          //count: 1
        })

        wx.showToast({
          title: '查询记录成功',
        })
        console.log('[数据库] [查询记录] 成功，记录 _id: \n', res.data[0].tags)
        console.log(that.data.timeArr[1].status)
        for (var i=0;i<13;i++)
        {
          that.data.timeArr[i].status = res.data[0].tags[i];
        }

        that.setData({ timeArr: that.data.timeArr})  //setdata才能更新渲染并使数据生效
        //console.log(that.data)
      },
      fail: console.error
    })

///

    //var that = this;
    
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },


  select: function (event) {
    var that=this;
    //为上半部分的点击事件
    this.setData({
      currentIndex: event.currentTarget.dataset.index
    })
    console.log(event.currentTarget.dataset.date)

    ///
    const db = wx.cloud.database()
    db.collection('books').where({
      description: that.data.calendar[0].date // 填入当前所需
    }).get({

      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        that.setData({   //注意这里用that
          counterId: res.data[0]._id
          //count: 1
        })

        wx.showToast({
          title: '查询记录成功',
        })
        console.log('[数据库] [查询记录] 成功，记录 _id: \n', res.data[0].tags)
        console.log(that.data.timeArr[1].status)
        for (var i = 0; i < 13; i++) {
          that.data.timeArr[i].status = res.data[0].tags[i];
        }

        that.setData({ timeArr: that.data.timeArr })  //setdata才能更新渲染并使数据生效
        //console.log(that.data)
      },
      fail: console.error
    })

    ///

  },

  selectTime: function (event) {
    ///
    var that = this;
    
    if (this.data.timeArr[event.currentTarget.dataset.tindex].status == "约满") {
      wx.showToast({
        title: '已被约',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
    ///
    else{
    //为下半部分的点击事件
    this.setData({
      currentTime: event.currentTarget.dataset.tindex
    })
    console.log(event.currentTarget.dataset.time)
    /*
    if (event.currentTarget.dataset.status == "约满")
    {
      wx.showToast({
        title: '已被约',
        icon: 'loading',
        duration: 1000,
        mask: true
      });
    }
    */
    }
  },

  jumpPage: function(x){
    console.log(this.data.currentTime)
    wx.navigateTo({
      ///
      url: '/pages/stat/stat?timeid=' + this.data.currentTime + '&nowdID=' + this.data.counterId,
      
      success(res) {
        //console.log(this)
      }
      ///
    })
    
    /*this.setData({
      'timeArr[q].status':"约满"
    })*/
  }

})
