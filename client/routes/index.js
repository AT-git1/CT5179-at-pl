const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const winstonLogger = require('../config/logger');
const path = require('path');

// Get the current filename
const currentFileName = path.basename(__filename);

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

      // Log the form submission with the filename
      winstonLogger.info(`[${currentFileName}] Form submitted: ${JSON.stringify(formData)}`);

      const apiUrl = process.env.API_URL || 'https://enersaveapi.azurewebsites.net/api';
      
      // Log the API request with the filename
      winstonLogger.info(`[${currentFileName}] Sending API request to ${apiUrl} with data: ${JSON.stringify(apiData)}`);
      
      const response = await axios.post(apiUrl, apiData);

      // Check the response status
      if (response.status !== 200) {
          throw new Error('Error in fetching data from the API');
      }

      // Log the API response with the filename
      winstonLogger.info(`[${currentFileName}] API response received: ${JSON.stringify(response.data)}`);
      
      // Render the results
      res.render('results', { 
          title: 'Comparison Results', 
          results: response.data 
      });
  } catch (error) {
      // Log the error with the filename
      winstonLogger.error(`[${currentFileName}] Error in form submission: ${error.message}`);
      next(error);
  }
});

module.exports = router;
