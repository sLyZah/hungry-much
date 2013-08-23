/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    Sequelize = require('sequelize'),
    passport = require('passport');

var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
require('./models').init(app);

app.use(express.static('jsapp'));
app.use(express.cookieParser());
app.use(express.session({secret: 'fuckyeahimasessionsecretpleasemakememoresecure'}));
//app.use(passport.initialize());
//app.use(passport.session());

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

routes.init(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
