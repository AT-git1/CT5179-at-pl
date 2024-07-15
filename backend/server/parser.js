import axios from "axios";
import * as cheerio from "cheerio";

async function getYunoHtml() {
    const yunoURL = "https://yunoenergy.ie/pricing-page";
    const yunoRes = await axios.get(yunoURL);
    return yunoRes.data;
}

async function getElecHtml() {
    const elecURL = "https://www.electricireland.ie/switch/new-customer/price-plans?priceType=D";
    const elecRes = await axios.get(elecURL);
    return elecRes.data;
}

async function getPinergyHtml() {
    const pinergyURL = "https://pinergy.ie/terms-conditions/tariffs/?tab=2";
    const pinergyRes = await axios.get(pinergyURL);
    return pinergyRes.data;
}

async function getEnergiaHtml() {
    const energiaURL = "https://www.energia.ie/about-energia/our-tariffs";
    const energiaRes = await axios.get(energiaURL);
    return energiaRes.data;
}

async function getYunoPrices() {
    const yunoHtml = await getYunoHtml();
    const $ = cheerio.load(yunoHtml);

    // Example selectors, adjust as needed
    const urbanPrice = parseFloat($("selector-for-urban-price").text());
    const ruralPrice = parseFloat($("selector-for-rural-price").text());
    const urbanStandingCharge = parseFloat($("selector-for-urban-standing-charge").text());
    const ruralStandingCharge = parseFloat($("selector-for-rural-standing-charge").text());

    const yuno = {
        "urban": {
            "unitPriceCents": urbanPrice,
            "standingChargeAnnual": urbanStandingCharge,
            "obligationPayment": 0.00
        },
        "rural": {
            "unitPriceCents": ruralPrice,
            "standingChargeAnnual": ruralStandingCharge,
            "obligationPayment": 0.00
        }
    };
    return yuno;
}

async function getElecPrices() {
    const elecHtml = await getElecHtml();
    const $ = cheerio.load(elecHtml);

    // Example selectors, adjust as needed
    const urbanPrice = parseFloat($("selector-for-urban-price").text());
    const ruralPrice = parseFloat($("selector-for-rural-price").text());
    const urbanStandingCharge = parseFloat($("selector-for-urban-standing-charge").text());
    const ruralStandingCharge = parseFloat($("selector-for-rural-standing-charge").text());

    const elec = {
        "urban": {
            "unitPriceCents": urbanPrice,
            "standingChargeAnnual": urbanStandingCharge,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        },
        "rural": {
            "unitPriceCents": ruralPrice,
            "standingChargeAnnual": ruralStandingCharge,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        }
    };
    return elec;
}

async function getPinergyPrices() {
    const pinergyHtml = await getPinergyHtml();
    const $ = cheerio.load(pinergyHtml);

    // Example selectors, adjust as needed
    const urbanPrice = parseFloat($("selector-for-urban-price").text());
    const ruralPrice = parseFloat($("selector-for-rural-price").text());
    const urbanStandingCharge = parseFloat($("selector-for-urban-standing-charge").text());
    const ruralStandingCharge = parseFloat($("selector-for-rural-standing-charge").text());

    const pinergy = {
        "urban": {
            "unitPriceCents": urbanPrice,
            "standingChargeAnnual": urbanStandingCharge,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        },
        "rural": {
            "unitPriceCents": ruralPrice,
            "standingChargeAnnual": ruralStandingCharge,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        }
    };
    return pinergy;
}

async function getEnergiaPrices() {
    const energiaHtml = await getEnergiaHtml();
    const $ = cheerio.load(energiaHtml);

    // Example selectors, adjust as needed
    const urbanPrice = parseFloat($("selector-for-urban-price").text());
    const ruralPrice = parseFloat($("selector-for-rural-price").text());
    const urbanStandingCharge = parseFloat($("selector-for-urban-standing-charge").text());
    const ruralStandingCharge = parseFloat($("selector-for-rural-standing-charge").text());

    const energia = {
        "urban": {
            "unitPriceCents": urbanPrice,
            "standingChargeAnnual": urbanStandingCharge,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        },
        "rural": {
            "unitPriceCents": ruralPrice,
            "standingChargeAnnual": ruralStandingCharge,
            "obligationPayment": 0.00,
            "serviceChargeAnnual": 163.12
        }
    };
    return energia;
}

async function getPrices(providers, interest, loc) {
    let yunoData = "";
    let pinergyData = "";
    let elecData = "";
    let energiaData = "";

    if (providers.includes("yuno")) {
        yunoData = await getYunoPrices();
    }
    if (providers.includes("pinergy")) {
        pinergyData = await getPinergyPrices();
    }
    if (providers.includes("elec")) {
        elecData = await getElecPrices();
    }
    if (providers.includes("energia")) {
        energiaData = await getEnergiaPrices();
    }

    const response = {
        "yuno": yunoData,
        "pinergy": pinergyData,
        "elec": elecData,
        "energia": energiaData
    };
    return response;
}

export default getPrices;
