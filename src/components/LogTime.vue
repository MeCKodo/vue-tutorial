<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>日期</label>
        <input
          type="date"
          class="form-control"
          v-model="timeEntry.date"
          placeholder="日期"
        />
      </div>
      <div class="col-sm-6">
        <label>所需时间</label>
        <input
          type="number"
          class="form-control"
          v-model="timeEntry.totalTime"
          placeholder="所需时间"
        />
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <label>备注</label>
        <input
          type="text"
          class="form-control"
          v-model="timeEntry.comment"
          placeholder="备注"
        />
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <button v-link="'/time-entries'" class="btn btn-danger">取消</button>
    <hr>
  </div>
</template>
<style>

</style>
<script>

    export default{
      data () {
        return {
          timeEntry: {
            /*user: {
              name: '二哲',
              email: 'kodo@forchange.cn',
              image: 'https://sfault-avatar.b0.upaiyun.com/888/223/888223038-5646dbc28d530_huge256'
            },*/
          }
        }
      },
      methods: {
        save () {
          this.$http.post('http://localhost:8888/create',{
            comment : this.timeEntry.comment,
            totalTime : this.timeEntry.totalTime,
            date : this.timeEntry.date
          }).then(function(ret) {
            console.log(ret);
            let timeEntry = this.timeEntry
            console.log(timeEntry);
            this.$dispatch('timeUpdate', timeEntry)
            this.timeEntry = {}
          })

        }
      }
    }
</script>
