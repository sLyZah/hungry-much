/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').controller('clicks', function (
  $scope,
  config,
  $http,
  clicks,
  $location
) {
  'use strict';

  $scope.clicks = clicks;
  
  $scope.getDate = function (click) {
    return new Date(click.timestamp);
  };
  
  $scope.isAlive = function (click) {
    return click.health > 0;
  };

  $scope.getHp = function (click) {
    return Math.floor( 100 * click.health / 10) ;
  };
  
});