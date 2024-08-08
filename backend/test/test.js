import { expect } from 'chai';

import puppeteerScrape from "../server/scraper.js";

import {getPage} from "../server/parser.js";
import {getPrices} from "../server/parser.js";

import {processPlans} from "../server/calc.js";
import {getPlans} from "../server/calc.js";

import {getBestPlan} from "../server/calc.js";




describe('Puppeteer scraping test', function() {
    this.timeout(20000);
    it('returns valid HTML', async function () {
        const provider = "sse";
        const url= "https://www.sseairtricity.com/ie/home/products/electricity-top-discount";
        let html = await puppeteerScrape(provider, url);
        expect(html).to.contain('<!DOCTYPE html>');
    });
});

describe('Axios scraping test', function() {
    it('returns valid HTML', async function () {
        const provider = "yuno";
        let html = await getPage(provider);
        expect(html).to.contain('<!DOCTYPE html>');
    });
});

describe('Cheerio parsing test', function() {
    const providers = ["yuno","pinergy"];
    const region = "urban";
    it('returns an object', async function () {
        let plans = await getPrices(providers,region);
        expect(typeof plans).to.equal('object');
    });
    it('object contains as many elements as the number of providers', async function () {
        let plans = await getPrices(providers,region);
        expect(plans.length).to.equal(providers.length);
    });
    it('elements contain all expected keys and prices are >= 0', async function () {
        let plans = await getPrices(providers,region);
        expect(plans[0].planName).to.not.be.null;
        expect(plans[0].supplier).to.not.be.null;
        expect(plans[0].rawPrices.unitPrice).to.be.at.least(0);
        expect(plans[0].rawPrices.obligationPayment).to.be.at.least(0);
        expect(plans[0].rawPrices.standingCharge).to.be.at.least(0);
        expect(plans[0].rawPrices.serviceCharge).to.be.at.least(0);
    });
});

describe('Annual Spend calculation test', function() {
    const plan =
        {
            planName: 'Yuno Standard Plan',
            supplier: 'Yuno',
            rawPrices: {
                unitPrice: 35.48,
                obligationPayment: 0,
                standingCharge: 264.73,
                serviceCharge: 0
            }
        };

    it('returns a number', function () {
        const householdSize = 4;
        const kwhUsage = "";
        let spend = processPlans(plan, householdSize, kwhUsage);
        expect(typeof spend).to.equal('number');
    });
    it('number greater than 0 when kWh is not given and householdSize is given', function () {
        const householdSize = 4;
        const kwhUsage = "";
        let spend = processPlans(plan, householdSize, kwhUsage);
        expect(spend).to.be.greaterThan(0);
    });
    it('number greater than 0 when householdSize is not given and kwhUsage is given', function () {
        const householdSize = "";
        const kwhUsage = 4000;
        let spend = processPlans(plan, householdSize, kwhUsage);
        expect(spend).to.be.greaterThan(0);
    });
});

describe('Plans extraction test', function() {
    const providers = ["pinergy","flogas"];
    const region = "rural";
    const householdSize = 2;
    const kwhUsage = 0;
    this.timeout(20000);
    it('returns an object', async function () {
        let plans = await getPlans(providers, region, householdSize, kwhUsage);
        expect(typeof plans).to.equal('object');

    });
    it('object contains as many elements as the number of providers', async function () {
        let plans = await getPlans(providers, region, householdSize, kwhUsage);
        expect(plans.plans.length).to.equal(providers.length);
    });
    it('plans contain all expected keys with cost >= 0', async function () {
        const householdSize = 2;
        const kwhUsage = 0;
        let plans = await getPlans(providers, region, householdSize, kwhUsage);
        expect(plans.plans[0].planName).to.not.be.null;
        expect(plans.plans[0].supplier).to.not.be.null;
        expect(plans.plans[0].cost).to.be.at.least(0);
    });
});

describe('Plans sorting test', function() {
    const plans = [
        {
            planName: 'midPlan',
            supplier: 'midProvider',
            cost : 3000
        },
        {
            planName: 'topPlan',
            supplier: 'topProvider',
            cost : 2000
        },
        {
            planName: 'botPlan',
            supplier: 'botProvider',
            cost : 4000
        }
    ]
    it('returns an object', function () {
        let bestPlan = getBestPlan(plans);
        expect(typeof bestPlan).to.equal('object');
    });
    it('returns the cheapest plan', async function () {
        let bestPlan = getBestPlan(plans);
        expect(bestPlan.planName).to.equal('topPlan');
    });
});