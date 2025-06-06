import sm from 'sitemap';
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const { Readable } = require('stream');
import fetch from '../fetch';
import { url as siteURL } from '../../config';
import { Currencies, CurrencyRates } from '../../data/models';

import {
    listingURLs,
    listURLs
} from './urlFormates';

let sitemap;

const sitemapRoutes = (app, routes) => {

    app.get('/sitemap.xml', async function (req, res) {

        res.header('Content-Type', 'application/xml');
        res.header('Content-Encoding', 'gzip');
        // if we have a cached entry send it
        if (sitemap) {
            res.send(sitemap)
            return
        }

        let routesForSitemap = [];
        let staticURLs = [], listingData = [], listDetails = [];
        listingData = await listingURLs();
        listDetails = await listURLs();

        let unwantedURLs = [
            '/admin',
            '/users/show/:profileId?',
            '/become-a-owner/:listId?/:formPage?',
            '/cars/:listId/:preview?',
            '/message/:threadId/:type',
            '/book/:hostingId',
            '/payment/:reservationId',
            '/users/trips/itinerary/:reservationId',
            '/users/trips/receipt/:reservationId',
            '/users/bookings/itinerary/:reservationId',
            '/users/bookings/receipt/:reservationId',
            '/trips/:type',
            '/reservation/:type',
            '/cancel/:reservationId/:type',
            '/cancellation-policies/:typ?',
            '/review/write/:reservationId',
            '/document-verification',
            '/company/:profileId',
            '/wishlists/:id?',
            '/venue-details/:id?',
            '/*',
            '/cancellation-policies/:type?',
            '/bookings/:type',
        ];


        let staticData = await Promise.all(routes.children.map(async (value, key) => {
            if (!value.path.includes('/siteadmin') && unwantedURLs.indexOf(value.path) < 0) {
                staticURLs.push({
                    url: value.path,
                    changefreq: 'daily',
                    priority: 0.8
                })
            }
        }));

        let listingDataURLs = await Promise.all(listingData.map(async (value) => {
            staticURLs.push({
                url: value,
                changefreq: 'daily',
                priority: 0.7
            })
        }));

        let listData = await Promise.all(listDetails.map(async (value) => {
            staticURLs.push({
                url: value,
                changefreq: 'daily',
                priority: 0.7
            })
        }));

        routesForSitemap.unshift(siteURL);

        routesForSitemap.unshift(siteURL);

        const smStream = new SitemapStream({ hostname: siteURL })
        const pipeline = smStream.pipe(createGzip())

        Readable.from(staticURLs).pipe(smStream)

        streamToPromise(pipeline).then(sm => sitemap = sm)

        // stream write the response
        pipeline.pipe(res).on('error', (e) => { throw e })
    });

    app.get('/update-currency-rate', async function (req, res) {
        // Get the base currency symbol
        const baseCurrency = await Currencies.findOne({
            where: { isBaseCurrency: true }
        });
        const symbol = baseCurrency.dataValues.symbol;

        // Fetch rates from fixer api
        //const URL = 'http://api.fixer.io/latest?base=' + symbol;
        const URL = 'https://api.coinbase.com/v2/exchange-rates?currency=' + symbol;
        const resp = await fetch(URL);
        const { data } = await resp.json();
        const currencyData = data.rates;

        // Prepare data and rates from fixer then store them into currency rates table
        let baseData = {
            currencyCode: symbol,
            rate: 1.00,
            isBase: true
        };
        let ratesData = Object.keys(currencyData).map(function (data) {
            return { "currencyCode": data, rate: currencyData[data] };
        });
        ratesData.push(baseData);

        if (ratesData.length > 0) {
            // Clean the table before store anything
            await CurrencyRates.truncate();
            // Lets do bulk create of currency rates
            const updateRates = await CurrencyRates.bulkCreate(ratesData);
        }
        return res.send(ratesData);
    });
};

export default sitemapRoutes;