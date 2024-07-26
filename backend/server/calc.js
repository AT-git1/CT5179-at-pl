//get Data from the parser and perform calculations on it to send to front end

import {getPrices} from "./parser.js";

//Todo: Verify annual spend accuracy and check for hidden costs
//Todo: unit test here
export function processPlans(plan, householdSize, kwhUsage) {
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

export function getBestPlan(plans) {
    // Sort plans by cost
    plans.sort((a, b) => {
        if (a.cost !== b.cost) {
            return a.cost - b.cost;
        }
    });

    // Return the best plan (first in the sorted list)
    return plans[0];
}

export async function getPlans(providers, region, householdSize, kwhUsage) {
    let plans = await getPrices(providers, region);
    for (const plan of plans) {
        plan.cost = processPlans(plan, householdSize, kwhUsage);
        delete plan.rawPrices;
    }
    return plans;
}
