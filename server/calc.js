//get Data from the parser and perform calculations on it to send to front end

import getPrices from "./parser.js";

//Todo: Get household size from FE and only return relevant one
//Todo: Verify annual spend accuracy and check for hidden costs
function getData(providers, interest, loc) {
    const prices = getPrices(providers, interest, loc);
    const provArray = providers.split("|");
    let response = {};

    provArray.forEach((prov) => {
        let standingChargeAnnual = prices[prov][loc].standingChargeAnnual;
        let unitPriceCents = prices[prov][loc].unitPriceCents;
        let obligationPayment = prices[prov][loc].obligationPayment;
        let annualSpendLow = standingChargeAnnual + obligationPayment + ((2900 * unitPriceCents)/100)
        let annualSpendMedium = standingChargeAnnual + obligationPayment + ((4200 * unitPriceCents)/100);
        let annualSpendHigh = standingChargeAnnual + obligationPayment + ((5400 * unitPriceCents)/100)

        response[prov] = {
            "annualSpendLow": Math.round(annualSpendLow),
            "annualSpendMedium": Math.round(annualSpendMedium),
            "annualSpendHigh": Math.round(annualSpendHigh),
        };

    })
    return response;

}

export default getData;