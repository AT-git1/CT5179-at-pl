import getPrices from "./parser.js";

function calculateAnnualSpend(data, usageLevel) {
    const usage = {
        low: 2900,
        medium: 4200,
        high: 5400
    }[usageLevel];

    const { unitPriceCents, standingChargeAnnual, obligationPayment, serviceChargeAnnual = 0 } = data;
    return standingChargeAnnual + obligationPayment + serviceChargeAnnual + ((usage * unitPriceCents) / 100);
}

async function getData(providers, interest, loc) {
    const prices = await getPrices(providers, interest, loc);
    let response = {};
    for (const prov of Object.keys(prices)) {
        let data = prices[prov][loc]; // Assuming prices object is structured correctly
        if (data) {
            let annualSpendLow = calculateAnnualSpend(data, 'low');
            let annualSpendMedium = calculateAnnualSpend(data, 'medium');
            let annualSpendHigh = calculateAnnualSpend(data, 'high');
            response[prov] = { annualSpendLow, annualSpendMedium, annualSpendHigh };
        }
    }
    console.log("Calculated Data:", response); // Add logging
    return response;
}

export default getData;
