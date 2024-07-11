const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const winstonLogger = require('../config/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Energy Prices Comparator', formData: {}, errors: [] });
});

/* POST form submission. */
router.post('/compare', [
  body('region').not().isEmpty().withMessage('Region is required.'),
  body('usageType').not().isEmpty().withMessage('Usage type is required.'),
  body('spendAmount').if(body('usageType').equals('spend')).isFloat({ gt: 0 }).withMessage('Valid spend amount is required.'),
  body('kwhAmount').if(body('usageType').equals('kwh')).isFloat({ gt: 0 }).withMessage('Valid kWh amount is required.'),
  body('cashback').not().isEmpty().withMessage('Cashback selection is required.')
], async function(req, res, next) {
  const errors = validationResult(req);
  const formData = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).render('index', { title: 'Energy Prices Comparator', formData, errors: errors.array() });
  }

  try {
    const apiData = {
      providers: "yuno|pinergy|elec|energia",
      interest: "standard",
      loc: formData.region
    };

    winstonLogger.info(`Form submitted: ${JSON.stringify(formData)}`); // Log form submission

    const response = await axios.post('http://localhost:3001/api', apiData);
    winstonLogger.info(`API request sent to /api with data: ${JSON.stringify(apiData)}`); // Log API request

    if (response.status !== 200) {
      throw new Error('Error in fetching data from the API');
    }

    winstonLogger.info(`API response received: ${JSON.stringify(response.data)}`); // Log API response
    res.render('results', { title: 'Comparison Results', results: response.data }); // Render results page with API response
  } catch (error) {
    winstonLogger.error(`Error in form submission: ${error.message}`); // Log error
    next(error);
  }
});

module.exports = router;
