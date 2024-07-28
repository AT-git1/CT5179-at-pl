import express from 'express';
import { getPlans } from './calc.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILENAME = path.basename(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

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

    const results = await getPlansWithTimeout(providers, region, householdSize, kwhUsage);
    console.log(`[${FILENAME}] Plans retrieved:`, JSON.stringify(results, null, 2));

    // Check if the results object contains no valid plans
    if (!results?.plans?.length) {
        throw new Error('No valid plans retrieved');
    }

    return results;
}

/**
 * Function to handle fetching plans with a timeout.
 * @param {Array} providers - List of providers to fetch plans from.
 * @param {string} region - The region of the user.
 * @param {number} householdSize - The size of the household.
 * @param {number} kwhUsage - The kWh usage of the household.
 * @returns {Object} - The result containing the best plan and the list of plans.
 */
async function getPlansWithTimeout(providers, region, householdSize, kwhUsage) {
    const timeoutDuration = 5000; // 5 seconds timeout for each provider request
    const results = { plans: [], bestPlan: null }; // Initialize results object

    // Iterate over each provider to fetch plans
    for (const provider of providers) {
        try {
            // Fetch plans with a timeout; destructure the response
            const { plans, bestPlan } = await withTimeout(getPlans([provider], region, householdSize, kwhUsage), timeoutDuration);
            
            // If plans are returned, add them to the results
            if (plans?.length > 0) {
                results.plans.push(...plans);
            }
            
            // Determine the best plan based on cost
            if (bestPlan?.bestPlan && (!results.bestPlan || bestPlan.bestPlan.cost < results.bestPlan.cost)) {
                results.bestPlan = bestPlan.bestPlan; // Update best plan if current is cheaper
            }
        } catch (error) {
            // Log any errors encountered while fetching plans
            console.error(`[${FILENAME}] Error fetching plans for provider ${provider}: ${error.message}`);
        }
    }

    // If no best plan was found, calculate the best plan from the fetched plans
    if (!results.bestPlan && results.plans.length > 0) {
        results.bestPlan = results.plans.reduce((min, p) => p.cost < min.cost ? p : min, results.plans[0]);
    }

    return results; // Return the results object containing plans and the best plan
}

/**
 * Function to wrap a promise with a timeout.
 * @param {Promise} promise - The promise to wrap.
 * @param {number} ms - The timeout duration in milliseconds.
 * @returns {Promise} - The wrapped promise.
 */
function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
        // Set a timer to reject the Promise if it takes longer than the specified duration
        const timer = setTimeout(() => {
            reject(new Error('Request timed out'));
        }, ms);

        promise
            .then((value) => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch((error) => {
                clearTimeout(timer); 
                reject(new Error(error));
            });
    });
}

// Route to handle API requests for plan comparison
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
      console.log('Results:', JSON.stringify(results, null, 2));
      res.json(results);
    } catch (error) {
      console.error(`[${FILENAME}] Error processing form submission: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[${FILENAME}] Server running on port ${port}`);
});
