/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('signIn', function (
  $scope,
  $location,
  config,
  $http
) {
  'use strict';
  
  $scope.loading = false;
  $scope.name = 'name';
  $scope.email = 'test@woorank.com';
  $scope.password = 'test';
  $scope.rretypePassword = 'test';
  
  $scope.signUp = function () {
    $scope.loading = true;
    $http.post(config.baseUrl + '/auth/signin', {
      name: $scope.name,
      email   : $scope.email,
      password: $scope.password
    }).then(function (response) {
      $scope.loading = false;
      $location.path('/');
    }, function () {
      $scope.loading = false;
    });
  };
  
});