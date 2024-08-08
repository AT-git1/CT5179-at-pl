import express from 'express';
import { getPlans } from './server/calc.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILENAME = path.basename(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Todo: Amend this comment to reflect changes in functionality
/**
 * Function to handle fetching and processing plans.
 * @param {string} currentProvider - The current energy provider.
 * @param {string} region - The region of the user.
 * @param {number} householdSize - The size of the household.
 * @param {number} kwhUsage - The kWh usage of the household.
 * @returns {Object} - The result containing the best plan and the list of plans.
 */
async function fetchAndProcessPlans(currentProvider, region, householdSize, kwhUsage) {
    const providers = ["yuno", "pinergy", "elec", "energia", "sse", "flogas"].filter(p => p !== currentProvider);
    console.log(`[${FILENAME}] Providers after filtering:`, providers);


    const results = await getPlans(providers, region, householdSize, kwhUsage);
    console.log(`[${FILENAME}] Plans retrieved:`, JSON.stringify(results, null, 2));

    if (!results || !results.plans || results.plans.length === 0) {
        throw new Error('No valid plans retrieved');

    }

    return results;
}

// Route to handle API requests for plan comparison functionality TEST
app.post('/api', async (req, res) => {
    const { currentProvider, region, householdSize, kwhUsage } = req.body;
    console.log(`[${FILENAME}] API request received with data:`, JSON.stringify(req.body, null, 2));

    try {
        const results = await fetchAndProcessPlans(currentProvider, region, householdSize, kwhUsage);
        console.log(`[${FILENAME}] Sending response to client`);
        res.json(results);
    } catch (error) {
        console.error(`[${FILENAME}] Error processing API request: ${error.message}`);
        console.error(`[${FILENAME}] Error stack: ${error.stack}`);
        res.status(500).json({ error: error.message });
    }
});

// Route to handle form submissions for plan comparison
app.post('/compare', async (req, res) => {
    const { currentProvider, region, householdSize, kwhUsage } = req.body;

    try {
        const results = await fetchAndProcessPlans(currentProvider, region, householdSize, kwhUsage);
        res.json(results);
    } catch (error) {
        console.error(`[${FILENAME}] Error processing form submission: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Start the Express.js server
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`[${FILENAME}] Server running on port ${port}`);
});
