/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */
'use strict';


module.exports = function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.send(401, 'Unauthorized');
  }
};
