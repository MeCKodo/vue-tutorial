// import 'bootstrap/dist/css/bootstrap.css'


import Vue from 'vue'
import App from './App.vue'
import Home from './components/Home.vue'
import TimeEntries from './components/TimeEntries.vue'
import LogTime from './components/LogTime.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import 'jquery'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap'
// We want to apply VueResource and VueRouter
// to our Vue instance
Vue.use(VueResource)
Vue.use(VueRouter)

const router = new VueRouter()

// Pointing routes to the components they should use
router.map({
  '/Home': {
    component: Home
  },
  '/time-entries': {
    component: TimeEntries,
    subRoutes: {
      '/log-time': {
        component: LogTime
      }
    }
  }
})

// Any invalid route will redirect to home
router.redirect({
  '*': '/Home'
})

router.start(App, '#app')
