import express from 'express';
import getData from './calc.js';

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

app.post('/api', async (req, res) => {
    const { providers, interest, loc } = req.body;
    const data = await getData(providers, interest, loc);
    const bestPlan = getBestPlan(data);
    res.json({
        bestPlan: bestPlan,
        plans: data
    });
});

function getBestPlan(plans) {
    let bestPlan = null;
    let lowestCost = Infinity;

    for (const [provider, costs] of Object.entries(plans)) {
        const { annualSpendLow, annualSpendMedium, annualSpendHigh } = costs;
        const averageCost = (annualSpendLow + annualSpendMedium + annualSpendHigh) / 3;

        if (averageCost < lowestCost) {
            lowestCost = averageCost;
            bestPlan = { provider, ...costs };
        }
    }

    return bestPlan;
}

app.get('/results', (req, res) => {
    res.render('results', { title: 'Best Energy Plan', results: req.query });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
