//get Data from the parser and perform calculations on it to send to front end

import getPrices from "./parser.js";

//Todo: Verify annual spend accuracy and check for hidden costs
//Todo: unit test here
function processPlans(plan, householdSize, kwhUsage) {
    let usage;
    if (kwhUsage !== "" && kwhUsage !== null && kwhUsage !== undefined) {
        usage = kwhUsage;
    }
    else {
        if (householdSize === 1) {
            usage = 2900;
        } else if (householdSize === 2) {
            usage = 4200;
        } else if (householdSize >= 3) {
            usage = 5400;
        }
    }

    const unitPriceCents = plan.rawPrices.unitPrice;
    const standingCharge = plan.rawPrices.standingCharge;
    const serviceCharge = plan.rawPrices.serviceCharge;
    const obligationPayment = plan.rawPrices.obligationPayment;

    let annualSpend = standingCharge + obligationPayment + serviceCharge + ((usage * unitPriceCents)/100);
    annualSpend = Math.round(annualSpend);

    return annualSpend;
}

async function getPlans(providers, region, householdSize, kwhUsage) {
    let plans = await getPrices(providers, region);
    console.log("household size = " + householdSize);
    console.log("kwhUsage = " + kwhUsage);
    for (const plan of plans) {
        plan.cost = processPlans(plan, householdSize, kwhUsage);
        delete plan.rawPrices;
    }
    return plans;
}

export default getPlans;