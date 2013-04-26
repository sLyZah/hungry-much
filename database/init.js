var models = require('./models'),
    Group = models.Group;

Group
  .sync()
  .success(function() {
    console.log('Groups synced');
  })
  .error(function(error) {
    console.log('Something went wrong syncing the model:');
    console.log(error);
  })