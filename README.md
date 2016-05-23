# (1/2)Vue构建单页应用最佳实战

---

## 前言

我们将会选择使用一些vue周边的库

> 1.使用node.js后台，了解到如何获取数据

> 2.实现单页路由

> 3.实现HTTP请求我们的node

> 4.单项数据流

> 5.使用.vue文件进行开发

最终我们将会构建出一个小demo，不废话，直接上图。
![](http://7xim8z.com1.z0.glb.clouddn.com/vue-tutorial-4.png)


## 安装

1.我们将会使用webpack去为我们的模块打包，预处理，热加载。如果你对webpack不熟悉，它就是可以帮助我们把多个js文件打包为1个入口文件，并且可以达到按需加载。这就意味着，我们不用去担心由于太多的组件，导致了过多的HTTP请求，这是非常有益于产品体验的。但，我们并不只是为了这个而使用webpack，我们需要用webpack去编译.vue文件，如果没有使用一个loader去转换我们.vue文件里的style，js，html，那么浏览器就无法识别。

2.模块热加载是webpack的一个非常碉堡的特性，将会为我们的单页应用带来极大的便利。
通常来说，当我们修改了代码刷新页面，那应用里的所有状态就都没有了。这对于开发一个单页应用来说是非常痛苦的，因为需要重新在跑一遍流程。如果有模块热加载，当你修改了代码，你的代码会直接修改，页面并不会刷新，所以状态也会被保留。

3.Vue也为我们提供了CSS预处理，所以我们可以选择在.vue文件里写LESS或者SASS去代替原生CSS。

4.我们过去通常需要使用npm下载一堆的依赖，但是现在我们可以选择Vue-cli。这是一个vue生态系统中一个伟大创举。这意味着我们不需要手动构建我们的项目，而它就可以很快地为我们生成。

首先，安装vue-cli。(确保你有node和npm)

`npm i -g vue-cli`

然后创建一个webpack项目并且下载依赖

`vue init webpack vue-time-tracker`
`cd vue-time-tracker`
`npm i`

接着使用 `npm run dev` 在热加载中运行我们的应用

这一行命令代表着它会去找到`package.json`的`scripts`对象，执行`node bulid/dev-server.js`。在这文件里，配置了Webpack，会让它去编译项目文件，并且运行服务器，我们在`localhost:8080`即可查看我们的应用。

![](https://cdn.scotch.io/9/vFba0QgQRReyNZPgFpKU_vue-time-1.png)

这些都准备好后，我们需要为我们的路由和XHR请求下载两个库，我们可以从vue的官网中找到他们。

`npm i vue-resource vue-router --save`

### 初始化（main.js）

查看我们的应用文件，我们可以在src目录下找到`App.vue`和`main.js`。在`main.js`文件中，我们引入`Vue`和`App`，并且创建了一个vue的实例（因为在router这行引入了App组件`router.start(App, '#app')`）

```javascript
// src/main.js

import Vue from 'vue'
import App from './App.vue'
import Hello from './components/Hello.vue'

import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

//注册两个插件
Vue.use(VueResource)
Vue.use(VueRouter)

const router = new VueRouter()

// 路由map
router.map({
  '/hello': {
    component: Hello
  }
})

router.redirect({
  '*': '/hello'
})

router.start(App, '#app')
```

我们还需要在`index.html`包裹下我们的`<app></app>`

```html
//index.html

<div id="app">
    <app></app>
</div>
```

我们的初始化就到这结束了，接下来让我们开始创建别的组件。


### 创建首页 View

首先，我们需要为我们的应用增加下bootstrap.css，为了方便，在这就直接在头部引入CDN。

```html
<head>
  <meta charset="utf-8">
  <title>计划板</title>
  <link href="//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
</head>
```

接着在App.vue里为我们的应用写个顶部导航。

```js
// src/App.vue

<template>
  <div id="wrapper">
    <nav class="navbar navbar-default">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="glyphicon glyphicon-time"></i>
          计划表
        </a>
        <ul class="nav navbar-nav">
          <li><a v-link="'/home'">首页</a></li>
          <li><a v-link="'/time-entries'">计划列表</a></li>
        </ul>
      </div>
    </nav>
    <div class="container">
      <div class="col-sm-3">

      </div>
      <div class="col-sm-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
```

除了我们的`navbar`以外，我们还需要一个`.container`去放我们其余需要展示的信息。
并且在这里我们要放一个`router-view`标签，`vue-router`的切换就是通过这个标签开始显现的。

接着，我们需要创建一个`Home.vue`作为我们的首页

```js
// src/components/Home.vue

<template>
  <div class="jumbotron">
    <h1>任务追踪</h1>
    <p>
      <strong>
        <a v-link="'/time-entries'">创建一个任务</a>
      </strong>
    </p>
  </div>
</template>
```

既然我们需要显示Home，那就需要开始配置路由，这很简单，只需要在`main.js`里把`Hello.vue`换为`Home.vue`即可

```js
//...
router.map({
  '/Home': {
    component: Home
  }
})

router.redirect({
  '*': '/Home'
})
```

![](http://7xim8z.com1.z0.glb.clouddn.com/vue-tutorial-1.png)


### 创建 任务列表 View

在这个页面，我们需要去创建我们的时间跟踪列表。

> PS:现在这个页面没有数据，之后我们会在后台配置

```js

// src/components/TimeEntries.vue

<template>
  <div>
    //`v-if`是vue的一个指令
    //`$route.path`是当前路由对象的路径，会被解析为绝对路径当
    //`$route.path !== '/time-entries/log-time'`为`true`是显示，`false`，为不显示。
    //v-link 路由跳转地址
    <button
      v-if="$route.path !== '/time-entries/log-time'"
      v-link="'/time-entries/log-time'"
      class="btn btn-primary">
      创建
    </button>

    <div v-if="$route.path === '/time-entries/log-time'">
      <h3>创建</h3>
    </div>

    <hr>

    //下一级视图
    <router-view></router-view>

    <div class="time-entries">
      <p v-if="!timeEntries.length"><strong>还没有任何任务</strong></p>

      <div class="list-group">
        //v-for 循环渲染
        <a class="list-group-item" v-for="timeEntry in timeEntries">
          <div class="row">

            <div class="col-sm-2 user-details">
            //`:src`属性，这个是vue的属性绑定简写`v-bind`可以缩写为`:` 比如a标签的`href`可以写为`:href`并且在vue的指令里就一定不要写插值表达式了(`:src={{xx}}`)，vue自己会去解析
              <img :src="timeEntry.user.image" class="avatar img-circle img-responsive" />
              <p class="text-center">
                <strong>
                  {{ timeEntry.user.name }}
                </strong>
              </p>
            </div>

            <div class="col-sm-2 text-center time-block">
              <h3 class="list-group-item-text total-time">
                <i class="glyphicon glyphicon-time"></i>
                {{ timeEntry.totalTime }}
              </h3>
              <p class="label label-primary text-center">
                <i class="glyphicon glyphicon-calendar"></i>
                {{ timeEntry.date }}
              </p>
            </div>

            <div class="col-sm-7 comment-section">
              <p>{{ timeEntry.comment }}</p>
            </div>

            <div class="col-sm-1">
              <button
                class="btn btn-xs btn-danger delete-button"
                //事件绑定简写 @xxx
                @click="deleteTimeEntry(timeEntry)">
                X
              </button>
            </div>

          </div>
        </a>

      </div>
    </div>
  </div>
</template>
```

关于template的解释，都写在一起了，再看看我们的`script`

```js
// src/components/TimeEntries.vue

<script>
  export default {
    data () {
      // 事先模拟一个数据
      let existingEntry = {
        user: {
          name: '二哲',
          email: 'kodo@forchange.cn',
          image: 'https://sfault-avatar.b0.upaiyun.com/888/223/888223038-5646dbc28d530_huge256'
        },
        comment: '我的一个备注',
        totalTime: 1.5,
        date: '2016-05-01'
      }

      return {
        timeEntries: [existingEntry]
      }
    },
    methods: {
      deleteTimeEntry (timeEntry) {
        //这个方法用于删除某一项计划
        let index = this.timeEntries.indexOf(timeEntry)
        if (window.confirm('确定要删除吗?')) {
          this.timeEntries.splice(index, 1)
          //这里会派发到父组件上，执行父组件events里的deleteTime方法
          this.$dispatch('deleteTime', timeEntry)
        }
      }
    },
    events: {
      timeUpdate (timeEntry) {
        this.timeEntries.push(timeEntry)
        //继续向上派发
        return true
      }
    }
  }
</script>
```

别忘了为我们的组件写上一些需要的样式
```js
// src/components/TimeEntries.vue

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
```

由于新增了页面，所以我们继续配置我们的路由

```js
// src/main.js

import TimeEntries from './components/TimeEntries.vue'

//...

router.map({
  '/home': {
    component: Home
  },
  '/time-entries': {
    component: TimeEntries
  }
})

//...
```

![](http://7xim8z.com1.z0.glb.clouddn.com/vue-tutorial-2.png)


### 创建任务组件

这个比较简单我们直接给出代码

```js
// src/components/LogTime.vue

<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>日期</label>
        <input
          type="date"
          class="form-control"
          v-model="timeEntry.date"
          placeholder="Date"
        />
      </div>
      <div class="col-sm-6">
        <label>时间</label>
        <input
          type="number"
          class="form-control"
          v-model="timeEntry.totalTime"
          placeholder="Hours"
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
          placeholder="Comment"
        />
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <button v-link="'/time-entries'" class="btn btn-danger">取消</button>
    <hr>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        //模拟一个默认值
        timeEntry: {
          user: {
            name: '二哲',
            email: 'kodo@forchange.cn',
            image: 'https://sfault-avatar.b0.upaiyun.com/888/223/888223038-5646dbc28d530_huge256'
          }
        }
      }
    },
    methods: {
      save () {
          let timeEntry = this.timeEntry
          this.$dispatch('timeUpdate', timeEntry)
          this.timeEntry = {}
        }
    }
  }
</script>

```

这个组件很简单就3个input输入而已，然后就两个按钮，保存我们就把数据push进我们的列表里，并且初始化我们的timeEntry。取消的话，我们就路由定位到`/time-entries`即可。

> ps:按理来说我们应该是要填写6个数据包括名字，邮箱和头像。但这里为了演示就暂时先这样。以后结合后台我们会继续完善这里。

`LogTime`属于我们`TimeEntries`组件的一个子路由，所以我们依旧需要配置下我们的`router.map`

```js
// src/main.js

import LogTime from './components/LogTime.vue'

//...

router.map({
  '/home': {
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

//...
```

![](http://7xim8z.com1.z0.glb.clouddn.com/vue-tutorial-3.png)

### 创建侧边栏组件

目前我们首页左侧还有一块空白，我们需要它放下一个侧边栏去统计所有计划的总时间。

```js
// src/App.vue

  //...

  <div class="container">
    <div class="col-sm-3">
      <sidebar :time="totalTime"></sidebar>
    </div>
    <div class="col-sm-9">
      <router-view></router-view>
    </div>
  </div>

  //...
```

由于我们把总时间存放在最上级的父组件上，所以我们需要把我们的总时间传入我们的`sidebar`组件。

在写下我们的两个时间计算方法

```js
<script>
  import Sidebar from './components/Sidebar.vue'

  export default {
    components: { 'sidebar': Sidebar },
    data () {
      return {
        totalTime: 1.5
      }
    },
    events: {
      timeUpdate (timeEntry) {
        this.totalTime += parseFloat(timeEntry.totalTime)
      },
      deleteTime (timeEntry) {
        this.totalTime -= parseFloat(timeEntry.totalTime)
      }
    }
  }
</script>
```

最后给出我们`Sidebar.vue`
```
<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h1 class="text-center">已有时长</h1>
    </div>

    <div class="panel-body">
      <h1 class="text-center">{{ time }} 小时</h1>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['time']
  }
</script>
```

`props`就是vue中传值的写法，不仅要在我们自定义的标签上传入`<sidebar :time="totalTime"></sidebar> `，还需要在组件里js里定义`props: ['time']`


### 最后

本章，我们可以学习到许多关于vue的特性。

1.了解了vue-cli脚手架

2.初步对webpack有了一些了解和认识

3.如何用.vue愉快的开发

4.父子组件通信

5.路由（子路由）的应用


> 下一章，我们将会结合node学习vue-resource，更好的完善我们SPA应用


## 番外篇

> 我看很多人都不知道如何引入bootstrap,我就在这加了一下

首先npm i jquery bootstrap style-loader --save-dev;

然后我修改了两个文件 第一个是 `webpack.base.conf.js` 我把module都改了

最后我们在入口js文件里加三行代码

`import 'jquery'`
`import 'bootstrap/dist/css/bootstrap.css'`
`import 'bootstrap/dist/js/bootstrap'`

在npm run dev 看看页面吧! 在head里会有一个style全是bootstrap的代码.别忘了把index.html里的第三方bootstrap注释了.

在我这次更新的代码里,我已经把引用第三方代码删了.


# (2/2)Vue构建单页应用最佳实战

## 前言

> 本章节，将会把所有的请求全写为跨域请求。不知道为什么，很多人一用了框架就会不知所措。给大家一个忠告，享受框架带来的便利，别忘了时刻提醒自己学好基础知识。

先把一些不必要的代码删了。

```js
//TimeEntries.vue 的模拟数据代码
data () {
  // 模拟下初始化数据
  /*let existingEntry = {
    comment: '我的第一个任务',
    totalTime: 1.5,
    date: '2016-05-01'
  }*/
  return {
    timeEntries: []
  }
},
//头像和昵称暂时写死
<div class="col-sm-2 user-details">
  <img src="https://avatars1.githubusercontent.com/u/10184444?v=3&s=460" class="avatar img-circle img-responsive" />
  <p class="text-center">
    <strong>
      二哲
    </strong>
  </p>
</div>


//LogTime.vue里的模拟数据代码
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
```

> 我们将专注3个字段的增删改查，任务时间，持续时间，备注。

## 正文

我们的数据交互其实很简单，所以我在这选择使用大家最熟悉的`express`和`mongodb`，在一个`app.js` 文件里完成所有的`controller`。

首先，安装几个必要的包`npm i express mongodb morgan body-parser --save-dev;`

简单解释下Morgan和body-parser，其实就是一个log美化和解析参数。具体大家可以google下。

在我们的根目录下，创建`app.js`初始化以下代码

```js
//app.js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/mission';
var _db;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('dist'));

MongoClient.connect(mongoUrl, function (err, db) {
  if(err) {
    console.error(err);
    return;
  }

  console.log('connected to mongo');
  _db = db;
  app.listen(8888, function () {
    console.log('server is running...');
  });
});
```

解释下mongoUrl这行`mongodb://localhost:27017/mission` 连接相应的端口，并且使用mission表。此时你是没有`mission`数据库的，这不用在意。在我们后续操作中，它将会自动创建一个mission数据库。

上面代码的意思是，我们创建我们的一个mongo连接，当数据库连接上了后再启动我们的服务器。

接着先启动我们的mongo服务。在命令行里 `sudo mongo` 。

![](http://7xim8z.com1.z0.glb.clouddn.com/vue-tutorial-2-1.png)

如果你用得是webstrom编辑器，可以直接运行`app.js`，如果是命令行，那就使用 `node app.js`

如果看见命令行输出了 `connected to mongo` `server is running...` 就可以在`8888`端口访问我们的应用了。（在这之前别忘了build你的代码）

由于我们讲得是跨域，所以我们讲在我们的dev环境下完成所有的请求。`npm run dev`

关闭我们的8888端口页面，进入8080端口的开发环境。

写下我们第一个创建任务的请求。

```js
//app.js

//使用post方法
app.post('/create', function(req, res, next) {
    //接收前端发送的字段
  var mission = req.body;
  //选择一个表my_mission 此时没有没关系，也会自动创建
  var collection = _db.collection('my_mission');
    //如果我们需要的字段不存在，返回前端信息
  if(!mission.comment || !mission.totalTime || !mission.date) {
    res.send({errcode:-1,errmsg:"params missed"});
    return;
  }
    //如果存在就插入数据库，返回OK
  collection.insert({comment: mission.comment, totalTime: mission.totalTime,date:mission.date}, function (err, ret) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.send({errcode:0,errmsg:"ok"});
    }
  });
});
```

修改下我们的`LogTime.vue`

```js
//LogTime.vue
<button class="btn btn-primary" @click="save()">保存</button>

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

```

输入好内容，点击保存按钮，会发现报了个错。这其实就是最常见的跨域请求错误。

![](http://7xim8z.com1.z0.glb.clouddn.com/vue-tutorial-2-2.png)
![](http://7xim8z.com1.z0.glb.clouddn.com/vue-tutorial-2-3.png)
但是我们明明写得是`post`请求为什么显示得是`options`呢？

这其实是跨域请求前会先发起的一个`options`请求，需要先问问服务端，我需要一些操作可以吗？如果服务端那里是允许的，才会继续让你发送`post`请求。

我不知道那些使用`vue-resource`各种姿势也想满足跨域请求的人是怎么想的。想上天吗？

所以我们需要服务端配置，而不是前端。

```js
//app.js
app.all("*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

```

`Access-Control-Allow-Origin`是设置你的来源域名，写`*`是很危险的操作。所以我们可以直接写成我们所需的域名和端口，别人就没法请求了。

另外几行就不解释了，一看就懂。

不出意外，可以发现发送了options后，马上发送了post，然后就创建成功了。看下mongo的表，也多了一条记录。

接着来让我们一口气写完剩下的三个请求。列表渲染，删除计划，获取总时长。

```js
//app.js
var ObjectID = require('mongodb').ObjectID

//获取总时长
app.get('/time', function(req, res, next) {
    //获取数据表
  var collection = _db.collection('my_mission');
  var time = 0;
  //查询出所有计划
  collection.find({}).toArray(function (err, ret) {
    if(err) {
      console.error(err);
      return;
    }
    //所有计划累加时长
    ret.forEach(function (item, index) {
      time += +item.totalTime;
    });
    //返回时长
    res.json({errcode:0,errmsg:"ok",time:time});
  });
});

//获取列表
app.get('/time-entries', function(req, res, next) {
  var collection = _db.collection('my_mission');
  collection.find({}).toArray(function (err, ret) {
    if(err) {
      console.error(err);
      return;
    }
    res.json(ret);
  });
});

//删除计划
app.delete('/delete/:id', function (req, res, next) {
  var _id = req.params.id;
  var collection = _db.collection('my_mission');
  console.log(_id)
  //使用mongodb的唯一ObjectId字段查找出对应id删除记录
  collection.remove({_id: new ObjectID(_id)} ,function (err, result) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.send({errcode:0,errmsg:"ok"});
    }
  });
});
```
前端部分

```js
//App.vue
ready() {
    this.$http.get('http://localhost:8888/time')
      .then(function(ret) {
        this.totalTime = ret.data.time;
      })
      .then(function(err) {
        console.log(err);
      })
},
```
```js
//TimeEntries.vue
route : {
  data(){
    this.$http.get('http://localhost:8888/time-entries')
      .then(function(ret) {
        this.timeEntries = ret.data;
      })
      .then(function(err) {
        console.log(err);
      })
  }
},
```
```js
//TimeEntries.vue
<div class="col-sm-1">
  <button
    class="btn btn-xs btn-danger delete-button"
    @click="deleteTimeEntry(timeEntry)">
    X
  </button>
</div>

deleteTimeEntry (timeEntry) {
    // 删除
    let index = this.timeEntries.indexOf(timeEntry)
    let _id = this.timeEntries[index]._id
    if (window.confirm('确认删除?')) {
      this.$http.delete('http://localhost:8888/delete/' + _id)
        .then(function(ret) {
          console.log(ret);
        })
        .then(function(err) {
          console.log(err)
        });
      this.timeEntries.splice(index, 1)
      this.$dispatch('deleteTime', timeEntry)
    }
}

```


## 完结

到此，我们就将我们整个应用完成了。新增创建删除都可用了。

本来还想有上传头像等，那样觉得更多的是偏后端教学。既然我们是vue的简单入门教程就不过多介绍。

本系列让大家轻松的了解学习了vue,vue-router,vue-resource,express,mongodb的运用。

还是那句话，享受框架带来便利的同时，别忘了加强基础的训练。基本功才是真正的王道啊。玩电竞的玩家一定深有体会。

> 最后给有兴趣的同学留下两个简单的作业
    1.完成头像昵称的字段
    2.完成修改操作

源码地址：https://github.com/MeCKodo/vue-tutorial






