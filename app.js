var express         = require('express'),
//  validate          = require('mongoose-validate'),
  mongoose          = require('mongoose'),
  path              = require('path'),
  rroute            = require('./lib/rroute'),
  rmodel            = require('./lib/rmodel'),
  connectLivereload = require('connect-livereload');

require('express-mongoose');

//Export
var app = module.exports = express();

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
  }

//Start Listening
  app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.\n', app.get('moreToLog'));
  });
});