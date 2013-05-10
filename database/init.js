// Add NODE_CONFIG_DIR=%% env when running this script 

var models = require('../models'),
    Group = models.Group,
    User = models.User;

Group
  .sync()
  .success(function() {
    console.log('Groups synced');
  })
  .error(function(error) {
    console.log('Something went wrong syncing the model:');
    console.log(error);
  })

User
  .sync()
  .success(function() {
    console.log('Users synced');
  })
  .error(function(error) {
    console.log('Something went wrong syncing the model:');
    console.log(error);
  })