<template>
  <div>
    <!-- `v-if`是vue的一个指令 -->
    <!-- `$route.path`是当前路由对象的路径，会被解析为绝对路径当 -->
    <!-- `$route.path !== '/time-entries/log-time'`为`true`是显示，`false`，为不显示。 -->
    <!-- router-lin 路由跳转地址 -->
    <router-link to="/time-entries/log-time">
      <button v-if="$route.path !== '/time-entries/log-time'" class="btn btn-primary">创建</button>
    </router-link>

    <div v-if="$route.path === '/time-entries/log-time'">
      <h3>创建</h3>
    </div>

    <hr>

    <!-- 下一级视图 -->
    <router-view></router-view>

    <div class="time-entries">
      <p v-if="!$store.state.timeEntries.length"><strong>还没有任何任务</strong></p>

      <div class="list-group">
        <!-- v-for 循环渲染 -->
        <a class="list-group-item" v-for="timeEntry in $store.state.timeEntries">
          <div class="row">

            <!-- 头像和昵称暂时写死 -->
            <div class="col-sm-2 user-details">
              <img src="https://avatars1.githubusercontent.com/u/10184444?v=3&s=460" class="avatar img-circle img-responsive" />
              <p class="text-center">
                <strong>
                  mikelkl
                </strong>
              </p>
            </div>

            <div class="col-sm-2 text-center time-block">
              <h3 class="list-group-item-text total-time">
                <i class="glyphicon glyphicon-time"></i>
                {{ timeEntry.totalTime }}
              </h3>
              <p class="label label-primary text-center">
                <i class="glyphicon glyphicon-calendar"></i> {{ timeEntry.date }}
              </p>
            </div>

            <div class="col-sm-7 comment-section">
              <p>{{ timeEntry.comment }}</p>
            </div>

            <div class="col-sm-1">
              <!-- 事件绑定简写 @xxx -->
              <button class="btn btn-xs btn-danger delete-button" @click="deleteTimeEntry(timeEntry)">
                X
              </button>
            </div>

          </div>
        </a>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    // data () {
    //   return {
    //     timeEntries: []
    //   }
    // },
    created () {
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
      this.fetchData()
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        this.$http.get('http://localhost:8888/time-entries')
        .then(function (ret) {
          // state.timeEntries = ret.data
          this.$store.commit('fetchData', ret.data)
        })
        .then(function (err) {
          console.log(err)
        })
        this.$store.state.timeEntries
      },
      deleteTimeEntry (timeEntry) {
        // 这个方法用于删除某一项计划
        // let index = this.$store.state.timeEntries.indexOf(timeEntry)
        // let _id = this.$store.state.timeEntries[index]._id
        let _id = timeEntry._id
        if (window.confirm('确认删除?')) {
          this.$http.delete('http://localhost:8888/delete/' + _id)
            .then(function (ret) {
              console.log(ret)
            })
            .then(function (err) {
              console.log(err)
            })
          // this.timeEntries.splice(index, 1)
          this.$store.commit('deleteTimeEntry', timeEntry)
        }
      }
    }
    // events: {
    //   timeUpdate (timeEntry) {
    //     this.timeEntries.push(timeEntry)
    //       // 继续向上派发
    //     return true
    //   }
    // }
  }
</script>

<style>
  .avatar {
    height: 75px;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .user-details {
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    margin: -10px 0;
  }

  .time-block {
    padding: 10px;
  }

  .comment-section {
    padding: 20px;
  }
</style>
