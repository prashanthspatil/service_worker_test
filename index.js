const puppeteer = require('puppeteer');
const chalk = require('chalk');

const URL = 'https://serviceWorker_test_url';

(async() => {
    if(URL == 'https://serviceWorker_test_url')
    {
      console.log('Enter valide url');
      return
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);
    await page.evaluate('navigator.serviceWorker.ready');

    // Assert the page has a SW.
    console.assert(await page.evaluate('navigator.serviceWorker.controller'), 'Service worker active on page');
    console.log(chalk.cyan(`Requests made by ${URL}`),
             `(${chalk.green('✔ cached by sw')}, ${chalk.red('✕ not cached')})`);

    const requests = new Map();
    page.on('request', req => 
      requests.set(req.url(), req));

    await page.reload({waitUntil: 'networkidle0'});

    for(const [url, req] of requests) {
      const swrequest = req.response().fromServiceWorker();
      console.log(url, swrequest ? chalk.green('✔') : chalk.red('✕'));
    }

	await browser.close();
})();