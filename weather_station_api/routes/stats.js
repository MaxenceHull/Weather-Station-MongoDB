var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('stats', { title: 'Weather Station Admin Console' });
});

module.exports = router;
