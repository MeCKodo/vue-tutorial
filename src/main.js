// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Vuex from 'vuex'

// 注册3个插件
Vue.use(Vuex)
Vue.use(VueResource)
// 0. 如果使用模块化机制编程， 要调用 Vue.use(VueRouter)
Vue.use(VueRouter)

const store = new Vuex.Store({
  state: {
    timeEntries: [],
    totalTime: 0
  },
  mutations: {
    setTotalTime (state, time) {
      state.totalTime = time
    },
    timeUpdate (state, timeEntry) {
      // mutate state
      state.timeEntries.push(timeEntry)
      state.totalTime += parseFloat(timeEntry.totalTime)
    },
    fetchData (state, data) {
      state.timeEntries = data
    },
    deleteTimeEntry (state, timeEntry) {
      state.totalTime -= parseFloat(timeEntry.totalTime)

      let index = state.timeEntries.indexOf(timeEntry)
      state.timeEntries.splice(index, 1)
    }
  }
})

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
import Home from './components/Home'
import TimeEntries from './components/TimeEntries'
import LogTime from './components/LogTime'

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点在讨论嵌套路由。
const routes = [{
  path: '/Home',
  component: Home
}, {
  path: '/time-entries',
  component: TimeEntries,
  children: [{
    path: 'log-time',
    component: LogTime
  }]
}, {
  path: '*',
  redirect: '/Home'
}]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
new Vue({
  router,
  // ES6新语法，箭头函数
  store,
  render: h => h(App)
}).$mount('#app')

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   // router,
//   render: h => h(App)
// })
