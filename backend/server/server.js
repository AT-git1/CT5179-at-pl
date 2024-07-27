import express from 'express';
import {getPlans} from "./calc.js";
import {getBestPlan} from "./calc.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

//Todo: Amend this comment to reflect changes in functionality
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


// Replace the existing /api POST route to return dummy data with the best plan
app.post('/api', async (req, res) => {
    const body = req.body;
    let providers = ["yuno", "pinergy", "elec", "energia", "sse", "flogas"];
    const currentProvider = body.currentProvider;
    if (currentProvider !== "none" && currentProvider !== "other") {
        const indexToRemove = providers.indexOf(currentProvider);
        providers.splice(indexToRemove, 1);
    }
    const householdSize = body.householdSize;
    const kwhUsage = body.kwhUsage;
    const region = body.region;

    try {
        const plans = await getPlans(providers, region, householdSize, kwhUsage);
        const bestPlan = getBestPlan(plans);
        res.json({
            bestPlan: bestPlan,
            plans: plans
        });
    } catch (error) {
        console.error('Error processing API request:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
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
        res.redirect(`/results?data=${encodeURIComponent(JSON.stringify(apiResponse))}`);
    } catch (error) {
        console.error('Error processing comparison:', error);
        res.status(500).send('An error occurred while processing your request');
    }
});



const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});