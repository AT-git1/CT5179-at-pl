import puppeteer from 'puppeteer';

async function puppeteerScrape(provider,url) {
    let scrapedPage;
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url);
    switch (provider) {
        case "elec" :
            //Click on "Full price information" button
            const pricingButtonSelector = '[onclick="showPricePlanCharges(\'ESE28\')"]'
            await page.locator(pricingButtonSelector);

            await page.evaluate((selector) => {
                document.querySelector(selector).click();
            }, pricingButtonSelector);

            //Wait for pricing info to load
            await page.waitForSelector("#btnIncludeVat");
            scrapedPage = await page.content();
            await browser.close();
            break;

        case "placeholder" :
            //BLOCK FOR ANOTHER PROVIDER
            scrapedPage = await page.content();
            break;

        case "placeholder2" :
            //BLOCK FOR ANOTHER PROVIDER
            scrapedPage = await page.content();
            break;
    }
    return scrapedPage;
}

export default puppeteerScrape;