/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils      = require('./utils'),
    httpStatus = require('./httpStatus');

exports.init = function (app) {
  
  var models = app.get('models');
  
  app.all('/groups*', utils.ensureAuthentication);
  
  app.get('/groups', function (req, res) {
    var name = req.query.name;
    
    if (!name) {
      return res.send(httpStatus.BAD_REQUEST, '"name" not specified');
    }
    
    models.Group.getGroupByName(name).then(function onSuccess(group) {
      if (group) {
        res.status(httpStatus.OK);
        res.json(group.serialize());
      } else {
        res.send(httpStatus.NOT_FOUND);
      }
    }, function onError(err) {
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  });
  
  app.post('/groups', function (req, res) {
    var name     = req.body.name;
    var treshold = req.body.treshold;
    
    if (!name) {
      return res.send(httpStatus.BAD_REQUEST, '"name" not specified');
    }
    
    models.Group.addGroup({
      name: name,
      adminId: req.user.id,
      treshold: treshold
    }).then(function onSuccess(group) {
      res.status(httpStatus.OK);
      res.json(group.serialize());
    }, function onError(err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send(httpStatus.BAD_REQUEST, 'Group already exists');
      } else {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    });
  });
  
  app.get('/groups/:groupId', function (req, res) {
    var groupId = parseInt(req.param('groupId'), 10);
    
    if (!groupId) {
      // groupId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    models.Group.find(groupId).then(function onSuccess(group) {
      if (group) {
        res.status(httpStatus.OK);
        res.json(group.serialize());
      } else {
        res.send(httpStatus.NOT_FOUND);
      }
    }, function onError(err) {
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  });
  
  app.put('/groups/:groupId', function (req, res) {
    var groupId  = req.param('groupId');
    var adminId  = parseInt(req.body.adminId, 10);
    var name     = req.body.name;
    var treshold = req.body.treshold;
    
    if (!groupId) {
      // groupId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    var config = {};
    
    if (name) {
      config.name = name;
    }
    
    if (name) {
      config.treshold = treshold;
    }
    
    if (adminId) {
      config.admin = adminId;
    }
    
    models.Group.isAdminForGroup(groupId, req.user.id).then(function (isAdmin) {
      if (isAdmin) {
        return models.Group.changeGroup(groupId, config);
      } else {
        res.send(httpStatus.UNAUTHORIZED, 'You are not the admin of this group');
      }
    }).then(function onSuccess(group) {
      res.status(httpStatus.OK);
      res.json(group.serialize());
    }, function onError(err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send(httpStatus.BAD_REQUEST, 'Group already exists');
      } else {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    });
  });
  
  app.post('/groups/:groupId/users', function (req, res) {
    var groupId = req.param('groupId');
    var userId  = req.body.userId;
    
    if (!groupId) {
      // groupId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    if (!userId) {
      return res.send(httpStatus.BAD_REQUEST, '"userId" not specified');
    }
    
    models.Group.isAdminForGroup(groupId, req.user.id).then(function (isAdmin) {
      if (isAdmin) {
        return models.Group.addUser(groupId, userId);
      } else {
        res.send(httpStatus.UNAUTHORIZED, 'You are not the admin of this group');
      }
    }).then(function onSuccess(group) {
      if (group) {
        res.status(httpStatus.OK);
        res.json(group.serialize());
      } else {
        res.send(httpStatus.NOT_FOUND);
      }
    }, function onError(err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send(httpStatus.BAD_REQUEST, 'Group already exists');
      } else {
        res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
      }
    });
  });
  
  app.get('/groups/:groupId/users', function (req, res) {
    var groupId = req.param('groupId');
    
    if (!groupId) {
      // groupId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    models.Group.getUsers(groupId).then(function (users) {
      if (users) {
        res.status(httpStatus.OK);
        res.json(users.map(function (user) {
          return user.serialize();
        }));
      } else {
        res.send(httpStatus.NOT_FOUND);
      }
    }, function (err) {
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  });
  
  app.delete('/groups/:groupId/users/:userId', function (req, res) {
    var groupId = req.param('groupId');
    var userId  = req.param('userId');
    
    if (!groupId) {
      // groupId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    if (!userId) {
      // userId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    models.Group.isAdminForGroup(groupId, req.user.id).then(function (isAdmin) {
      if (isAdmin) {
        return models.Group.removeUser(groupId, userId);
      } else {
        res.send(httpStatus.UNAUTHORIZED, 'You are not the admin of this group');
      }
    }).then(function (group) {
      if (group) {
        res.status(httpStatus.OK);
        res.json(group.serialize());
      } else {
        res.send(httpStatus.NOT_FOUND);
      }
    }, function (err) {
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  });
  
    
  app.get('/groups/:groupId/clicks', function (req, res) {
    var groupId = req.param('groupId');
    var after   = req.query.after;
    
    if (!groupId) {
      // groupId should be specified in the path
      return res.send(httpStatus.INTERNAL_SERVER_ERROR, 'Unreachable code');
    }
    
    var cfg = {};
    cfg.after = after;
    cfg.groupId = groupId;
    
    models.Group.find(groupId).then(function (group) {
      if (group) {
        group.getDistinctClicks(after).then(function (clicks) {
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
    }, function (err) {
      res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  });
};
