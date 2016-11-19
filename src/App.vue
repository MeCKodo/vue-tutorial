<template>
  <div id="wrapper">
    <nav class="navbar navbar-default">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="glyphicon glyphicon-time"></i>
          计划板
        </a>
        <ul class="nav navbar-nav">
          <li><a v-link="'/home'">首页</a></li>
          <li><a v-link="'/time-entries'">计划列表</a></li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <div class="col-sm-3">
        <sidebar :time="totalTime"></sidebar>
      </div>
      <div class="col-sm-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import Sidebar from './components/Sidebar.vue'

  export default {
    components: { Sidebar },
    ready() {
        this.$http.get('http://localhost:8888/time')
          .then(function(ret) {
            this.totalTime = ret.data.time;
          })
          .then(function(err) {
            console.log(err);
          })
    },
    data () {
      return {
        totalTime: 0
      }
    },
    events: {
      timeUpdate (timeEntry) {
        console.log(timeEntry);
        this.totalTime += parseFloat(timeEntry.totalTime)
      },
      deleteTime (timeEntry) {
        this.totalTime -= parseFloat(timeEntry.totalTime)
      }
    }
  }
</script>
<style>

</style>
