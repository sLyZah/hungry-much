var Group = app.get('models').Group;

exports.fetch = function(req, res){
  res.json({'msg' : 'group list'});
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
  Group
    .build({
      name: 'group-test',
      admin: 'test@test.com',
      treshold: 3,
      key: 'ABC123'
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
  res.json({'msg' : 'group delete'});
};

exports.sync = function(req, res){
  Group
    .sync()
    .success(function() {
      res.json({'msg' : 'Group model synced'});
    })
    .error(function(error) {
      res.status(500);
      res.json({'err' : 'Something went wrong syncing the model', 'msg' : error});
    })
};
