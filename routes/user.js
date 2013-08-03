var User = app.get('models').User;

exports.findAll = function(req, res){
  User.findAll().success(function(users) {
    res.json(users);
  }).error(function(error) {
    res.status(500);
    res.json({'err' : 'Something went wrong getting users', 'msg' : error});
  });

};

exports.find = function(req, res) {
  var query = {
    where: {}
  };

  var email = req.param("email");
  if (typeof email !== "undefined") {
    query.where.email = email;
  }

  var id = req.param("id");
  if (typeof id !== "undefined") {
    query.where.id = id;
  }

  User.find(query).success(function(user) {
    res.json(user);
  }).error(function(error) {
    res.status(500);
    res.json({'err' : 'Something went wrong getting user', 'msg' : error});
  });
};

exports.save = function(req, res){
  var id   = typeof req.param("id") !== "undefined" ? req.param('id') : null;
  var name = typeof req.param('name') !== "undefined" ? req.param('name') : null;
  var email = typeof req.param('email') !== "undefined" ? req.param('email') : null;

  User.save({
    name: name,
    email: email
  }).success(function(user){
    res.json(user);
  }).error(function(error){
    res.status(500);
    res.json({'err' : 'Something went wrong saving the user', 'msg' : error});
  });
};
