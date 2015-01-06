var express = require('express');
var router = express.Router();

var ERRORS = require('../public/js/errors');
var DB = require('../models/db');
var User = require('../models/User')(DB.mongoose);

router.get('/', function(req, res) {
  res.render('directory');
});

router.get('/:id', function(req, res) {
  User.find({'_id': req.params.id}, function(resp) {
    if (resp.error) {
      res.render('simpleError', {'message': resp.error});
    }
    if (resp.data.users.length !== 1) {
      res.render('simpleError', {'message': ERRORS.user['notFound']});
    }
    else {
      var member = resp.data.users[0].toObject();
      var noPic = {
        "url": "/images/pic.gif",
        "thumb": "/images/thumbnail/pic.gif"
      };
      member.profilePic = member.profilePic || noPic;
      var article  = (member.country.indexOf('United') > -1) ? "the " : "";
      member.country = article + member.country;
      delete member.password;
      res.render('profile', {'member': member});
    }
  });
});

module.exports = router;
