/*jslint devel: true, node: true, indent: 2, vars: true, white: true */
/*global app */

'use strict';

var routes = [
  'user',
  'click',
  'group'
];

function initRoutes(app) {
  routes.forEach(function(route) {
    require(__dirname + '/' + route).init(app);
  });
}

exports.init = function (app) {
  initRoutes(app);
  
  
  app.get('/', function(req, res){
    res.json({'msg' : 'Hungry Much REST API'});
  });
  
  
};