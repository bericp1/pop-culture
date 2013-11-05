var express         = require('express'),
  http              = require('http'),
//  validate          = require('mongoose-validate'),
  mongoose          = require('mongoose'),
  path              = require('path'),
  rroute            = require('./lib/rroute'),
  rmodel            = require('./lib/rmodel'),
  connectLivereload = require('connect-livereload'),
  socketIO          = require('socket.io');

require('express-mongoose');

//Export
var app = module.exports = express();

var server = http.createServer(app);

var io = socketIO.listen(server);

//Configuration
app.set('port',       process.env.PORT || 8000);
app.set('env',        process.env.NODE_ENV || 'development');
app.set('moreToLog',  '');
app.set('mongoURI',   process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pop-culture');
app.set('routesDir',  path.join(__dirname, 'routes'));
app.set('modelsDir',  path.join(__dirname, 'models'));
app.set('tmpDir',     '.tmp');
app.set('publicDir',  'public');

//Create DB Connection
mongoose.connect(app.get('mongoURI'));
var conn = mongoose.connection;
conn.on('error', function(err){
  'use strict';
  console.error('DB connection error:', err);
  app.use(function(req,res){
    res.status(500);
    res.send('DB connection error');
  });
});

conn.once('open', function(){
  'use strict';

  //Load Mongoose models
  var modelsToLoad = rmodel(app.get('modelsDir'));

  modelsToLoad.forEach(function(v){
    var metaModel = require(path.join(app.get('modelsDir'),v));
    if(metaModel.hasOwnProperty('name') && metaModel.hasOwnProperty('schema')){
      mongoose.model(metaModel.name, new mongoose.Schema(metaModel.schema));
    }
  });

  //Production Middleware
  if(app.get('env') === 'production'){
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.static(path.join(__dirname, app.get('publicDir'))));
    app.use(app.router);
    app.use(express.errorHandler());
    app.use(rroute(app.get('routesDir')));
    app.set('io log level', 0);
  }
//Development Middleware
  else if(app.get('env') === 'development'){
    app.use(connectLivereload());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.static(path.join(__dirname, app.get('tmpDir'))));
    app.use(express.static(path.join(__dirname, app.get('publicDir'))));
    app.use(app.router);
    app.use(express.errorHandler());
    app.use(rroute(app.get('routesDir')));
    app.set('io log level', 3);
  }

  //Socket.io logic. Probs needs to go somewhere else but yolo nuggets

  io.set('log level', app.get('io log level'));
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);

  io.sockets.on('connection', function(socket){
    socket.on('qstart', function(msg){
      io.sockets.emit('qstart', msg);
    });
    socket.on('qend', function(msg){
      io.sockets.emit('qend', msg);
    });
    socket.on('qwon', function(msg){
      io.sockets.emit('qwon', msg);
    });
    socket.on('qlost', function(msg){
      io.sockets.emit('qlost', msg);
    });
    socket.on('iwon', function(msg){
      io.sockets.emit('iwon', msg);
    });
  });

//Start Listening
  server.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.\n', app.get('moreToLog'));
  });
});