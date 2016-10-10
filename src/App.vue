<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="glyphicon glyphicon-time"></i> 计划表
        </a>
        <ul class="nav navbar-nav">
          <li>
            <router-link to="/home">首页</router-link>
          </li>
          <li>
            <router-link to="/time-entries">计划列表</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <div class="col-sm-3">
        <sidebar :time="$store.state.totalTime"></sidebar>
      </div>
      <div class="col-sm-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar'

  export default {
    components: {
      'sidebar': Sidebar
    },
    mounted () {
      this.$http.get('http://localhost:8888/time')
        .then(function (ret) {
          // this.totalTime = ret.data.time
          this.$store.commit('setTotalTime', ret.data.time)
        })
        .then(function (err) {
          console.log(err)
        })
    }
    // events: {
    //   timeUpdate (timeEntry) {
    //     // this.totalTime += parseFloat(timeEntry.totalTime)
    //
    //   },
    //   deleteTime (timeEntry) {
    //     this.totalTime -= parseFloat(timeEntry.totalTime)
    //   }
    // }
  }
</script>
