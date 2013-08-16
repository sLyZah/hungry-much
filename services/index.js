/*jslint devel: true, node: true, indent: 2, vars: true, white: true */
/*global app */

'use strict';

[
  'users',
  'groups',
  'clicks'
].forEach(function(service) {
  module.exports[service] = require(__dirname + '/' + service);
});
