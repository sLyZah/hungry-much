/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */
'use strict';

exports.handlePromiseResponse = function (promise, response) {
  return promise.then(function success(result) {
    response.status(200);
    response.json(result);
    return result;
  }, function fail(error) {
    response.status(500);
    response.json(error);
    return error;
  });
};

exports.ensureAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.send(401, 'Unauthorized');
  }
};