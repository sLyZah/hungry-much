angular.module('hungryMuch').factory('application', function() {
  
  var views = {
    start : 'partials/start.html',
    signIn: 'partials/signIn.html',
    signUp: 'partials/signUp.html',
    home  : 'partials/home.html'
  };
  
  var application = {
    currentView: views.start
  }
  
  application.goTo = function (viewName) {
    application.currentView = views[viewName];
  };
  
  return application;
  
});