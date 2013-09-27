/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('home', function (
  $scope,
  config,
  $http,
  user,
  $location
) {
  'use strict';
  
  $scope.user = user;
  
  $scope.getClicksUrl = function (group) {
    return '#/groups/' + group.id + '/clicks';
  };
  
  $scope.sayImHungry = function () {
    $http.post(config.baseUrl + '/users/me/clicks').then(function () {
      $location.path('/groups/' + user.belongsTo.id + '/clicks');
    });
  };
  
  $scope.isHungry = function () {
    return user.lastClick && user.lastClick.timestamp > user.lastClick.expires;
  };
  
});