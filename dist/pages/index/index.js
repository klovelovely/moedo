//index.js
//获取应用实例
var app = getApp()
Page({

  data: {
    userInfo:{},
    todoTempInput: '',
    isShowFinishedTodo: true,
    isSomeThingDone: false,
    todoList: [],
    animationData: {}
  },

  onLoad: function () {
    var that = this;

    // 获取微信用户的头像昵称信息
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
    });

    // 初始化 todo 列表数据
    this.data.todoTempInput = wx.getStorageSync('todoTempInput');
    this.data.todoList = wx.getStorageSync('todoList');
    this.setData({
      todoTempInput: this.data.todoTempInput || '',
      todoList: this.data.todoList || []
    });

    // 确认是否已经有任务已经完成了, 并更新对应状态
    this.checkIsSomeThingAlreadyDone();

  },
  // 输入未完成的 todo 自动保存以避免下次重复输入
  autoSave: function (e) {
    this.data.todoTempInput = e.detail.value;
    wx.setStorageSync('todoTempInput', e.detail.value);
  },

  // 添加 todo
  addTodo: function (e) {
    this.data.todoList.unshift({
      title: e.detail.value,
      createTime: Date.now(),
      isDone: false
    });
    this.setData({
      todoTempInput: '',
      todoList: this.data.todoList
    });
    wx.setStorageSync('todoList', this.data.todoList);

    wx.setStorageSync('todoTempInput', '');
  },

  // 切换是否显示已完成的 todo
  isShowFinishedTodo: function (e) {
    this.setData({
      isShowFinishedTodo: e.detail.value
    });
    wx.setStorageSync('isShowFinishedTodo', e.detail.value);
  },

  // todo 完成或者取消完成
  todoItemChange: function (e) {
    let currentTodoItem = this.data.todoList[e.target.dataset.index];
    currentTodoItem.isDone = !currentTodoItem.isDone;

    this.setData({
      todoList: this.data.todoList
    });
    wx.setStorageSync('todoList', this.data.todoList);

    // 确认是否已经有任务已经完成了, 并更新对应状态
    this.checkIsSomeThingAlreadyDone();
  },

  clearFinishedTodos: function (e) {
    let that = this;
    wx.showModal({
      title: '确认清除',
      content: '确认清除所有已完成的 todos? 这个行为是无法撤销的喵 :3',
      cancelText: '九豆麻袋',
      confirmText: '删了删了',
      success: function (e) {
        if (e.confirm) {
          for (var i = that.data.todoList.length - 1; i >= 0; i--) {
            var item = that.data.todoList[i];
            if (item.isDone) {
              that.data.todoList.splice(i, 1)
            }
          }
          that.setData({
            todoList: that.data.todoList
          });
          wx.setStorageSync('todoList', that.data.todoList);
          wx.showToast({
            title: '清除成功',
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },

  // 确认是否已经有任务已经完成了, 并更新对应状态
  checkIsSomeThingAlreadyDone: function (e) {
    var isAnyThingAlreadyDone = false;
    for (let item of this.data.todoList) {
      if (item.isDone) {
        isAnyThingAlreadyDone = true;
      }
    }

    this.setData({
      isSomeThingDone: isAnyThingAlreadyDone
    })

  }

})
