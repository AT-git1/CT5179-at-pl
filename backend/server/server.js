import express from 'express';
import dummyData from './dummyResponse.js'; // Import the dummy data

const app = express();

app.use(express.json());

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

// React on 3000, express on 3001
app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
