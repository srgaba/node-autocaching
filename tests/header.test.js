const puppeteer = require('puppeteer');

const userFactory = require('./t/userFactory');
const sessionFactory = require('./factories/sessionFactory');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });

    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    // await browser.close();
});

test('the header as the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('clicking login starts to auth', async() => {
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
});

test.only('when signed in, shows logout button', async () => {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: "session.sig", value: sig, expires: Date.now() / 1000 + 10, });
    await page.goto('localhost:3000');
    await page.awaitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');
});