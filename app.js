var express         = require('express'),
  path              = require('path'),
  rroute            = require('./lib/rroute'),
  connectLivereload = require('connect-livereload');

//Export
var app = module.exports = express();

//Configuration
app.set('port',       process.env.PORT || 8000);
app.set('env',        process.env.NODE_ENV || 'development');
app.set('routesDir',  path.join(__dirname, 'routes'));
app.set('tmpDir',     '.tmp');
app.set('publicDir',  'public');

//Production Middleware
if(app.get('env') === 'production'){
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, app.get('publicDir'))));
  app.use(app.router);
  app.use(express.errorHandler());
  app.use(rroute(app.get('routesDir')));
}
//Development Middleware
else{
  app.use(connectLivereload());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, app.get('tmpDir'))));
  app.use(express.static(path.join(__dirname, app.get('publicDir'))));
  app.use(app.router);
  app.use(express.errorHandler());
  app.use(rroute(app.get('routesDir')));
}

//Start Listening
app.listen(app.get('port'), function () {
  'use strict';
  console.log('Listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
});