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
  body('kwhUsage').if(body('usageType').equals('kwh')).isFloat({ gt: 0 }).withMessage('Valid kWh amount is required.'),
  body('householdSize').if(body('usageType').equals('unknown')).isFloat({ gt: 0 }).withMessage('Valid household size is required.')
], async function(req, res, next) {
  const errors = validationResult(req);
  const formData = req.body;
  if (!errors.isEmpty()) {
      return res.status(400).render('index', { title: 'Enersave - Electricity Price Comparator', formData, errors: errors.array() });
  }
  try {
      const apiData = {
          currentProvider: formData.provider,
          region: formData.region,
          householdSize: formData.householdSize,
          kwhUsage: formData.kwhUsage
      };
      winstonLogger.info(`Form submitted: ${JSON.stringify(formData)}`);
      const apiUrl = process.env.API_URL || 'http://enersave-prod-backend:3000/api';
      const response = await axios.post(apiUrl, apiData);
      winstonLogger.info(`API request sent to /api with data: ${JSON.stringify(apiData)}`);
      if (response.status !== 200) {
          throw new Error('Error in fetching data from the API');
      }
      winstonLogger.info(`API response received: ${JSON.stringify(response.data)}`);
      res.render('results', { 
          title: 'Comparison Results', 
          results: response.data 
      });
  } catch (error) {
      winstonLogger.error(`Error in form submission: ${error.message}`);
      next(error);
  }
});

module.exports = router;
