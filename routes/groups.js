/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var utils      = require('./utils'),
    httpStatus = require('./httpStatus'),
    Q = require('q');

exports.init = function (app) {
  
  var models = app.get('models');
  
  //app.all('/groups*', utils.ensureAuthentication);
  
  
  
  
  app.get('/groups', function (req, res) {
    
    var promise = models.Group.findAll()
      .then(function onSuccess(groups) {
        return Q.all(groups.map(function (group) {
          return group.serialize();
        }));
      }).then(function onSerialized(json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  app.post('/groups', utils.authenticate, utils.validate({
    name: {
      scope: 'body',
      required: true
    },
    treshold: {
      scope: 'body'
    }
  }), function (req, res) {
    var promise = models.Group.create({
      name    : req.valid.name,
      adminId : req.user.id,
      treshold: req.valid.treshold
    }).then(function onSuccess(group) {
      return group.serialize(true);
    }).then(function onSerialized(json) {
      res.status(httpStatus.OK);
      res.json(json);
    });
    
    utils.handleModelError(promise, res);
    
  });
  
  app.get('/groups/:groupId', utils.validate({
    groupId: {
      required: true
    }
  }), function (req, res) {
    
    var promise = models.Group.getGroup(req.valid.groupId)
      .then(function onSuccess(group) {
        return group.serialize(true);
      }).then(function onSerialized(json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  
  
  
  app.put('/groups/:groupId', utils.authenticate, utils.validate({
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
    var attributes = {};
    
    if (req.valid.name) {
      attributes.name = req.valid.name;
    }
    
    if (req.valid.treshold) {
      attributes.treshold = req.valid.treshold;
    }
    
    if (req.valid.adminId) {
      attributes.admin = req.valid.adminId;
    }
    
    var promise = models.Group.getGroup(req.valid.groupId)
      .then(function (group) {
        return group.ensureAdminRights(req.user);
      }).then(function (group) {
        return group.updateAttributes(attributes);
      }).then(function (group) {
        return group.serialize(true);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  
  
  
  
  app.post('/groups/:groupId/users', utils.authenticate, utils.validate({
    groupId: {
      required: true
    },
    userId: {
      scope: 'body',
      required: true
    }
  }), function (req, res) {
    
    var promise = models.Group.getGroup(req.valid.groupId)
      .then(function (group) {
        return group.ensureAdminRights(req.user);
      }).then(function (group) {
        return models.User.getUser(req.valid.userId).then(function (user) {
          return group.addMember(user);
        }).then(function (member) {
          return group.getMembers();
        });
      }).then(function (members) {
        return utils.serializeAll(members);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  app.get('/groups/:groupId/users', utils.validate({
    groupId: {
      required: true
    }
  }), function (req, res) {
    
    var promise = models.Group.getGroup(req.valid.groupId)
      .then(function (group) {
        return group.getMembers();
      }).then(function (members) {
        return utils.serializeAll(members);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  app.delete('/groups/:groupId/users/:userId', utils.authenticate, utils.validate({
    groupId: {
      required: true
    },
    userId: {
      required: true
    }
  }), function (req, res) {
    
    var promise = models.Group.getGroup(req.valid.groupId)
      .then(function (group) {
        return group.ensureAdminRights(req.user);
      }).then(function (group) {
        return models.User.getUser(req.valid.userId).then(function (member) {
          return group.removeUser(member);
        }).then(function (member) {
          return group.getMembers();
        });
      }).then(function (members) {
        return utils.serializeAll(members);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
    
  app.get('/groups/:groupId/clicks', utils.validate({
    groupId: {
      required: true
    },
    after: {
      scope: 'query'
    }
  }), function (req, res) {
    
    var promise = models.Group.getGroup(req.valid.groupId)
      .then(function (group) {
        return group.getDistinctClicks(req.valid.after);
      }).then(function (clicks) {
        return Q.all(clicks.map(function (click) {
          return click.serialize();
        }));
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    utils.handleModelError(promise, res);
    
  });
  
  
  
};
