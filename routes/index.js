var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{
    css: ''
  });
});

router.get('/cadastrar-rede', function(req, res, next) {
  res.render('cadastrar-rede',{
    css: ''
  });
});

router.get('/result', function(req, res, next) {
  res.render('result',{
    css: ''
  });
});


module.exports = router;
