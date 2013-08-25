/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */
'use strict';

var httpStatus = require('./httpStatus'),
    ModelError = require('../models/ModelError'),
    Q          = require('q');




function mapModelErrorToHttpStatus(error) {
  switch (error.code) {
    case ModelError.NOT_FOUND   : return httpStatus.NOT_FOUND;
    case ModelError.DUPLICATE   : return httpStatus.BAD_REQUEST;
    case ModelError.UNAUTHORIZED: return httpStatus.UNAUTHORIZED;
    case ModelError.REFUSED     : return httpStatus.FORBIDDEN;
    default                     : return httpStatus.INTERNAL_SERVER_ERROR;
  }
}

exports.handleModelError = function (dbPromise, response) {
  dbPromise.then(null, function (modelError) {
    var status = mapModelErrorToHttpStatus(modelError);
    response.send(status, modelError.message);
  });
};

exports.serializeAll = function (models, deep) {
  return Q.all(models.map(function (model) {
    return model.serialize(deep);
  }));
};
