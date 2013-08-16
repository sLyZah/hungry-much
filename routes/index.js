/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global app */

'use strict';

function initRoutes(app) {
  [ 'users', 'clicks', 'groups' ].forEach(function(route) {
    require(__dirname + '/' + route).init(app);
  });
}

exports.init = function (app) {
  initRoutes(app);
  
  
  app.get('/', function(req, res){
    res.json({'msg' : 'Hungry Much REST API'});
  });
  
};