/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('signIn', function (
  $scope,
  $location,
  auth,
  globals
) {
  'use strict';
  
  $scope.loading = false;
  $scope.email = 'test@woorank.com';
  $scope.password = 'test';
  
  $scope.signIn = function () {
    $scope.loading = true;
    auth.signIn({
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