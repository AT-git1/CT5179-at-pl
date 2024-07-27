import { getPrices } from "./parser.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILENAME = path.basename(__filename); // Get the filename for logging

// Verify annual spend accuracy and check for hidden costs
// Unit test here
export function processPlans(plan, householdSize, kwhUsage) {
    let usage;
    if (kwhUsage && !isNaN(kwhUsage) && kwhUsage !== "") {
        usage = parseFloat(kwhUsage);
    } else {
        // Default values based on household size
        if (householdSize == 1) {
            usage = 2900;
        } else if (householdSize == 2) {
            usage = 4200;
        } else {
            usage = 5400;
        }
    }

    console.log(`[${FILENAME}] Using kwhUsage: ${usage} for household size: ${householdSize}`);

    const unitPriceCents = plan.rawPrices.unitPrice || 0;
    const standingCharge = plan.rawPrices.standingCharge || 0;
    const serviceCharge = plan.rawPrices.serviceCharge || 0;
    const obligationPayment = plan.rawPrices.obligationPayment || 0;

    console.log(`[${FILENAME}] Plan prices: unitPriceCents=${unitPriceCents}, standingCharge=${standingCharge}, serviceCharge=${serviceCharge}, obligationPayment=${obligationPayment}`);

    let annualSpend = standingCharge + obligationPayment + serviceCharge + ((usage * unitPriceCents) / 100);
    
    if (isNaN(annualSpend)) {
        console.error(`[${FILENAME}] Error: annualSpend is NaN. Check input values.`);
        annualSpend = 0;
    } else {
        annualSpend = Math.round(annualSpend);
    }

    console.log(`[${FILENAME}] Calculated annualSpend: ${annualSpend}`);

    return annualSpend;
}

export function getBestPlan(plans) {
    // Sort plans by cost
    plans.sort((a, b) => {
        if (a.cost !== b.cost) {
            return (a.cost || Infinity) - (b.cost || Infinity);
        }
    });

    // Return the best plan (first in the sorted list)
    console.log(`[${FILENAME}] Best plan determined:`, plans[0]);
    return plans[0];
}

export async function getPlans(providers, region, householdSize, kwhUsage) {
    let plans = await getPrices(providers, region);
    for (const plan of plans) {
        plan.cost = processPlans(plan, householdSize, kwhUsage);
    }
    console.log(`[${FILENAME}] Processed plans: ${JSON.stringify(plans)}`);
    return plans;
}