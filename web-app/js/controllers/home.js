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
  
  $scope.showWhosHungry = function () {
    $location.path('/groups/' + user.belongsTo.id + '/clicks');
  };
  
  $scope.sayImHungry = function () {
    $http.post(config.baseUrl + '/users/me/clicks').then($scope.showWhosHungry);
  };
  
  $scope.isHungry = function () {
    if (user.lastClick && user.belongsTo) {
      return user.lastClick.timestamp > new Date().getTime() - user.belongsTo.treshold;
    }
    
    return false;
  };
  
});