//Bismillah
var router = require('express').Router();

var DB = require('../models/db');
var User = require('../models/User')(DB.mongoose);

var respond = function(res, result) {
  res.contentType('application/json');
  res.send(JSON.stringify(result));
};

/* POST new user. */
router.post('/auth/register', function(req, res) {
  User.register(req.body, function(data) {
    respond(res, data);
  });
});

/* POST user auth */
router.post('/auth/login', function(req, res) {
  User.authenticate(req.body, function(resp) {
    if (!resp.error) {
      req.session.user = resp.data.user._doc;
      delete req.session.user.password;
    }
    resp.redirectUrl =  req.session.nextUrl || "/";
    delete req.session.nextUrl;
    respond(res, resp);
  });
});

/* Require authentication for all routes after this */
router.use('/', function(req, res, next) {
  if (typeof req.session.user === "undefined") {
    req.session.nextUrl = req.originalUrl;
    res.redirect('/signin');
  }
  else {
    next();
  }
});

module.exports = router;
