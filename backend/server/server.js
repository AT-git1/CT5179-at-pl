import express from 'express';
import getPlans from "./calc.js";

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
//Todo: unit test here
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
app.post('/api', express.json(), async (req, res) => {
    const body = req.body;

    //Remove the current provider from the list of providers to scrape
    let providers = ["yuno", "pinergy", "elec", "energia"];
    const currentProvider = body.currentProvider;
    if (currentProvider !== "none" && currentProvider !== "other") {
        const indexToRemove = providers.indexOf(currentProvider);
        providers.splice(indexToRemove, 1);
    }

    const householdSize = body.householdSize;
    const kwhUsage = body.kwhUsage;
    const region = body.region;

    const plans = await getPlans(providers, region, householdSize, kwhUsage);
    const bestPlan = getBestPlan(plans);


    res.json({
        bestPlan: bestPlan,
        plans: plans
    });

});

//express on 3001
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});