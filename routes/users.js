//Bismillah
var router = require('express').Router();
var mongoose = require('mongoose');

//Connect to MongoDB
var mongoUrl = "mongodb://localhost/buet73";
mongoose.connect(mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function cb() {
    console.log("Connected to MongoDB at "+mongoUrl); //DEV
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
