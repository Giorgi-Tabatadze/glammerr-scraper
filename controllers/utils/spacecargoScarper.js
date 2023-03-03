const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const { format, parse } = require("date-fns");

async function spacecargoScraper(scaccount) {
  console.log(`scraper Initiated with scaccount: ${scaccount.id}`);

  let scrapedTrackings = [];
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
      defaultViewport: { width: 1366, height: 768 },
    });
    const page = await browser.newPage();
    await page.goto("https://www.spacecargo.ge/");

    await page.waitForSelector(
      "body > app-root > app-home-desktop > div > div.coverContainer > div > div.loginForm.ng-star-inserted > form > div:nth-child(1) > app-material-input > div > div > div:nth-child(2) > input",
    );
    await page.waitForSelector(
      "body > app-root > app-home-desktop > div > div.coverContainer > div > div.loginForm.ng-star-inserted > form > div:nth-child(2) > app-material-input > div > div > div:nth-child(2) > input",
    );

    /// type email
    await page.type(
      "body > app-root > app-home-desktop > div > div.coverContainer > div > div.loginForm.ng-star-inserted > form > div:nth-child(1) > app-material-input > div > div > div:nth-child(2) > input",
      scaccount.username,
      { delay: 100 },
    );
    /// type password
    await page.type(
      "body > app-root > app-home-desktop > div > div.coverContainer > div > div.loginForm.ng-star-inserted > form > div:nth-child(2) > app-material-input > div > div > div:nth-child(2) > input",
      scaccount.password,
      { delay: 100 },
    );
    await page.click(
      "body > app-root > app-home-desktop > div > div.coverContainer > div > div.loginForm.ng-star-inserted > form > button.loginBtn",
    );

    // Awaiting Packages
    await page.waitForNavigation();
    await page.waitForSelector(
      "body > app-root > app-main-desktop > app-user-admin-menu-desktop > nav > ul > li:nth-child(2) > a",
    );

    await page.goto("https://www.spacecargo.ge/AwaitingPackages", {
      waitUntil: "load",
      timeout: 60000,
    });
    await page.waitForTimeout(1000);
    await page.waitForSelector("#mat-select-0");
    await page.waitForTimeout(1000);
    await page.click("#mat-select-0");
    await page.waitForSelector("#mat-option-3");
    await page.waitForTimeout(1000);
    await page.click("#mat-option-3");
    await page.waitForTimeout(5000);
    await page.exposeFunction("formatDate", (dateString) =>
      format(parse(dateString, "dd-MM-yyyy", new Date()), "yyyy-MM-dd"),
    );

    const awaitingPackages = await page.evaluate((arg) => {
      const table = document.querySelector("tbody");
      const trackings = [];
      const arrayOfTrs = Array.from(table.children);
      arrayOfTrs.forEach((tr) => {
        const tracking = {
          trackingCode: tr.children[0]?.innerText,
          status: "awaiting",
          scaccountId: arg.id,
        };
        trackings.push(tracking);
      });
      return trackings;
    }, scaccount);

    // Warehouse Packages

    await page.goto("https://www.spacecargo.ge/WarehousePackages", {
      waitUntil: "load",
      timeout: 60000,
    });
    await page.waitForTimeout(1000);
    await page.waitForSelector("#mat-select-0");
    await page.waitForTimeout(1000);
    await page.click("#mat-select-0");
    await page.waitForSelector("#mat-option-3");
    await page.waitForTimeout(1000);
    await page.click("#mat-option-3");
    await page.waitForTimeout(5000);
    const wareHousePackages = await page.evaluate((arg) => {
      const table = document.querySelector("tbody");
      const trackings = [];
      const arrayOfTrs = Array.from(table?.children);
      if (arrayOfTrs.length === 0) return trackings;
      arrayOfTrs.forEach((tr) => {
        const tracking = {
          trackingCode: tr.children[0]?.innerText,
          status: "warehouse",
          scaccountId: arg.id,
        };
        trackings.push(tracking);
      });
      return trackings;
    }, scaccount);
    // Send Packages

    await page.goto("https://www.spacecargo.ge/SendPackages", {
      waitUntil: "load",
      timeout: 60000,
    });
    await page.waitForTimeout(1000);
    await page.waitForSelector("#mat-select-0");
    await page.waitForTimeout(1000);
    await page.click("#mat-select-0");
    await page.waitForSelector("#mat-option-3");
    await page.waitForTimeout(1000);
    await page.click("#mat-option-3");
    await page.waitForTimeout(5000);

    const sendPackages = await page.evaluate((arg) => {
      const table = document.querySelector("tbody");
      const trackings = [];
      const arrayOfTrs = Array.from(table?.children);
      if (arrayOfTrs.length === 0) return trackings;
      arrayOfTrs.forEach((tr) => {
        const tracking = {
          trackingCode: tr.children[0]?.innerText,
          flightNumber: tr.children[3]?.innerText,

          sentDate: tr.children[4]?.innerText,
          estimatedArrivalDate: tr.children[5]?.innerText,
          status: "send",
          scaccountId: arg.id,
        };
        trackings.push(tracking);
      });
      return trackings;
    }, scaccount);
    // Arrived Packages

    await page.goto("https://www.spacecargo.ge/ArrivedPackages", {
      waitUntil: "load",
      timeout: 60000,
    });
    await page.waitForTimeout(1000);
    await page.waitForSelector("#mat-select-0");
    await page.waitForTimeout(1000);
    await page.click("#mat-select-0");
    await page.waitForSelector("#mat-option-3");
    await page.waitForTimeout(1000);
    await page.click("#mat-option-3");
    await page.waitForTimeout(5000);

    const ArrivedPackages = await page.evaluate((arg) => {
      const table = document.querySelector("tbody");
      const trackings = [];
      const arrayOfTrs = Array.from(table?.children);
      if (arrayOfTrs.length === 0) return trackings;
      arrayOfTrs.forEach((tr) => {
        const tracking = {
          trackingCode: tr.children[0]?.innerText,
          sentDate: tr.children[3]?.innerText,
          arrivedDate: tr.children[4]?.innerText,
          status: "arrived",
          scaccountId: arg.id,
        };
        trackings.push(tracking);
      });
      return trackings;
    }, scaccount);
    // Received Packages

    await page.goto("https://www.spacecargo.ge/ReceivedPackages", {
      waitUntil: "load",
      timeout: 60000,
    });
    await page.waitForTimeout(1000);
    await page.waitForSelector("#mat-select-0");
    await page.waitForTimeout(1000);
    await page.click("#mat-select-0");
    await page.waitForSelector("#mat-option-3");
    await page.waitForTimeout(1000);
    await page.click("#mat-option-3");
    await page.waitForTimeout(5000);

    const ReceivedPackages = await page.evaluate((arg) => {
      const table = document.querySelector("tbody");
      const trackings = [];
      const arrayOfTrs = Array.from(table?.children);
      if (arrayOfTrs.length === 0) return trackings;
      arrayOfTrs.forEach((tr) => {
        const tracking = {
          trackingCode: tr.children[0]?.innerText,
          sentDate: tr.children[2]?.innerText,
          arrivedDate: tr.children[3]?.innerText,
          status: "received",
          scaccountId: arg.id,
        };
        trackings.push(tracking);
      });
      return trackings;
    }, scaccount);
    await browser.close();
    scrapedTrackings = [
      ...awaitingPackages,
      ...wareHousePackages,
      ...sendPackages,
      ...ArrivedPackages,
      ...ReceivedPackages,
    ];
    return scrapedTrackings;
  } catch (error) {
    console.log(error);
    return scrapedTrackings;
  }
}

module.exports = {
  spacecargoScraper,
};
