
import puppeteer from "puppeteer";
import Event from "../models/Events.js";

class ScraperService {

  async autoScroll(page) {

    await page.evaluate(async () => {

      await new Promise(resolve => {

        let totalHeight = 0;
        const distance = 500;

        const timer = setInterval(() => {

          window.scrollBy(0, distance);

          totalHeight += distance;

          if (totalHeight >= document.body.scrollHeight) {

            clearInterval(timer);
            resolve();

          }

        }, 300);

      });

    });

  }



  async scrapeEventbriteSydney() {

    let browser;

    try {

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });

      const page = await browser.newPage();

      await page.goto(
        "https://www.eventbrite.com.au/d/australia--sydney/events/",
        {
          waitUntil: "networkidle2",
          timeout: 0
        }
      );

      await page.waitForSelector("a[href*='/e/']");

      await this.autoScroll(page);



      // STEP 1: Extract event links only
      const eventLinks = await page.evaluate(() => {

        const elements =
          document.querySelectorAll("a[href*='/e/']");

        const results = [];

        elements.forEach(el => {

          const title =
            el.querySelector("h3")?.innerText?.trim();

          const link =
            el.href;

          if (title && link) {

            results.push({
              title,
              link
            });

          }

        });

        return results;

      });



      // console.log("Event links found:", eventLinks.length);



      // STEP 2: Visit each event page and extract real image
      const events = [];

      for (const item of eventLinks.slice(0, 20)) {

        try {

          const eventPage = await browser.newPage();

          await eventPage.goto(item.link, {
            waitUntil: "networkidle2",
            timeout: 0
          });



          const eventDetails = await eventPage.evaluate(() => {

            // REAL IMAGE extraction from event detail page
            const image =
              document.querySelector(
                "img[src*='evbuc']"
              )?.src || "";

            // Venue extraction
            const venue =
              document.querySelector(
                "[data-testid='venue-name']"
              )?.innerText || "Sydney";

            // Date extraction
            const dateText =
              document.querySelector("time")?.innerText;

            return {
              image,
              venue,
              dateText
            };

          });



          events.push({

            title: item.title,

            description: item.title,

            dateTime: new Date(),

            venueName: eventDetails.venue,

            venueAddress: eventDetails.venue,

            city: "Sydney",

            category: "Event",

            imageUrl: eventDetails.image,

            sourceWebsite: "Eventbrite",

            originalEventUrl: item.link

          });



          await eventPage.close();

        } catch (err) {

          console.log("Error scraping event:", err.message);

        }

      }



      console.log("Events with images:", events.length);



      // STEP 3: Save to MongoDB
      let saved = 0;

      for (const event of events) {

        await Event.updateOne(

          { originalEventUrl: event.originalEventUrl },

          {
            $set: {
              ...event,
              lastScrapedAt: new Date()
            }
          },

          { upsert: true }

        );

        saved++;

      }



      console.log("Events saved:", saved);



      await browser.close();



      return {
        success: true,
        saved
      };



    } catch (error) {

      if (browser) await browser.close();

      console.error("Scraper error:", error);

      return {
        success: false,
        error: error.message
      };

    }

  }

}

export default new ScraperService();