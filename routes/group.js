var Group = app.get('models').Group,
    User = app.get('models').User,
    keyHelper = require('../helpers/keys.js');

/**
 * Find list of groups with pagination and ordering
 */
exports.findAll = function(req, res){
  num = parseInt(req.param('num'))
  limit = (num !== 'NaN') && num < 100 ?  num : 20;

  page = parseInt(req.param('page'))
  offset = (page !== 'NaN') ? page : 0;

  order = req.param('order')
  orderBy = (order != undefined) ? order + ' ASC' : 'id';

  query = (req.param('q') != undefined) 
    ? [ 'name LIKE ?', req.param('q') ]
    : null

  Group
    .findAll({ 
      where : query,
      limit : limit, 
      offset : offset, 
      order : orderBy 
    })
    .success(function(group){
      if(group === null) {
        res.status(404);
        res.json({});
      } else {
        res.json(group);
      }
    })
    .error(function(error){
      res.json({'err' : 'Something went wrong saving the model', 'msg' : error});
    });
};

/**
 * Find group by id (numeric input) or name
 */
exports.find = function(req, res){
  // Id to find
  query = req.param('id');

  Group
    .find(query)
    .success(function(group){
      if(group === null) {
        res.status(404)
        res.json({});
      } else {
        res.json(group);
      }
    })
    .error(function(error){
      res.json({'err' : 'Something went wrong saving the model', 'msg' : error});
    });
};

/**
 * Save group with given details
 */
exports.save = function(req, res){
  name = req.param('name') != undefined ? req.param('name') : null
  admin = req.param('admin') != undefined ? req.param('admin') : null

  tresholdParam = parseInt(req.param('treshold'))
  treshold = (tresholdParam != 'NaN') ? tresholdParam : null

  User.findOrCreate(
    { email : admin },
    { name : admin }
  ).success(function(user) {
    Group.create({
      name: name,
      treshold: treshold,
      key: keyHelper.generate(8)
    }).success(function(savedGroup) {
      savedGroup.setAdmin(user);
      res.json(savedGroup);
    }).error(function(error){
      res.status(500);
      res.json({'err' : 'Something went wrong saving the model', 'msg' : error});
    });
  }).error(function(error){
    res.status(500);
    res.json({'err' : 'Something went wrong with finding/creating the user', 'msg' : error});
  });
};

/**
 * Delete group by id
 */
exports.del = function(req, res){
  Group
    .find(req.param('id'))
    .success(function(group) {
      if(group === null) {
        res.status(404)
        res.json({});
      } else {
        group
          .destroy()
          .success(function() {
            res.json({});
          })
          .error(function(error){
            res.status(500);
            res.json({'err' : 'Something went wrong deleting model', 'msg' : error});
          });
      }
    })
    .error(function(error){
      res.status(500);
      res.json({'err' : 'Something went wrong finding to be deleted model', 'msg' : error});
    });
};
