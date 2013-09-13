/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('groups', function (
  $scope,
  config,
  $http,
  application
) {
  'use strict';
  
  $scope.groups = $http.post(config.baseUrl + '/users/' + application.user.id);
  
  console.log(application.user);
  
});