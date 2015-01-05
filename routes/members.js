var express = require('express');
var router = express.Router();

router.get('/directory', function(req, res) {
  res.render('directory');
});

module.exports = router;
