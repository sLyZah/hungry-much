/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('createGroup', function (
  $scope,
  $location,
  config,
  $http
) {
  'use strict';
  
  $scope.name = 'group x';
  
  $scope.tresholdChoices = [1, 2, 3, 4, 5, 6];
  $scope.treshold = 2;
  
  $scope.createGroup = function () {
    $http.post(config.baseUrl + '/groups', {
      name: $scope.name,
      treshold: ($scope.treshold * 60 * 60 * 1000) || null
    }).then(function () {
      $location.path('/groups');
    }, function (error) {
      console.error(error);
    });
  };
  
});