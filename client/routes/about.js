/**
 * About page router
 * 
 * This module sets up a route for the "About Us" page using the `express` library.
 * 
 * Dependencies:
 * - express: A web application framework for Node.js.
 */

var express = require('express');
var router = express.Router();

/**
 * GET about page.
 * 
 * Route: GET /
 * Renders the 'about' view with the title 'About Us'.
 */
router.get('/', function(req, res, next) {
  res.render('about', { title: 'About Us' });
});

module.exports = router;
