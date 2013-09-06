/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/


angular.module('hungryMuch', ['ngRoute']);

angular.module('hungryMuch').constant('config', {
  baseUrl: 'http://localhost:3000'
});

angular.module('hungryMuch').controller('main', function (
  $scope,
  config, 
  $http,
  application
) {
  'use strict';
  
  $scope.application = application;
  
  $scope.signOut = function () {
    $http.get(config.baseUrl + '/auth/signout').then(function (response) {
      application.goTo('start');
    });
  };
  
});