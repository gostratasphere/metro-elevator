var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expressly' });
});

router.post('/form', function(req, res, next) {
  console.log(req.body)
  res.send(req.body.station)
});

module.exports = router;
