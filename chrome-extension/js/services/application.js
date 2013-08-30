/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').factory('application', function() {
  
  'use strict';
  
  var views = {
    start : 'partials/start.html',
    signIn: 'partials/signIn.html',
    signUp: 'partials/signUp.html',
    home  : 'partials/home.html'
  };
  
  var application = {
    currentView: views.start
  };
  
  application.goTo = function (viewName) {
    application.currentView = views[viewName];
  };
  
  return application;
  
});