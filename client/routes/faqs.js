/**
 * FAQs page router
 * 
 * This module sets up a route for the "FAQs" page using the `express` library.
 * 
 * Dependencies:
 * - express: A web application framework for Node.js.
 */

var express = require('express');
var router = express.Router();

/**
 * GET FAQs page.
 * 
 * Route: GET /
 * Renders the 'faqs' view with the title 'FAQs'.
 */
router.get('/', function(req, res, next) {
  res.render('faqs', { title: 'FAQs' });
});

module.exports = router;
