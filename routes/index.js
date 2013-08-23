/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

function initRoutes(app, passport) {
  
  [ 'auth', 'users', 'clicks', 'groups' ].forEach(function(route) {
    require(__dirname + '/' + route).init(app, passport);
  });
}

exports.init = function (app, passport) {
  initRoutes(app, passport);
  
  
  app.get('/', function(req, res){
    res.json({'msg' : 'Hungry Much REST API'});
  });
  
};