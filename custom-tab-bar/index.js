// tabBarComponent/tabBar.js
const app = getApp();

Component({
  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model.includes("iPhone X"),
    selected: 0,
    backgroundColor: "#f05d70",
    color: "#fff",
    selectedColor: "#fff",
    list: [{
        pagePath: "/pages/h2-order/list-order/list-order",
        iconPath: "icon/tab-list.png",
        selectedIconPath: "icon/tab-list.png",
        text: "首页"
      },
      {
        pagePath: "/pages/h2-order/registered-order/registered-order",
        iconPath: "icon/tab-registered.png",
        selectedIconPath: "icon/tab-registered.png",
        text: "已报名"
      },
      {
        pagePath: "/pages/h2-account/home/home",
        iconPath: "icon/tab-home.png",
        selectedIconPath: "icon/tab-home.png",
        text: "我的"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      console.log(e)
      const data = e.currentTarget.dataset
      this.setData({
        selected: data.index
      })
    }
  }
})