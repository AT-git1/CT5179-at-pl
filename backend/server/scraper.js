import puppeteer from 'puppeteer-core';
import chromium from 'chromium';


async function puppeteerScrape(provider, url) {
    let isDocker = process.env.DOCKER;
    let isGit = process.env.GITHUB;
    let scrapedPage;
    let executablePath;

    if (isDocker || isGit) {
        executablePath = "/usr/bin/chromium";
    }
    else {
        executablePath = chromium.path;
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        executablePath: executablePath
    });
    const page = await browser.newPage();
    
    console.log(`Starting scraping process for provider: ${provider}`);
    console.log(`Navigating to URL: ${url}`);
    
    await page.goto(url);
    
    switch (provider) {

        case "elec":
            console.log("Processing provider: elec");
            const pricingButtonSelector = '[onclick="showPricePlanCharges(\'ESE28\')"]';
            console.log(`Clicking on selector: ${pricingButtonSelector}`);
            await page.waitForSelector(pricingButtonSelector);
            

            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, pricingButtonSelector);
            
            console.log("Waiting for pricing information to load...");
            await page.waitForSelector("#btnIncludeVat");
            
            scrapedPage = await page.content();
            console.log("Pricing information loaded successfully.");
            console.log("Scraped content length: ", scrapedPage.length);
            await browser.close();
            break;



        case "sse" :
            console.log("Processing provider: sse");
            await page.waitForSelector(".home-body-container");
            scrapedPage = await page.content();
            console.log("Scraped content length: ", scrapedPage.length);
            await browser.close();
            break;

        case "flogas" :
            console.log("Processing provider: flogas");
            await page.waitForSelector(".c-switch-price-plan-detail-tabs");
            scrapedPage = await page.content();
            console.log("Scraped content length: ", scrapedPage.length);
            await browser.close();
            break;

        default:
            console.error("Unknown provider specified.");
            await browser.close();
            throw new Error("Unknown provider");
    }
    
    return scrapedPage;
}

export default puppeteerScrape;
