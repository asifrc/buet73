//Bismillah
var router = require('express').Router();

var DB = require('../models/db');
var User = require('../models/User')(DB.mongoose);

var respond = function(res, result) {
  res.contentType('application/json');
  res.send(JSON.stringify(result));
};

/* POST new user. */
router.post('/', function(req, res) {
  User.register(req.body, function(data) {
    respond(res, data);
  });
});


/* GET user list. */
router.get('/', function(req, res) {
  User.find({}, function(data) {
    respond(res, data);
  });
});


/* POST user auth */
router.post('/login', function(req, res) {
  User.authenticate(req.body, function(resp) {
    if (!resp.error) {
      req.session.user = resp.data.user._doc;
      delete req.session.user.password;
    }
    respond(res, resp);
  });
});


module.exports = router;
