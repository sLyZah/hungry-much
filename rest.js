
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , Sequelize = require('sequelize');

var app = express();
GLOBAL.app = app;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('models', require('./models'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

console.log('init services');
app.set('services', require('./services'));
console.log('init routes');
routes.init(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
