var Group = app.get('models').Group,
    keyHelper = require('../helpers/keys.js');

exports.findAll = function(req, res){
  num = parseInt(req.param('num'))
  limit = (num !== 'NaN') && num < 100 ?  num : 20;

  page = parseInt(req.param('page'))
  offset = (page !== 'NaN') ? page : 0;

  order = req.param('order')
  orderBy = (order != undefined) ? order + ' ASC' : 'id';

  Group
    .findAll({ limit : limit, offset : offset, order : orderBy })
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

exports.find = function(req, res){
  // Id to find
  query = req.param('id');
  if(typeof query !== 'number' && isNaN(query)) {
    query = { 'where' : { 'name' : query } }
  }

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

exports.save = function(req, res){
  name = req.param('name') != undefined ? req.param('name') : null
  admin = req.param('admin') != undefined ? req.param('admin') : null

  tresholdParam = parseInt(req.param('treshold'))
  treshold = (tresholdParam != 'NaN') ? tresholdParam : null

  Group
    .build({
      name: name,
      admin: admin,
      treshold: treshold,
      key: keyHelper.generate(8)
    })
    .save()
    .success(function(savedGroup) {
      res.json(savedGroup);
    })
    .error(function(error){
      res.status(500);
      res.json({'err' : 'Something went wrong saving the model', 'msg' : error});
    });
};

exports.delete = function(req, res){
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
