
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

app.get('/', function(req, res){
  res.json({'msg' : 'Hungry Much REST API'});
});
//app.get('/groups', user.list);

group = require('./routes/group')
app.get('/groups', group.findAll);
app.get('/groups/:id', group.find);
app.post('/groups', group.save);
app.del('/groups/:id', group.delete);

var click = require('./routes/click');
app.get('/clicks', click.findAll);
app.post('/clicks', click.save);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
