/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('signUp', function (
  $scope,
  $location,
  auth
) {
  'use strict';
  
  $scope.loading = false;
  $scope.name = '';
  $scope.email = '';
  $scope.password = '';
  $scope.retypePassword = '';
  
  $scope.signUp = function () {
    $scope.error = null;
    if ($scope.password !== $scope.retypePassword) {
      $scope.error = 'Passwords don\'t match';
      return;
    }
    
    $scope.loading = true;
    auth.signUp({
      name    : $scope.name,
      email   : $scope.email,
      password: $scope.password
    }).then(function (response) {
      $scope.loading = false;
      $location.path('/');
    }, function (error) {
      $scope.loading = false;
      $scope.error = 'Signup failed';
    });
  };
  
});