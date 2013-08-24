/*jslint es5: true, devel: true, node: true, indent: 2, vars: true, white: true, nomen: true */
/*global */

'use strict';

var express       = require('express'),
    routes        = require('./routes'),
    http          = require('http'),
    path          = require('path'),
    Sequelize     = require('sequelize'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    expressValidator = require('express-validator');

var app = express();


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    var models = app.get('models');
    
    var encryptedPassword = models.User.encryptPassword(password);
    
    models.User.getUserByEmail(email).then(function (user) {
      if (user.password === encryptedPassword) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }, function onError(err) {
      done(err);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize
passport.deserializeUser(function(id, done) {
  var models = app.get('models');
    
  models.User.find(id).then(function (user) {
    if (user) {
      done(null, user);
    } else {
      done('User not found');
    }
  }, function onError(err) {
    done(err);
  });
});


// all environments
app.set('port', process.env.PORT || 3000);
require('./models').init(app);

app.use(express.static('jsapp'));
app.use(express.bodyParser());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'fuckyeahimasessionsecretpleasemakememoresecure'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.logger('dev'));
app.use(app.router);


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

routes.init(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
