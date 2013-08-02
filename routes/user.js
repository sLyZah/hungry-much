var User = app.get('models').User;

exports.findAll = function(req, res){
  
};

exports.find = function(req, res){

};

exports.save = function(req, res){
  name = req.param('name') != undefined ? req.param('name') : null
  email = req.param('email') != undefined ? req.param('email') : null

  User.create({
    name: name,
    email: email
  }).success(function(user){
    res.json(user);
  }).error(function(error){
    res.status(500);
    res.json({'err' : 'Something went wrong saving the user', 'msg' : error});
  });
};
