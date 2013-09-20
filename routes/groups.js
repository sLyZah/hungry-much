/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var Q            = require('q'),
    validate     = require('../middleware/validate'),
    authenticate = require('../middleware/authenticate'),
    httpStatus   = require('../utils/httpStatus'),
    modelUtils   = require('../utils/modelUtils');

exports.init = function (app) {
  
  var models = app.get('models');
  
  
  
  /**
    * GET /groups
    * returns: array of all groups
    */
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
    
    modelUtils.handleModelError(promise, res);
    
  });
  
  
  /**
    * POST /groups
    * Creates a new group with the currently logged in user as administrator
    * authenticated
    * params:
    *   name
    *   treshold [optional]
    * returns: the new group
    */
  app.post('/groups', authenticate, validate({
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
    
    modelUtils.handleModelError(promise, res);
    
  });
  
  
  /**
    * GET /groups/:groupId
    * returns: the group with groupId
    */
  app.get('/groups/:groupId', validate({
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
    
    modelUtils.handleModelError(promise, res);
    
  });
  
  
  
  /**
    * PUT /groups
    * Changes the properties of a group. You need to be administrator for that
    * authenticated
    * params:
    *   name [optional]
    *   treshold [optional]
    *   adminId [optional]
    * returns: the changed group
    */
  app.put('/groups/:groupId', authenticate, validate({
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
    
    modelUtils.handleModelError(promise, res);
    
  });
  
  
  
  
  /**
    * POST /groups/:groupId/users
    * Adds a user to a group
    * authenticated
    * params:
    *   userId
    * returns: a list of the users in the group after the change
    */
  app.post('/groups/:groupId/users', authenticate, validate({
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
        return modelUtils.serializeAll(members);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    modelUtils.handleModelError(promise, res);
    
  });
  
  
  /**
    * GET /groups/:groupId/users
    * returns: a list of the users in the group
    */
  app.get('/groups/:groupId/users', validate({
    groupId: {
      required: true
    }
  }), function (req, res) {
    
    var promise = models.Group.getGroup(req.valid.groupId)
      .then(function (group) {
        return group.getMembers();
      }).then(function (members) {
        return modelUtils.serializeAll(members);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    modelUtils.handleModelError(promise, res);
    
  });
  
  
  
  /**
    * DELETE /groups/:groupId/users/:userId
    * Removes a user from a group
    * authenticated
    * params:
    *   userId
    * returns: a list of the users in the group after the change
    */
  app.delete('/groups/:groupId/users/:userId', authenticate, validate({
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
        return modelUtils.serializeAll(members);
      }).then(function (json) {
        res.status(httpStatus.OK);
        res.json(json);
      });
    
    modelUtils.handleModelError(promise, res);
    
  });
  
  
  /**
    * GET /groups/:groupId/clicks
    * Returns the clicks for a group
    * params:
    *   after [optional]
    * returns: a list of the clicks for the group
    */
  app.get('/groups/:groupId/clicks', validate({
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
    
    modelUtils.handleModelError(promise, res);
    
  });
  
  
  
};
