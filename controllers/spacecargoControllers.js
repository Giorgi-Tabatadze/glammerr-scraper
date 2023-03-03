/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const asyncHandler = require("express-async-handler");
const spacecargoScraper = require("./utils/spacecargoScarper");

const createScrapingProcess = asyncHandler(async (req, res, next) => {
  const { scaccounts } = req.body;

  if (!scaccounts) {
    return res.status(400).json({ message: "No scaccounts provided" });
  }

  res.status(200);
  res.json({ message: "Scraping process started" });

  for (const scaccount of scaccounts) {
    const updatedTrackings = [];

    const accountTrackings = await spacecargoScraper.spacecargoScraper(
      scaccount,
    );
    updatedTrackings.push(...accountTrackings);
    const response = await fetch(
      `${process.env.BACKEND_APP_DOMAIN}/scrapings`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackings: updatedTrackings,
          secretToken: process.env.SCRAPER_SECRET_TOKEN,
        }),
      },
    );
    const data = await response.json();

    console.log(data);
  }

  next();
});
module.exports = {
  createScrapingProcess,
};
