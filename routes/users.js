//Bismillah
var router = require('express').Router();
var mongoose = require('mongoose');
var CONFIG = require('../config');

//Connect to MongoDB
console.log(CONFIG.DB.URL);
mongoose.connect(CONFIG.DB.URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function cb() {
    console.log("Connected to MongoDB at "+CONFIG.DB.URL); //DEV
});

var User = require('../models/User')(mongoose);

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
