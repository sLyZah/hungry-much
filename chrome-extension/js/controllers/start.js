angular.module('hungryMuch').controller('start', function(
  $scope,
  $http,
  config,
  global,
  application
) {
  
  $http.get(config.baseUrl + '/users/me').then(function onIsSignedIn(user) {
    global.user = user;
    application.goTo('home');
  }, function onIsNotSignedIn() {
    application.goTo('signIn');
  });
  
});