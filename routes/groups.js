/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils      = require('./utils'),
    httpStatus = require('./httpStatus');

exports.init = function (app) {
  
  var models = app.get('models');
  
  app.all('/groups*', utils.ensureAuthentication);
  
  app.get('/groups', utils.validate({
    name: {
      scope: 'query',
      required: true
    }
  }), function (req, res) {
    models.Group.getGroupByName(req.valid.name).then(
      function onSuccess(group) {
        if (group) {
          res.status(httpStatus.OK);
          res.json(group.serialize());
        } else {
          res.send(httpStatus.NOT_FOUND);
        }
      },
      function onError(err) {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    );
  });
  
  app.post('/groups', utils.validate({
    name: {
      scope: 'body',
      required: true
    },
    treshold: {
      scope: 'body'
    }
  }), function (req, res) {
    models.Group.addGroup({
      name    : req.valid.name,
      adminId : req.user.id,
      treshold: req.valid.treshold
    }).then(
      function onSuccess(group) {
        res.status(httpStatus.OK);
        res.json(group.serialize());
      },
      function onError(err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.send(httpStatus.BAD_REQUEST, 'Group already exists');
        } else {
          res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
        }
      }
    );
  });
  
  app.get('/groups/:groupId', utils.validate({
    groupId: {
      required: true
    }
  }), function (req, res) {
    models.Group.find(req.valid.groupId).then(
      function onSuccess(group) {
        if (group) {
          res.status(httpStatus.OK);
          res.json(group.serialize());
        } else {
          res.send(httpStatus.NOT_FOUND);
        }
      },
      function onError(err) {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    );
  });
  
  app.put('/groups/:groupId', utils.validate({
    groupId: {
      required: true
    },
    name: {
      scope: 'body'
    },
    adminId: {
      scope: 'body'
    },
    treshold: {
      scope: 'body'
    }
  }), function (req, res) {
    var config = {};
    
    if (req.valid.name) {
      config.name = req.valid.name;
    }
    
    if (req.valid.treshold) {
      config.treshold = req.valid.treshold;
    }
    
    if (req.valid.adminId) {
      config.admin = req.valid.adminId;
    }
    
    models.Group.isAdminForGroup(req.valid.groupId, req.user.id).then(
      function (isAdmin) {
        if (isAdmin) {
          return models.Group.changeGroup(req.valid.groupId, config);
        } else {
          res.send(httpStatus.UNAUTHORIZED, 'You are not the admin of this group');
        }
      }
    ).then(
      function onSuccess(group) {
        res.status(httpStatus.OK);
        res.json(group.serialize());
      },
      function onError(err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.send(httpStatus.BAD_REQUEST, 'Group already exists');
        } else {
          res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
        }
      }
    );
  });
  
  app.post('/groups/:groupId/users', utils.validate({
    groupId: {
      required: true
    },
    userId: {
      scope: 'body',
      required: true
    }
  }), function (req, res) {
    models.Group.isAdminForGroup(req.valid.groupId, req.user.id).then(
      function (isAdmin) {
        if (isAdmin) {
          return models.Group.addUser(req.valid.groupId, req.valid.userId);
        } else {
          res.send(httpStatus.UNAUTHORIZED, 'You are not the admin of this group');
        }
      }
    ).then(
      function onSuccess(group) {
        if (group) {
          res.status(httpStatus.OK);
          res.json(group.serialize());
        } else {
          res.send(httpStatus.NOT_FOUND);
        }
      },
      function onError(err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.send(httpStatus.BAD_REQUEST, 'Group already exists');
        } else {
          res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
        }
      }
    );
  });
  
  app.get('/groups/:groupId/users', utils.validate({
    groupId: {
      required: true
    }
  }), function (req, res) {
    models.Group.getUsers(req.valid.groupId).then(
      function (users) {
        if (users) {
          res.status(httpStatus.OK);
          res.json(users.map(function (user) {
            return user.serialize();
          }));
        } else {
          res.send(httpStatus.NOT_FOUND);
        }
      },
      function (err) {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    );
  });
  
  app.delete('/groups/:groupId/users/:userId', utils.validate({
    groupId: {
      required: true
    },
    userId: {
      required: true
    }
  }), function (req, res) {
    models.Group.isAdminForGroup(
      req.valid.groupId,
      req.user.id
    ).then(
      function onSuccess(isAdmin) {
        if (isAdmin) {
          return models.Group.removeUser(req.valid.groupId, req.valid.userId);
        } else {
          res.send(httpStatus.UNAUTHORIZED, 'You are not the admin of this group');
        }
      }
    ).then(
      function onUserRemoved(group) {
        if (group) {
          res.status(httpStatus.OK);
          res.json(group.serialize());
        } else {
          res.send(httpStatus.NOT_FOUND);
        }
      },
      function onError(err) {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    );
  });
  
    
  app.get('/groups/:groupId/clicks', utils.validate({
    groupId: {
      required: true
    },
    after: {
      scope: 'query'
    }
  }), function (req, res) {
    models.Group.find(req.valid.groupId).then(
      function (group) {
        if (group) {
          group.getDistinctClicks(req.valid.after).then(function (clicks) {
            res.status(httpStatus.OK);
            res.json(clicks.map(function (click) {
              return click.serialize();
            }));
          }, function (err) {
            res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
          });
        } else {
          res.send(httpStatus.NOT_FOUND);
        }
      },
      function (err) {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    );
  });
};
