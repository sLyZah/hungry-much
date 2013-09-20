/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('userInfo', function (
  $scope,
  $location,
  auth,
  globals
) {
  'use strict';
  
  $scope.user = globals.user;
  
  $scope.signOut = function () {
    auth.signOut().then(function () {
      $location.path('/');
    });
  };
  
});