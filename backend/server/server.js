
import express from 'express';
import dummyData from './dummyResponse.js'; // Import the dummy data

const app = express();

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
function getBestPlan(plans) {
    // Sort plans by cost, then by savings (in descending order), and finally by cash-back (in descending order)
    plans.sort((a, b) => {
        if (a.cost !== b.cost) {
            return a.cost - b.cost;
        } else if (a.savings !== b.savings) {
            return b.savings - a.savings;
        } else {
            return b.cashBack - a.cashBack;
        }
    });

    // Return the best plan (first in the sorted list)
    return plans[0];
}

// Replace the existing /api POST route to return dummy data with the best plan
app.post('/api', express.json(), (req, res) => {
    const bestPlan = getBestPlan(dummyData.plans);
    res.json({
        bestPlan: bestPlan,
        plans: dummyData.plans
    });
});

//express on 3001
app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
