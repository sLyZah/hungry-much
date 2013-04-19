var models = require('../models');
var Group = models.Group;

exports.fetch = function(req, res){
  res.json({'msg' : 'group list'});
};

exports.find = function(req, res){
  res.json({'msg' : 'group with id'});
};

exports.save = function(req, res){
  res.json({'msg' : 'group add'});
};

exports.delete = function(req, res){
  res.json({'msg' : 'group delete'});
};
