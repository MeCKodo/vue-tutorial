var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var ObjectID = require('mongodb').ObjectID

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

app.get('/time', function(req, res, next) {
  var collection = _db.collection('my_mission');
  var time = 0;
  collection.find({}).toArray(function (err, ret) {
    if(err) {
      console.error(err);
      return;
    }

    ret.forEach(function (item, index) {
      time += +item.totalTime;
    });
    res.json({errcode:0,errmsg:"ok",time:time});
  });
});

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

app.post('/create', function(req, res, next) {
  var mission = req.body;
  var collection = _db.collection('my_mission');

  if(!mission.comment || !mission.totalTime || !mission.date) {
    res.send({errcode:-1,errmsg:"params missed"});
    return;
  }

  collection.insert({comment: mission.comment, totalTime: mission.totalTime,date:mission.date}, function (err, ret) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.send({errcode:0,errmsg:"ok"});
    }
  });
});

app.delete('/delete/:id', function (req, res, next) {
  var _id = req.params.id;
  var collection = _db.collection('my_mission');
  console.log(_id)
  collection.remove({_id: new ObjectID(_id)} ,function (err, result) {
    if(err) {
      console.error(err);
      res.status(500).end();
    } else {
      res.send({errcode:0,errmsg:"ok"});
    }
  });
});


