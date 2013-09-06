/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('start', function(
  $scope,
  $http,
  config,
  application
) {
  
  'use strict';
  
  $http.get(config.baseUrl + '/users/me').then(function onIsSignedIn(user) {
    application.user = user;
    application.goTo('home');
  }, function onIsNotSignedIn() {
    application.goTo('signIn');
  });
  
});