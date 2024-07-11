var express = require('express');
var router = express.Router();

/* GET faqs page. */
router.get('/', function(req, res, next) {
  res.render('faqs', { title: 'FAQs' });
});

module.exports = router;