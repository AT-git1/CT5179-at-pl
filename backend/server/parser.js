/**
 * The code defines functions to scrape electricity pricing information from different providers'
 * websites and returns the prices for specified providers.
 * @returns The `getPrices` function returns an object containing pricing information for different
 * energy providers based on the input parameters. The object includes data for Yuno, Pinergy, Electric
 * Ireland (elec), and Energia. Each provider's data includes unit price, standing charge, obligation
 * payment, and service charge (where applicable) for both urban and rural locations.
 */
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteerScrape from "./scraper.js";


export async function getPage(provider) {
    let url = '';
    let page;

    switch(provider) {
        case "yuno":
            url = "https://yunoenergy.ie/pricing-page";
            break;
        case "pinergy":
            url = "https://pinergy.ie/terms-conditions/tariffs/?tab=2";
            break;
        case "elec":
            url = "https://www.electricireland.ie/switch/new-customer/price-plans?priceType=E";
            break;
        case "energia":
            url = "https://www.energia.ie/about-energia/our-tariffs";
            break;
        case "sse":
            url = "https://www.sseairtricity.com/ie/home/products/electricity-top-discount";
            break;
        case "flogas":
            url = "https://www.flogas.ie/price-plans/residential/detail.html?fuelType=electricity&offerId=4&availability=new_customers";
            break;
    }
    //Puppeteer scraping for dynamic pages
    if (provider === "elec" || provider === "sse" || provider === "flogas") {
        page = await puppeteerScrape(provider, url);
    }
    //Default scraping for static pages
    else {
        const axiosPage = await axios.get(url);
        page = axiosPage.data;
    }
    return page;
}

export async function getPrices(providers, region) {
    let plans = [];

    for await (const provider of providers) {
        const page = await getPage(provider);
        const $ = cheerio.load(page);

        let planName;
        let unitPrice;
        let standingCharge;
        let obligationPayment;
        let serviceCharge;
        let supplier;

        switch(provider) {
            case "yuno":
                const $standardPlanYuno = $('dt:contains("Standard Plan")').first().next('dd');
                //Plan Name
                planName = "Yuno Standard Plan";
                //Supplier
                supplier = "Yuno";
                if(region === 'urban') {

                    const $urbanTable = $standardPlanYuno.find('table:contains("24hr Urban")').first();
                    //Unit Price
                    const $urbanUnitPriceRow = $urbanTable.find('tr:contains("24Hr Unit Rate")').first();
                    const $urbanUnitPriceCell = $urbanUnitPriceRow.find('td').last();
                    unitPrice = parseFloat($urbanUnitPriceCell.text().replace(/€/,''));

                    //Standing Charge
                    const $urbanStandingChargeRow = $urbanTable.find('tr:contains("Urban Standing Charge")').first();
                    const $urbanStandingChargeCell = $urbanStandingChargeRow.find('td').last();
                    standingCharge = parseFloat($urbanStandingChargeCell.text().replace(/€/,''));

                    //Obligation Payment
                    const $urbanObligationPaymentRow = $urbanTable.find('tr:contains("PSO")').first();
                    const $urbanObligationPaymentCell = $urbanObligationPaymentRow.find('td').last();
                    obligationPayment = parseFloat($urbanObligationPaymentCell.text().replace(/€/,''));

                    //Service Charge
                    serviceCharge = 0;
                }
                else if(region === 'rural') {

                    const $ruralTable = $standardPlanYuno.find('table:contains("24hr Rural")').first();
                    //Unit Price
                    const $ruralUnitPriceRow = $ruralTable.find('tr:contains("24Hr Unit Rate")').first();
                    const $ruralUnitPriceCell = $ruralUnitPriceRow.find('td').last();
                    unitPrice = parseFloat($ruralUnitPriceCell.text().replace(/€/,''));

                    //Standing Charge
                    const $ruralStandingChargeRow = $ruralTable.find('tr:contains("Rural Standing Charge")').first();
                    const $ruralStandingChargeCell = $ruralStandingChargeRow.find('td').last();
                    standingCharge = parseFloat($ruralStandingChargeCell.text().replace(/€/,''));

                    //Obligation Payment
                    const $ruralObligationPaymentRow = $ruralTable.find('tr:contains("PSO")').first();
                    const $ruralObligationPaymentCell = $ruralObligationPaymentRow.find('td').last();
                    obligationPayment = parseFloat($ruralObligationPaymentCell.text().replace(/€/,''));

                    //Service Charge
                    serviceCharge = 0;
                }
                break;
            case "pinergy":
                //Plan Name
                planName = "Pinergy 24Hr Standard Plan";
                //Supplier
                supplier = "Pinergy";
                if(region === 'urban') {
                    const $urbanPlanHeader = $('h2:contains("Standard 24 Hr Urban")').first();
                    //Unit Price
                    const $urbanUnitPriceTable = $urbanPlanHeader.nextAll('table:contains("Unit Price")').first();
                    const $urbanUnitPriceRow = $urbanUnitPriceTable.find('tr:contains("Unit Price")');
                    const $urbanUnitPriceCell = $urbanUnitPriceRow.find('td').eq(2);
                    unitPrice = parseFloat($urbanUnitPriceCell.text());

                    //Additional charges global table
                    const $urbanExtraChargesTable = $urbanPlanHeader.nextAll('table:contains("Standing Charges")').first();

                    //Standing Charge
                    const $urbanStandingChargeRow = $urbanExtraChargesTable.find('tr:contains("Standing Charge 24 Hr")').first();
                    const $urbanStandingChargeCell = $urbanStandingChargeRow.find('td').last();
                    standingCharge = parseFloat($urbanStandingChargeCell.text());

                    //Obligation Payment
                    const $urbanObligationPaymentRow = $urbanExtraChargesTable.find('tr:contains("Public Service Obligation")').first();
                    const $urbanObligationPaymentCell = $urbanObligationPaymentRow.find('td').last();
                    obligationPayment = parseFloat($urbanObligationPaymentCell.text());

                    //Service Charge
                    const $urbanServiceChargeRow = $urbanExtraChargesTable.find('tr:contains("Service Charge")').first();
                    const $urbanServiceChargeCell = $urbanServiceChargeRow.find('td').last();
                    serviceCharge = parseFloat($urbanServiceChargeCell.text());
                }
                else if(region === 'rural') {
                    const $ruralPlanHeader = $('h2:contains("Standard 24 Hr Rural")').first();
                    //Unit Price
                    const $ruralUnitPriceTable = $ruralPlanHeader.nextAll('table:contains("Unit Price")').first();
                    const $ruralUnitPriceRow = $ruralUnitPriceTable.find('tr:contains("Unit Price")');
                    const $ruralUnitPriceCell = $ruralUnitPriceRow.find('td').eq(2);
                    unitPrice = parseFloat($ruralUnitPriceCell.text());

                    //Additional charges global table
                    const $ruralExtraChargesTable = $ruralPlanHeader.nextAll('table:contains("Standing Charges")').first();

                    //Standing Charge
                    const $ruralStandingChargeRow = $ruralExtraChargesTable.find('tr:contains("Standing Charge 24 Hr")').first();
                    const $ruralStandingChargeCell = $ruralStandingChargeRow.find('td').last();
                    standingCharge = parseFloat($ruralStandingChargeCell.text());

                    //Obligation Payment
                    const $ruralObligationPaymentRow = $ruralExtraChargesTable.find('tr:contains("Public Service Obligation")').first();
                    const $ruralObligationPaymentCell = $ruralObligationPaymentRow.find('td').last();
                    obligationPayment = parseFloat($ruralObligationPaymentCell.text());

                    //Service Charge
                    const $ruralServiceChargeRow = $ruralExtraChargesTable.find('tr:contains("Service Charge")').first();
                    const $ruralServiceChargeCell = $ruralServiceChargeRow.find('td').last();
                    serviceCharge = parseFloat($ruralServiceChargeCell.text());
                }
                break;
            case "elec":
                //Plan Name
                planName = "Electric Ireland Standard Plan";
                //Supplier
                supplier = "Electric Ireland";
                //Global pricing container
                const $pricesTableElec = $('div#includeVAT_Contant').first();
                //Global unit price table
                const $unitPriceTableElec = $pricesTableElec.find('tbody:contains("unit price")').first();
                const $unitPriceRowElec = $unitPriceTableElec.find('tr:contains("Standard unit price")').first();
                const $unitPriceCellElec = $unitPriceRowElec.find('td').eq(1);
                //Global standing charges table
                const $standingChargeTableElec = $pricesTableElec.find('tbody:contains("Standing charge")').first();
                //Global obligation payment table
                const $obligationPaymentTableElec = $pricesTableElec.find('table:contains("PSO")').first();
                const $obligationPaymentRowElec = $obligationPaymentTableElec.find('tr:contains("Public Service Obligation")').first();
                const $obligationPaymentCellElec = $obligationPaymentRowElec.find('td').eq(1);

                if(region === 'urban') {
                    //Unit Price
                    unitPrice = parseFloat($unitPriceCellElec.text());
                    //Standing Charge
                    const $standingChargeRowElec = $standingChargeTableElec.find('tr:contains("urban")').first();
                    const $standingChargeCellElec = $standingChargeRowElec.find('td').eq(1);
                    standingCharge = parseFloat($standingChargeCellElec.text().replace(/€/,''));
                    //Obligation payment
                    obligationPayment = parseFloat($obligationPaymentCellElec.text().replace(/€/,''));
                    //Service Charge
                    serviceCharge = 0;
                }
                else if(region === 'rural') {
                    //Unit Price
                    unitPrice = parseFloat($unitPriceCellElec.text());
                    //Standing Charge
                    const $standingChargeRowElec = $standingChargeTableElec.find('tr:contains("rural")').first();
                    const $standingChargeCellElec = $standingChargeRowElec.find('td').eq(1);
                    standingCharge = parseFloat($standingChargeCellElec.text().replace(/€/,''));
                    //Obligation payment
                    obligationPayment = parseFloat($obligationPaymentCellElec.text().replace(/€/,''));
                    //Service Charge
                    serviceCharge = 0;
                }
                break;
            case "energia":
                //Plan Name
                planName = "Energia Standard Plan";
                //Supplier
                supplier = "Energia";
                //Global Unit Price table
                const $unitPriceTableEnergia = $('table:contains("Electricity 24 hour prices per unit")').first();
                const $unitPriceRowEnergia = $unitPriceTableEnergia.find('tr:contains("Standard 24hr unit price")');
                const $unitPriceCellEnergia = $unitPriceRowEnergia.find('td').eq(1);
                //Global Standing Charge table
                const $standingChargeTable = $('table:contains("Electricity standing charges per year")').first();
                if(region === 'urban') {
                    //Unit Price
                    unitPrice = parseFloat($unitPriceCellEnergia.text());
                    //Standing Charge
                    const $urbanStandingChargeRow = $standingChargeTable.find('tr:contains("urban")').first();
                    const $urbanStandingChargeCell = $urbanStandingChargeRow.find('td').eq(1);
                    standingCharge = parseFloat($urbanStandingChargeCell.text().replace(/€/,''));
                    //Obligation Payment
                    obligationPayment = 0;
                    //Service Charge
                    serviceCharge = 0;
                }
                else if(region === 'rural') {
                    //Unit Price
                    unitPrice = parseFloat($unitPriceCellEnergia.text());
                    //Standing Charge
                    const $ruralStandingChargeRow = $standingChargeTable.find('tr:contains("rural")').first();
                    const $ruralStandingChargeCell = $ruralStandingChargeRow.find('td').eq(1);
                    standingCharge = parseFloat($ruralStandingChargeCell.text().replace(/€/,''));
                    //Obligation Payment
                    obligationPayment = 0;
                    //Service Charge
                    serviceCharge = 0;
                }
                break;
            case "sse":
                //Plan Name
                planName = "SSE Airtricity Standard Plan";
                //Supplier
                supplier = "SSE Airtricity";
                //Global unit price table
                const $unitPriceTableSSE = $('table:contains("Night Saver meter (Day)")').first();
                const $unitPriceRowSSE = $unitPriceTableSSE.find('tr:contains("24hr meter")').first();
                const $unitPriceCellSSE = $unitPriceRowSSE.find('td').eq(1);
                //Global standing charges table
                const $standingChargeTableSSE = $('table:contains("Urban 24hr meter")').first();
                //Global obligation payment table
                const $obligationPaymentTableSSE = $('table:contains("Cost per year")').first();
                const $obligationPaymentCellSSE = $obligationPaymentTableSSE.find('td').first();

                if(region === 'urban') {
                    //Unit Price
                    unitPrice = parseFloat($unitPriceCellSSE.text());
                    //Standing Charge
                    const $standingChargeRowSSE = $standingChargeTableSSE.find('tr:contains("Urban 24hr meter")').first();
                    const $standingChargeCellSSE = $standingChargeRowSSE.find('td').eq(1);
                    standingCharge = parseFloat($standingChargeCellSSE.text().replace(/€/,''));
                    //Obligation payment
                    obligationPayment = parseFloat($obligationPaymentCellSSE.text().replace(/€/,''));
                    //Service Charge
                    serviceCharge = 0;
                }
                else if(region === 'rural') {
                    //Unit Price
                    unitPrice = parseFloat($unitPriceCellSSE.text());
                    //Standing Charge
                    const $standingChargeRowSSE = $standingChargeTableSSE.find('tr:contains("Rural 24hr meter")').first();
                    const $standingChargeCellSSE = $standingChargeRowSSE.find('td').eq(1);
                    standingCharge = parseFloat($standingChargeCellSSE.text().replace(/€/,''));
                    //Obligation payment
                    obligationPayment = parseFloat($obligationPaymentCellSSE.text().replace(/€/,''));
                    //Service Charge
                    serviceCharge = 0;
                }
                break;
            case "flogas":
                //Plan Name
                planName = "Flogas Standard Plan";
                //Supplier
                supplier = "Flogas";
                if(region === 'urban') {
                    //Urban prices table
                    const $pricesTableFlogasHeader = $('label:contains("urban")').first();
                    const $pricesTableFlogasContainer = $pricesTableFlogasHeader.next('div.c-switch-price-plan-detail-tabs__content').first();
                    const $pricesTableFlogas = $pricesTableFlogasContainer.find('table').first();

                    //Unit Price
                    const $unitPriceRowFlogas = $pricesTableFlogas.find('tr:contains("Unit Rate")').first();
                    const $unitPriceCellFlogas = $unitPriceRowFlogas.find('td').eq(1);
                    unitPrice = parseFloat($unitPriceCellFlogas.text());

                    //Standing Charge
                    const $standingChargeRowFlogas = $pricesTableFlogas.find('tr:contains("Standing Charge")').first();
                    const $standingChargeCellFlogas = $standingChargeRowFlogas.find('td').eq(1);
                    standingCharge = parseFloat($standingChargeCellFlogas.text().replace(/€/,''));

                    //Obligation payment
                    const $obligationPaymentRowFlogas = $pricesTableFlogas.find('tr:contains("PSO")').first();
                    const $obligationPaymentCellFlogas = $obligationPaymentRowFlogas.find('td').eq(1);
                    obligationPayment = parseFloat($obligationPaymentCellFlogas.text().replace(/€/,''));
                    //Service Charge
                    serviceCharge = 0;
                }
                else if(region === 'rural') {
                    //Urban prices table
                    const $pricesTableFlogasHeader = $('label:contains("rural")').first();
                    const $pricesTableFlogasContainer = $pricesTableFlogasHeader.next('div.c-switch-price-plan-detail-tabs__content').first();
                    const $pricesTableFlogas = $pricesTableFlogasContainer.find('table').first();

                    //Unit Price
                    const $unitPriceRowFlogas = $pricesTableFlogas.find('tr:contains("Unit Rate")').first();
                    const $unitPriceCellFlogas = $unitPriceRowFlogas.find('td').eq(1);
                    unitPrice = parseFloat($unitPriceCellFlogas.text());

                    //Standing Charge
                    const $standingChargeRowFlogas = $pricesTableFlogas.find('tr:contains("Standing Charge")').first();
                    const $standingChargeCellFlogas = $standingChargeRowFlogas.find('td').eq(1);
                    standingCharge = parseFloat($standingChargeCellFlogas.text().replace(/€/,''));

                    //Obligation payment
                    const $obligationPaymentRowFlogas = $pricesTableFlogas.find('tr:contains("PSO")').first();
                    const $obligationPaymentCellFlogas = $obligationPaymentRowFlogas.find('td').eq(1);
                    obligationPayment = parseFloat($obligationPaymentCellFlogas.text().replace(/€/,''));
                    //Service Charge
                    serviceCharge = 0;
                }
                break;
        }
        let plan = {
            "planName" : planName,
            "supplier" : supplier,
            "rawPrices" : {
                "unitPrice" : unitPrice,
                "obligationPayment" : obligationPayment,
                "standingCharge" : standingCharge,
                "serviceCharge" : serviceCharge
            },
        }
        plans.push(plan);
    }
    return plans;
}