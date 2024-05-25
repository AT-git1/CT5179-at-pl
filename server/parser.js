//scrape and parse website data to send to the calculator

import axios from "axios";
import * as cheerio from "cheerio";

//Todo: Add providers
//Todo: Look into implementing gas/dual (discuss with team + supervisor)
async function getYunoHtml() {
    //scraping Yuno
    const yunoURL = "https://yunoenergy.ie/pricing-page";
    const yunoRes = await axios.get(yunoURL);
    return yunoRes.data;
}

async function getElecHtml() {
    //scraping Electric Ireland
    const elecURL = "https://www.electricireland.ie/switch/new-customer/price-plans?priceType=D";
    const elecRes = await axios.get(elecURL);
    return elecRes.data;
}

async function getPinergyHtml() {
    //scraping Pinergy
    const pinergyURL = "https://pinergy.ie/terms-conditions/tariffs/?tab=2";
    const pinergyRes = await axios.get(pinergyURL);
    return pinergyRes.data;
}

async function getEnergiaHtml() {
    //scraping Energia
    const energiaURL = "https://www.energia.ie/about-energia/our-tariffs";
    const energiaRes = await axios.get(energiaURL);
    return energiaRes.data;
}

//Todo: move from hardcoded test prices to scraped prices
function getYunoPrices(interest, loc) {

    //parsing Yuno
    const yunoHtml = cheerio.load(getYunoHtml());
    //const yunoUrban = yunoHtml("dt");
    //const yunoRural = yunoHtml("dt");

    //Organise Yuno prices into structured data
    const yuno = {
        "urban": {
            "unitPriceCents": 35.48,
            "standingChargeAnnual": 264.73,
            "obligationPayment": 0.00

        },
        "rural": {
            "unitPriceCents": 35.48,
            "standingChargeAnnual": 326.24,
            "obligationPayment": 0.00
        }
    }
    return yuno
}

function getElecPrices(interest, loc) {


    //parsing Electric Ireland
    const elecHtml = cheerio.load(getElecHtml());
    //const elecUrban = elecHtml("[data-meter-type=Standard]");
    //const elecRural = elecHtml("[data-meter-type=Standard]");

    //Organise Electric Ireland prices into structured data
    const elec = {
        "urban": {
            "unitPriceCents": 37.03,
            "standingChargeAnnual": 283.47,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12

        },
        "rural": {
            "unitPriceCents": 37.03,
            "standingChargeAnnual": 313.78,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        }
    }
    return elec;
}


function getPinergyPrices(interest, loc) {


    //parsing Pinergy
    const pinergyHtml = cheerio.load(getPinergyHtml());
    //const pinergyUrban = pinergyHtml('h2:contains("Urban")');
    //const pinergyRural = pinergyHtml('h2:contains("Rural")');

    //Organise Pinergy prices into structured data
    const pinergy = {
        "urban": {
            "unitPriceCents": 37.03,
            "standingChargeAnnual": 283.47,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12

        },
        "rural": {
            "unitPriceCents": 37.03,
            "standingChargeAnnual": 313.78,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        }
    }
    return pinergy;
}

function getEnergiaPrices(interest, loc) {

    //parsing Energia
    const energiaHtml = cheerio.load(getEnergiaHtml());
    //const energiaUrban = energiaHtml("[contains(width: 100%)]");
    //const energiaRural = energiaHtml("[contains(width: 100%)]");

    //Organise Energia prices into structured data
    const energia = {
        "urban": {
            "unitPriceCents": 37.03,
            "standingChargeAnnual": 283.47,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12

        },
        "rural": {
            "unitPriceCents": 37.03,
            "standingChargeAnnual": 313.78,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        }
    }
    return energia;
}

//Todo: refactor to dynamically generate JSON
function getPrices(providers, interest, loc) {

    let yunoData = "";
    let pinergyData = "";
    let elecData = "";
    let energiaData = "";

    if (providers.includes("yuno")) {
        yunoData = getYunoPrices(interest, loc);
    }
    if (providers.includes("pinergy")) {
        pinergyData = getPinergyPrices(interest, loc);
    }
    if (providers.includes("elec")) {
        elecData = getElecPrices(interest, loc);
    }
    if (providers.includes("energia")) {
        energiaData = getEnergiaPrices(interest, loc);
    }

    const response = {
        "yuno": yunoData,
        "pinergy": pinergyData,
        "elec": elecData,
        "energia": energiaData
    }
    return response;
}

export default getPrices;