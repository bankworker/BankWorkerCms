let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('help', { title: '帮助' });
});

module.exports = router;
