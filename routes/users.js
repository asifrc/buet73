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

module.exports = router;
