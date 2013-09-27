/*jslint es5: true, devel: true, browser: true, indent: 2, vars: true, white: true, nomen: true */
/*global angular*/

angular.module('hungryMuch').filter('moment', function () {
  'use strict';

   return function(input, format) {
      var momentObj = moment(input);

      if(typeof momentObj[format] == 'function'){
        return momentObj[format].apply(momentObj);
      }


      return input;
    }

});
