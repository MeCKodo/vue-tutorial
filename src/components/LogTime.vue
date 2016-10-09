// src/components/LogTime.vue

<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>日期</label>
        <input type="date" class="form-control" v-model="timeEntry.date" placeholder="Date" />
      </div>
      <div class="col-sm-6">
        <label>时间</label>
        <input type="number" class="form-control" v-model="timeEntry.totalTime" placeholder="Hours" />
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <label>备注</label>
        <input type="text" class="form-control" v-model="timeEntry.comment" placeholder="Comment" />
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <!-- <button v-link="'/time-entries'" class="btn btn-danger">取消</button> -->
    <router-link to="/time-entries"><button v-link="'/time-entries'" class="btn btn-danger">取消</button></router-link>
    <hr>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        timeEntry: {}
      }
    },
    methods: {
      save () {
        this.$http.post('http://localhost:8888/create', {
          comment: this.timeEntry.comment,
          totalTime: this.timeEntry.totalTime,
          date: this.timeEntry.date
        }).then(function (ret) {
          console.log(ret)
          let timeEntry = this.timeEntry
          console.log(timeEntry)
          // this.$dispatch('timeUpdate', timeEntry)
          this.$store.commit('timeUpdate', timeEntry)
          this.timeEntry = {}
        })
      }
    }
  }
</script>
