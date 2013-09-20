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
  
  $scope.sayImHungry = function () {
    $http.post(config.baseUrl + '/users/me/clicks').then(function (response) {
      $location.path('#/groups/' + user.belongsTo.id + '/clicks');
    });
  };
  
});