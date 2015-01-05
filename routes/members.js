var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('directory');
});

router.get('/:id', function(req, res) {
  res.render('profile', {'memberId': req.params.id});
});

module.exports = router;
