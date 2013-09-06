/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('createGroup', function (
  $scope,
  config,
  $http,
  application
) {
  'use strict';
  
  $scope.name = 'group x';
  
  $scope.createGroup = function () {
    $http.post(config.baseUrl + '/groups', {
      name: $scope.name
    }).then(function () {
      application.goTo('groups');
    }, function (error) {
      console.error(error);
    });
  };
  
});