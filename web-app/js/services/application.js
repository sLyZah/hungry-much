/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').factory('application', function() {
  
  'use strict';
  
  var views = {
    start : {
      template: 'partials/start.html',
      class   : 'start'
    },
    signIn: {
      template: 'partials/signIn.html',
      class   : 'sign-in'
    },
    signUp: {
      template: 'partials/signUp.html',
      class   : 'sign-up'
    },
    home  : {
      template: 'partials/home.html',
      class   : 'home'
    },
    createGroup  : {
      template: 'partials/createGroup.html',
      class   : 'create-group'
    }
  };
  
  var application = {
    currentView: views.start
  };
  
  application.goTo = function (viewName) {
    application.currentView = views[viewName];
  };
  
  return application;
  
});