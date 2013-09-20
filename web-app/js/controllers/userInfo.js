/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('userInfo', function (
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
  
  $scope.signOut = function () {
    return $http.get(config.baseUrl + '/auth/signout').then(function() {
      $location.path('/');
    });
  };
  
});