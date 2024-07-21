import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
export { getYunoHtml, getElecHtml, getPinergyHtml, getEnergiaHtml, getYunoPrices, getElecPrices, getPinergyPrices, getEnergiaPrices };

async function getHtml(url) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const content = await page.content();
        return content;
    } catch (error) {
        console.error(`Error fetching URL ${url}:`, error);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function getYunoHtml() {
    const yunoURL = "https://yunoenergy.ie/pricing-page";
    return await getHtml(yunoURL);
}

async function getElecHtml() {
    const elecURL = "https://www.electricireland.ie/switch/new-customer/price-plans?priceType=D";
    return await getHtml(elecURL);
}

async function getPinergyHtml() {
    const pinergyURL = "https://pinergy.ie/terms-conditions/tariffs/?tab=2";
    return await getHtml(pinergyURL);
}

async function getEnergiaHtml() {
    const energiaURL = "https://www.energia.ie/about-energia/our-tariffs";
    return await getHtml(energiaURL);
}

async function getYunoPrices() {
    const data = await getYunoHtml();
    if (!data) return null;
    const $ = cheerio.load(data);

    const prices = {
        '24hr Urban': {
            unitRateExVAT: parseFloat($("table:contains('24hr Urban') tbody tr:nth-child(1) td:nth-child(2)").text().replace(' cent/kWh', '')),
            unitRateIncVAT: parseFloat($("table:contains('24hr Urban') tbody tr:nth-child(1) td:nth-child(3)").text().replace(' cent/kWh', '')),
            standingChargeExVAT: parseFloat($("table:contains('24hr Urban') tbody tr:nth-child(2) td:nth-child(2)").text().replace('€', '').replace(' Annually', '')),
            standingChargeIncVAT: parseFloat($("table:contains('24hr Urban') tbody tr:nth-child(2) td:nth-child(3)").text().replace('€', '').replace(' Annually', ''))
        },
        'D/N Urban': {
            dayUnitRateExVAT: parseFloat($("table:contains('D/N Urban') tbody tr:nth-child(1) td:nth-child(2)").text().replace(' cent/kWh', '')),
            dayUnitRateIncVAT: parseFloat($("table:contains('D/N Urban') tbody tr:nth-child(1) td:nth-child(3)").text().replace(' cent/kWh', '')),
            nightUnitRateExVAT: parseFloat($("table:contains('D/N Urban') tbody tr:nth-child(2) td:nth-child(2)").text().replace(' cent/kWh', '')),
            nightUnitRateIncVAT: parseFloat($("table:contains('D/N Urban') tbody tr:nth-child(2) td:nth-child(3)").text().replace(' cent/kWh', '')),
            standingChargeExVAT: parseFloat($("table:contains('D/N Urban') tbody tr:nth-child(3) td:nth-child(2)").text().replace('€', '').replace(' Annually', '')),
            standingChargeIncVAT: parseFloat($("table:contains('D/N Urban') tbody tr:nth-child(3) td:nth-child(3)").text().replace('€', '').replace(' Annually', ''))
        },
        '24hr Rural': {
            unitRateExVAT: parseFloat($("table:contains('24hr Rural') tbody tr:nth-child(1) td:nth-child(2)").text().replace(' cent/kWh', '')),
            unitRateIncVAT: parseFloat($("table:contains('24hr Rural') tbody tr:nth-child(1) td:nth-child(3)").text().replace(' cent/kWh', '')),
            standingChargeExVAT: parseFloat($("table:contains('24hr Rural') tbody tr:nth-child(2) td:nth-child(2)").text().replace('€', '').replace(' Annually', '')),
            standingChargeIncVAT: parseFloat($("table:contains('24hr Rural') tbody tr:nth-child(2) td:nth-child(3)").text().replace('€', '').replace(' Annually', ''))
        },
        'D/N Rural': {
            dayUnitRateExVAT: parseFloat($("table:contains('D/N Rural') tbody tr:nth-child(1) td:nth-child(2)").text().replace(' cent/kWh', '')),
            dayUnitRateIncVAT: parseFloat($("table:contains('D/N Rural') tbody tr:nth-child(1) td:nth-child(3)").text().replace(' cent/kWh', '')),
            nightUnitRateExVAT: parseFloat($("table:contains('D/N Rural') tbody tr:nth-child(2) td:nth-child(2)").text().replace(' cent/kWh', '')),
            nightUnitRateIncVAT: parseFloat($("table:contains('D/N Rural') tbody tr:nth-child(2) td:nth-child(3)").text().replace(' cent/kWh', '')),
            standingChargeExVAT: parseFloat($("table:contains('D/N Rural') tbody tr:nth-child(3) td:nth-child(2)").text().replace('€', '').replace(' Annually', '')),
            standingChargeIncVAT: parseFloat($("table:contains('D/N Rural') tbody tr:nth-child(3) td:nth-child(3)").text().replace('€', '').replace(' Annually', ''))
        }
    };

    console.log(prices);
    return prices;
}

getYunoPrices().catch(console.error);

async function getElecPrices() {
    const data = await getElecHtml();
    if (!data) return null;
    const $ = cheerio.load(data);

    const plans = [];

    $('.scrollable-card').each((index, element) => {
        const planName = $(element).find('.top h2').text().trim();
        const electricityUnitPrice = $(element).find('table.prices tbody tr:contains("Electricity unit price") td:nth-child(2)').text().trim();
        const gasUnitPrice = $(element).find('table.prices tbody tr:contains("Gas unit price") td:nth-child(2)').text().trim();
        const firstYearCost = $(element).find('ul.spread li:contains("First Year Cost w/ Bonus") strong').text().trim();
        const estimatedAnnualBill = $(element).find('ul.spread li:contains("Estimated Annual Bill (EAB)") strong').text().trim();

        plans.push({
            planName,
            electricityUnitPrice,
            gasUnitPrice,
            firstYearCost,
            estimatedAnnualBill
        });
    });

    console.log(plans);
    return plans;
}
getElecPrices().catch(console.error);

async function getPinergyPrices() {
    const data = await getPinergyHtml();
    if (!data) return null;
    const $ = cheerio.load(data);

    const plans = [];

    // Loop through each plan section
    $('.tab_anchor_content').each((index, element) => {
        const planName = $(element).find('h2.black_heading').text().trim();
        const unitPriceExVAT = $(element).find('table tbody tr:contains("Unit Price") td:nth-child(2)').text().trim();
        const unitPriceIncVAT = $(element).find('table tbody tr:contains("Unit Price") td:nth-child(3)').text().trim();
        const standingChargeExVAT = $(element).find('table tbody tr:contains("Standing Charge") td:nth-child(2)').text().trim();
        const standingChargeIncVAT = $(element).find('table tbody tr:contains("Standing Charge") td:nth-child(3)').text().trim();
        const eabExVAT = $(element).find('table tbody tr:contains("EAB Table") + tr + tr td:nth-child(2)').text().trim();
        const eabIncVAT = $(element).find('table tbody tr:contains("EAB Table") + tr + tr td:nth-child(3)').text().trim();

        plans.push({
            planName,
            unitPriceExVAT,
            unitPriceIncVAT,
            standingChargeExVAT,
            standingChargeIncVAT,
            eabExVAT,
            eabIncVAT
        });
    });

    console.log(plans);
    return plans;
}

async function getEnergiaPrices() {
    const data = await getEnergiaHtml();
    if (!data) return null;
    const $ = cheerio.load(data);

    const extractTableData = (tableSelector) => {
        const data = [];
        $(tableSelector).find('tr:not(:first-child)').each((i, el) => {
            const row = $(el).find('td').map((j, td) => $(td).text().trim()).get();
            data.push({
                description: row[0],
                includingVAT: row[1],
                excludingVAT: row[2]
            });
        });
        return data;
    };

    const extractStandingCharges = (tableSelector) => {
        const data = [];
        $(tableSelector).find('tr').each((i, el) => {
            const row = $(el).find('td').map((j, td) => $(td).text().trim()).get();
            data.push({
                description: row[0],
                price: row[1]
            });
        });
        return data;
    };

    const plans = [
        { name: 'Electricity 24 Hour Prices', tableSelector: 'table:nth-child(9)' },
        { name: 'Electricity 24 Hour Standing Charges', tableSelector: 'table:nth-child(11)', isStandingCharge: true },
        { name: 'Electricity Day Night Prices', tableSelector: 'table:nth-child(13)' },
        { name: 'Electricity Day Night Standing Charges', tableSelector: 'table:nth-child(15)', isStandingCharge: true },
        { name: 'Electricity Night Storage Prices', tableSelector: 'table:nth-child(17)' },
        { name: 'Electricity Night Storage Standing Charges', tableSelector: 'table:nth-child(19)', isStandingCharge: true },
        { name: 'Electricity Standard Smart Meter Prices', tableSelector: 'table:nth-child(21)' },
        { name: 'Electricity Standard Smart Meter Standing Charges', tableSelector: 'table:nth-child(23)', isStandingCharge: true },
        { name: 'Electricity Interval Smart Meter Prices', tableSelector: 'table:nth-child(25)' },
        { name: 'Electricity Interval Smart Meter Standing Charges', tableSelector: 'table:nth-child(27)', isStandingCharge: true },
        { name: 'Gas Meter Prices', tableSelector: 'table:nth-child(29)' },
        { name: 'Gas Standing Charges', tableSelector: 'table:nth-child(31)', isStandingCharge: true }
    ];

    const pricingData = {};

    plans.forEach(plan => {
        if (plan.isStandingCharge) {
            pricingData[plan.name] = extractStandingCharges(plan.tableSelector);
        } else {
            pricingData[plan.name] = extractTableData(plan.tableSelector);
        }
    });

    console.log(pricingData);
    return pricingData;
}

async function getPrices(providers, interest, loc) {
    let results = {};
    if (providers.includes('Yuno')) {
        try {
            results['Yuno'] = await getYunoPrices();
            console.log("Successfully fetched Yuno prices");
        } catch (error) {
            console.error("Error fetching Yuno prices:", error);
        }
    }
    if (providers.includes('Elec')) {
        try {
            results['Elec'] = await getElecPrices();
            console.log("Successfully fetched Elec prices");
        } catch (error) {
            console.error("Error fetching Elec prices:", error);
        }
    }
    if (providers.includes('Pinergy')) {
        try {
            results['Pinergy'] = await getPinergyPrices();
            console.log("Successfully fetched Pinergy prices");
        } catch (error) {
            console.error("Error fetching Pinergy prices:", error);
        }
    }
    if (providers.includes('Energia')) {
        try {
            results['Energia'] = await getEnergiaPrices();
            console.log("Successfully fetched Energia prices");
        } catch (error) {
            console.error("Error fetching Energia prices:", error);
        }
    }
    
    console.log("Scraped Prices:", results); 
    return results;
}

export default getPrices;
