/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('signIn', function (
  $scope,
  config,
  $http,
  application
) {
  'use strict';
  
  $scope.loading = false;
  $scope.email = 'test@woorank.com';
  $scope.password = 'test';
  
  $scope.signIn = function () {
    $scope.loading = true;
    $http.post(config.baseUrl + '/auth/signin', {
      email   : $scope.email,
      password: $scope.password
    }).then(function (response) {
      application.user = response.data;
      $scope.loading = false;
      application.goTo('home');
    }, function () {
      $scope.loading = false;
    });
  };
  
});