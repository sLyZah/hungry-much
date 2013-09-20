/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('groups', function (
  $scope,
  config,
  $http,
  groups,
  user,
  $location
) {
  'use strict';

  $scope.groups = groups;
  
  $scope.joinGroup = function (group) {
    $http.post(config.baseUrl + '/groups/' + group.id + '/users', {
      userId: user.id
    }).then(function (response) {
      $location.path('/');
    });
  };
  
});