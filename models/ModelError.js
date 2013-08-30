/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

module.exports = function Error(code, message) {
  this.code    = code;
  this.message = message || '';
};

module.exports.UNKNOWN    = 0;
module.exports.NOT_FOUND  = 1;
module.exports.DUPLICATE  = 'ER_DUP_ENTRY';
module.exports.UNAUTHORIZED = 3;
module.exports.REFUSED = 4;