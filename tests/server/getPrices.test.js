import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import getPrices, { getYunoHtml, getElecHtml, getPinergyHtml, getEnergiaHtml, getYunoPrices, getElecPrices, getPinergyPrices, getEnergiaPrices } from '../../backend/server/parser.js';

// Initialize the mock adapter
const mock = new MockAdapter(axios);

describe('HTML Fetching Functions', () => {
    afterEach(() => {
        mock.reset();
    });

    test('getYunoHtml fetches HTML successfully', async () => {
        const mockHtml = '<html></html>';
        mock.onGet("https://yunoenergy.ie/pricing-page").reply(200, mockHtml);

        const data = await getYunoHtml();
        expect(data).toBe(mockHtml);
    });

    test('getYunoHtml handles errors', async () => {
        mock.onGet("https://yunoenergy.ie/pricing-page").reply(500);

        const data = await getYunoHtml();
        expect(data).toBeNull();
    });

    test('getElecHtml fetches HTML successfully', async () => {
        const mockHtml = '<html></html>';
        mock.onGet("https://www.electricireland.ie/switch/new-customer/price-plans?priceType=D").reply(200, mockHtml);

        const data = await getElecHtml();
        expect(data).toBe(mockHtml);
    });

    test('getElecHtml handles errors', async () => {
        mock.onGet("https://www.electricireland.ie/switch/new-customer/price-plans?priceType=D").reply(500);

        const data = await getElecHtml();
        expect(data).toBeNull();
    });

    test('getPinergyHtml fetches HTML successfully', async () => {
        const mockHtml = '<html></html>';
        mock.onGet("https://pinergy.ie/terms-conditions/tariffs/?tab=2").reply(200, mockHtml);

        const data = await getPinergyHtml();
        expect(data).toBe(mockHtml);
    });

    test('getPinergyHtml handles errors', async () => {
        mock.onGet("https://pinergy.ie/terms-conditions/tariffs/?tab=2").reply(500);

        const data = await getPinergyHtml();
        expect(data).toBeNull();
    });

    // test('getEnergiaHtml fetches HTML successfully', async () => {
    //     const mockHtml = '<html></html>';
    //     mock.onGet("https://www.energia.ie/about-energia/our-tariffs").reply(200, mockHtml);

    //     const data = await getEnergiaHtml();
    //     expect(data).toBe(mockHtml);
    // });

    // test('getEnergiaHtml handles errors', async () => {
    //     mock.onGet("https://www.energia.ie/about-energia/our-tariffs").reply(500);

    //     const data = await getEnergiaHtml();
    //     expect(data).toBeNull();
    // });
});

describe('Price Parsing Functions', () => {
    afterEach(() => {
        mock.reset();
    });

    test('getYunoPrices parses prices correctly', async () => {
        const mockHtml = `
            <table>
                <tbody>
                    <tr><td>24hr Urban</td><td>12 cent/kWh</td><td>14 cent/kWh</td></tr>
                    <tr><td>Standing Charge</td><td>€100 Annually</td><td>€120 Annually</td></tr>
                </tbody>
            </table>
        `;
        mock.onGet("https://yunoenergy.ie/pricing-page").reply(200, mockHtml);

        const prices = await getYunoPrices();
        expect(prices).toEqual({
            '24hr Urban': {
                unitRateExVAT: 12,
                unitRateIncVAT: 14,
                standingChargeExVAT: 100,
                standingChargeIncVAT: 120
            }
        });
    });

    test('getElecPrices parses plans correctly', async () => {
        const mockHtml = `
            <div class="scrollable-card">
                <div class="top"><h2>Plan A</h2></div>
                <table class="prices">
                    <tbody>
                        <tr><td>Electricity unit price</td><td>10 cent/kWh</td></tr>
                        <tr><td>Gas unit price</td><td>5 cent/kWh</td></tr>
                    </tbody>
                </table>
                <ul class="spread">
                    <li>First Year Cost w/ Bonus <strong>€1000</strong></li>
                    <li>Estimated Annual Bill (EAB) <strong>€1200</strong></li>
                </ul>
            </div>
        `;
        mock.onGet("https://www.electricireland.ie/switch/new-customer/price-plans?priceType=D").reply(200, mockHtml);

        const plans = await getElecPrices();
        expect(plans).toEqual([{
            planName: 'Plan A',
            electricityUnitPrice: '10 cent/kWh',
            gasUnitPrice: '5 cent/kWh',
            firstYearCost: '€1000',
            estimatedAnnualBill: '€1200'
        }]);
    });

    test('getPinergyPrices parses plans correctly', async () => {
        const mockHtml = `
            <div class="tab_anchor_content">
                <h2 class="black_heading">Plan B</h2>
                <table>
                    <tbody>
                        <tr><td>Unit Price</td><td>8 cent/kWh</td><td>10 cent/kWh</td></tr>
                        <tr><td>Standing Charge</td><td>€80 Annually</td><td>€100 Annually</td></tr>
                        <tr><td>EAB Table</td></tr>
                        <tr><td></td><td>€900</td><td>€1100</td></tr>
                    </tbody>
                </table>
            </div>
        `;
        mock.onGet("https://pinergy.ie/terms-conditions/tariffs/?tab=2").reply(200, mockHtml);

        const plans = await getPinergyPrices();
        expect(plans).toEqual([{
            planName: 'Plan B',
            unitPriceExVAT: '8 cent/kWh',
            unitPriceIncVAT: '10 cent/kWh',
            standingChargeExVAT: '€80 Annually',
            standingChargeIncVAT: '€100 Annually',
            eabExVAT: '€900',
            eabIncVAT: '€1100'
        }]);
    });

    test('getEnergiaPrices parses plans correctly', async () => {
        const mockHtml = `
            <table>
                <tr><td>Description</td><td>Including VAT</td><td>Excluding VAT</td></tr>
                <tr><td>Electricity 24 Hour Prices</td><td>15 cent/kWh</td><td>12 cent/kWh</td></tr>
            </table>
        `;
        mock.onGet("https://www.energia.ie/about-energia/our-tariffs").reply(200, mockHtml);

        const prices = await getEnergiaPrices();
        expect(prices).toEqual({
            'Electricity 24 Hour Prices': [{
                description: 'Electricity 24 Hour Prices',
                includingVAT: '15 cent/kWh',
                excludingVAT: '12 cent/kWh'
            }]
        });
    });
});

describe('getPrices Function', () => {
    afterEach(() => {
        mock.reset();
    });

    test('getPrices fetches and parses prices for all providers', async () => {
        const mockYunoHtml = '<html></html>';
        const mockElecHtml = '<html></html>';
        const mockPinergyHtml = '<html></html>';
        const mockEnergiaHtml = '<html></html>';

        mock.onGet("https://yunoenergy.ie/pricing-page").reply(200, mockYunoHtml);
        mock.onGet("https://www.electricireland.ie/switch/new-customer/price-plans?priceType=D").reply(200, mockElecHtml);
        mock.onGet("https://pinergy.ie/terms-conditions/tariffs/?tab=2").reply(200, mockPinergyHtml);
        // mock.onGet("https://www.energia.ie/about-energia/our-tariffs").reply(200, mockEnergiaHtml);

        const results = await getPrices(['Yuno', 'Elec', 'Pinergy', 'Energia'], null, null);
        expect(results).toHaveProperty('Yuno');
        expect(results).toHaveProperty('Elec');
        expect(results).toHaveProperty('Pinergy');
        // expect(results).toHaveProperty('Energia');
    });
});
module.exports = getPrices;
