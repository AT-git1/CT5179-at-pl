import { getPrices } from "./parser.js";

// Verify annual spend accuracy and check for hidden costs
// Unit test here
export function processPlans(plan, householdSize, kwhUsage) {
    let usage;
    if (kwhUsage !== "" && kwhUsage !== null && kwhUsage !== undefined && !isNaN(kwhUsage)) {
        usage = parseFloat(kwhUsage);
        console.log(`Using provided kwhUsage: ${usage}`);
    } else {
        if (householdSize === 1) {
            usage = 2900;
        } else if (householdSize === 2) {
            usage = 4200;
        } else if (householdSize >= 3) {
            usage = 5400;
        }
        console.log(`Using default kwhUsage based on householdSize (${householdSize}): ${usage}`);
    }

    const unitPriceCents = plan.rawPrices.unitPrice;
    const standingCharge = plan.rawPrices.standingCharge;
    const serviceCharge = plan.rawPrices.serviceCharge;
    const obligationPayment = plan.rawPrices.obligationPayment;

    console.log(`Plan prices: unitPriceCents=${unitPriceCents}, standingCharge=${standingCharge}, serviceCharge=${serviceCharge}, obligationPayment=${obligationPayment}`);

    let annualSpend = standingCharge + obligationPayment + serviceCharge + ((usage * unitPriceCents) / 100);
    annualSpend = Math.round(annualSpend);

    console.log(`Calculated annualSpend: ${annualSpend}`);

    return annualSpend;
}

export function getBestPlan(plans) {
    // Sort plans by cost
    plans.sort((a, b) => a.cost - b.cost);

    console.log(`Sorted plans by cost: ${plans.map(plan => plan.cost)}`);

    // Return the best plan (first in the sorted list)
    return plans[0];
}

export async function getPlans(providers, region, householdSize, kwhUsage) {
    console.log(`Fetching plans for providers: ${providers}, region: ${region}`);
    let plans = await getPrices(providers, region);
    console.log(`Fetched plans: ${plans}`);

    for (const plan of plans) {
        plan.cost = processPlans(plan, householdSize, kwhUsage);
        console.log(`Processed plan with cost: ${plan.cost}`);
        delete plan.rawPrices;
    }

    console.log(`Final processed plans: ${plans}`);

    return plans;
}
