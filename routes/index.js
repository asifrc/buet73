var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});


router.get('/signup', function(req, res) {
  res.render('signup', { title: "Sign Up" });
});


router.get('/signin', function(req, res) {
  var locals = {
    title: "Sign In",
    nextUrl: req.session.nextUrl || "/"
  };
  delete req.session.nextUrl;
  res.render('signin', locals);
});


router.get('/signout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  });
});

module.exports = router;
