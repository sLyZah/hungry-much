/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/


angular.module('hungryMuch', ['ngRoute']).config(function ($routeProvider) {
  'use strict';
  
  $routeProvider.when('/users/me', {
    templateUrl: '/partials/home.html',
    controller: 'home',
    resolve: {
      user: function ($location, $q, auth) {
        return auth.authorize().then(function onIsSignedIn(user) {
          return user;
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
  
  $routeProvider.when('/groups', {
    templateUrl: '/partials/groups.html',
    controller: 'groups',
    resolve: {
      groups: function ($http, $location, $q, config) {
        return $http.get(config.baseUrl + '/groups').then(function onGetGroups(response) {
          var groups = response.data;
          return groups;
        });
      }
    }
  });
  
  $routeProvider.when('/users/me/creategroup', {
    templateUrl: 'partials/createGroup.html',
    controller: 'createGroup'
  });
  
  $routeProvider.when('/groups/:groupId/clicks', {
    templateUrl: 'partials/clicks.html',
    controller: 'clicks',
    resolve: {
      clicks: function ($http, $location, $q, config, $route) {
        console.log('shf');
        var url = config.baseUrl + '/groups/' + $route.current.params.groupId + '/clicks';
        return $http.get(url).then(function onGetClicks(response) {
          var clicks = response.data;
          return clicks;
        }, function onErr() {
          $location.path('/').replace();
          return $q.reject();
        });
      }
    }
  });
  
  $routeProvider.otherwise({
    redirectTo: '/users/me'
  });
  
});


angular.module('hungryMuch').constant('config', {
  baseUrl: 'http://localhost:3000'
  //baseUrl: 'http://ec2-46-137-47-154.eu-west-1.compute.amazonaws.com:3000'
});

angular.module('hungryMuch').value('globals', {});


