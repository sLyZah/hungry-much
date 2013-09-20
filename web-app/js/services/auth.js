/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').factory('auth', function (
  $http,
  $location,
  $q,
  globals,
  config
) {
  'use strict';
  
  return {
    
    signIn: function (cfg) {
      return $http.post(config.baseUrl + '/auth/signin', cfg)
        .then(function (response) {
          globals.user = response.data;
          return response.data;
        }, function () {
          globals.user = null;
          return $q.reject();
        });
    },
    
    signUp: function (cfg) {
      return $http.post(config.baseUrl + '/auth/signup', cfg)
        .then(function (response) {
          globals.user = response.data;
          return response.data;
        }, function () {
          globals.user = null;
          return $q.reject();
        });
    },
    
    signOut: function () {
      return $http.get(config.baseUrl + '/auth/signout')
        .then(function () {
          globals.user = null;
        });
    }
    
  };
  
});