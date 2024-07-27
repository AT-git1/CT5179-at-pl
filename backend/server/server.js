import express from 'express';
import { getPlans, getBestPlan } from './calc.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILENAME = path.basename(__filename); // Get the filename for logging

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

/**
 * This code defines an Express server that calculates and returns the best plan from a list of
 * dummy data based on cost, savings, and cash-back.
 * @param plans - The `plans` parameter in the code snippet refers to an array of plan objects. Each
 * plan object contains information such as cost, savings, and cash-back. The `getBestPlan` function
 * sorts these plan objects based on cost, savings, and cash-back to determine the best plan, and then
 * @returns The code snippet provided is an Express server that defines a POST route at '/api'. When a
 * POST request is made to this route, it calculates the best plan from the dummy data using the
 * `getBestPlan` function and returns a JSON response containing the best plan and the list of plans.
 */

// Function to determine the best plan
// Todo: unit test here

// Replace the existing /api POST route to return dummy data with the best plan
app.post('/api', async (req, res) => {
    const body = req.body;
    let providers = ["yuno", "pinergy", "elec", "energia"];
    const currentProvider = body.currentProvider;
    const householdSize = body.householdSize;
    const kwhUsage = body.kwhUsage;
    const region = body.region;

    console.log(`[${FILENAME}] API request received with data:`, JSON.stringify(body, null, 2));

    try {
        if (currentProvider !== "none" && currentProvider !== "other") {
            const indexToRemove = providers.indexOf(currentProvider);
            if (indexToRemove !== -1) {
                providers.splice(indexToRemove, 1);
            }
        }

        console.log(`[${FILENAME}] Providers after filtering:`, providers);

        const plans = await getPlans(providers, region, householdSize, kwhUsage);
        console.log(`[${FILENAME}] Plans retrieved:`, JSON.stringify(plans, null, 2));

        if (!Array.isArray(plans) || plans.length === 0) {
            throw new Error('No valid plans retrieved');
        }

        const bestPlan = getBestPlan(plans);
        console.log(`[${FILENAME}] Best plan:`, JSON.stringify(bestPlan, null, 2));

        if (!bestPlan) {
            throw new Error('Unable to determine the best plan');
        }

        const response = {
            bestPlan: bestPlan,
            plans: plans
        };

        console.log(`[${FILENAME}] API response:`, JSON.stringify(response, null, 2));

        res.json(response);
    } catch (error) {
        console.error(`[${FILENAME}] Error processing API request:`, error);
        res.status(500).json({
            error: 'An error occurred while processing your request',
            details: error.message,
            stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
        });
    }
});

// Add a new route for form submissions that uses the API endpoint internally
app.post('/compare', async (req, res) => {
    try {
        // Make an internal request to the API endpoint
        const apiResponse = await new Promise((resolve, reject) => {
            app.handle(
                { method: 'POST', url: '/api', body: req.body, headers: { 'content-type': 'application/json' } },
                { json: (data) => resolve(data), status: (s) => ({ json: (data) => reject(new Error(data)) }) }
            );
        });

        // Redirect to results page with the API response data
        const redirectUrl = `/results?data=${encodeURIComponent(JSON.stringify({
            bestPlan: encodeURIComponent(JSON.stringify(apiResponse.bestPlan)),
            plans: encodeURIComponent(JSON.stringify(apiResponse.plans))
        }))}`;
        console.log(`[${FILENAME}] Redirect URL:`, redirectUrl);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error(`[${FILENAME}] Error processing comparison:`, error);
        res.status(500).send('An error occurred while processing your request');
    }
});

// Express server listening on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[${FILENAME}] Server running on port ${port}`);
});
