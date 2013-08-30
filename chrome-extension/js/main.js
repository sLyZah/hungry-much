/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/


angular.module('hungryMuch', []);

angular.module('hungryMuch').constant('config', {
  baseUrl: 'http://localhost:3000'
});

angular.module('hungryMuch').controller('main', function ($scope, config, $http) {
  'use strict';
  
  $scope.isAuthenticated = false;
  $scope.user = null;
  $scope.loading = false;
  
  $scope.authentication = {
    email: 'test@woorank.com',
    password: 'test'
  };
  
  $scope.signIn = function () {
    $scope.loading = true;
    $http.post(config.baseUrl + '/auth/signin', {
      email   : $scope.authentication.email,
      password: $scope.authentication.password
    }).then(function (response) {
      $scope.user = response.data;
      $scope.loading = false;
    });
  };
  
  
  
});