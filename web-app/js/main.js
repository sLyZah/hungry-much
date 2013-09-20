/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/


angular.module('hungryMuch', ['ngRoute']).config(function ($routeProvider) {
  'use strict';
  
  $routeProvider.when('/users/me', {
    templateUrl: '/partials/home.html',
    controller: 'home',
    resolve: {
      user: function ($http, $location, $q, config) {
        return $http.get(config.baseUrl + '/users/me').then(function onIsSignedIn(response) {
          var user = response.data;
          return response.data;
        }, function onIsNotSignedIn() {
          $location.path('/signin').replace();
          return $q.reject();
        });
      }
    }
  });
  
  $routeProvider.when('/signin', {
    templateUrl: '/partials/signIn.html',
    controller: 'signIn'
  });
  
  $routeProvider.when('/signup', {
    templateUrl: '/partials/signUp.html',
    controller: 'signUp'
  });
  
  $routeProvider.when('/users/me/groups', {
    templateUrl: '/partials/groups.html',
    controller: 'groups',
    resolve: {
      user: function ($http, $location, $q, config) {
        return $http.get(config.baseUrl + '/users/me').then(function onIsSignedIn(response) {
          var user = response.data;
          return response.data;
        }, function onIsNotSignedIn() {
          $location.path('/signin').replace();
          return $q.reject();
        });
      }
    }
  });
  
  $routeProvider.when('/users/me/creategroup', {
    templateUrl: 'partials/createGroup.html',
    controller: 'createGroup'
  });
  
  $routeProvider.otherwise({
    redirectTo: '/users/me'
  });
  
});

angular.module('hungryMuch').constant('config', {
  baseUrl: 'http://localhost:3000'
  //baseUrl: 'http://ec2-46-137-47-154.eu-west-1.compute.amazonaws.com:3000'
});