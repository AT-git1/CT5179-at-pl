import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Express router for saving form data.
 * @type {import('express').Router}
 */
const router = express.Router();

router.get('/results', (req, res) => {
  console.log('Received request for /results');
  res.sendFile(path.join(__dirname, 'public', 'results.html'), (err) => {
    if (err) {
      console.error('Error sending results.html:', err);
      res.status(500).send('Error loading results page');
    } else {
      console.log('Results page sent successfully');
    }
  });
});

/**
 * POST /save-form
 * Saves form data to a file.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
router.post('/save-form', express.json(), (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);

  const dataDir = path.join(__dirname, '../data');
  const filePath = path.join(dataDir, 'formData.txt');

  // Ensure the data directory exists
  if (!fs.existsSync(dataDir)) {
    console.log(`Data directory does not exist. Creating directory at: ${dataDir}`);
    fs.mkdirSync(dataDir);
  } else {
    console.log(`Data directory exists at: ${dataDir}`);
  }

  // Append the form data to the file
  fs.appendFile(filePath, JSON.stringify(formData) + '\n', (err) => {
    if (err) {
      console.error('Error saving form data:', err);
      return res.status(500).json({ message: 'Failed to save form data' });
    }
    console.log(`Form data saved successfully to: ${filePath}`);
    res.status(200).json({ message: 'Form data saved successfully' });
  });
});

export default router;
