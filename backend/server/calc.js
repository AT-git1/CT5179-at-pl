import { getPrices } from "./parser.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILENAME = path.basename(__filename);

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

    if (isNaN(annualSpend) || !isFinite(annualSpend)) {
        console.error(`[${FILENAME}] Error: annualSpend is invalid for plan ${plan.planName}. Check input values.`);
        return null; // Return null instead of 0 for invalid calculations
    } else {
        return Math.round(annualSpend);
    }
}

// Function to determine the best plan
export function getBestPlan(plans) {
    // Filter out plans with invalid costs
    const validPlans = plans.filter(plan => plan.cost !== null && isFinite(plan.cost));

    if (validPlans.length === 0) {
        console.error(`[${FILENAME}] No valid plans found.`);
        return null;
    }

    // Sort valid plans by cost
    validPlans.sort((a, b) => a.cost - b.cost);

    // Return the best plan (first in the sorted list)
    console.log(`[${FILENAME}] Best plan determined:`, JSON.stringify(validPlans[0], null, 2));
    return validPlans[0];
}

export async function getPlans(providers, region, householdSize, kwhUsage) {
    try {
        console.log(`[${FILENAME}] Fetching plans for providers: ${providers}, region: ${region}, householdSize: ${householdSize}, kwhUsage: ${kwhUsage}`);

        let rawPlans = await getPrices(providers, region);
        console.log(`[${FILENAME}] Raw plans retrieved: ${JSON.stringify(rawPlans, null, 2)}`);

        let processedPlans = rawPlans.map(plan => {
            let cost = processPlans(plan, householdSize, kwhUsage);
            console.log(`[${FILENAME}] Processed plan: ${plan.planName}, cost: ${cost}`);
            return {...plan, cost};
        }).filter(plan => plan.cost !== null);

        console.log(`[${FILENAME}] Processed plans: ${JSON.stringify(processedPlans, null, 2)}`);

        if (processedPlans.length === 0) {
            throw new Error('No valid plans retrieved after processing');
        }

        const bestPlan = getBestPlan(processedPlans);

        if (!bestPlan) {
            throw new Error('Unable to determine best plan');
        }

        console.log(`[${FILENAME}] Best plan determined: ${JSON.stringify(bestPlan, null, 2)}`);
        return { plans: processedPlans, bestPlan };
    } catch (error) {
        console.error(`[${FILENAME}] Error in getPlans: ${error.message}`);
        throw error; // Re-throw the error to be handled by the caller
    }
}