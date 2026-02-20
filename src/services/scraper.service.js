// import axios from "axios";
// import * as cheerio from "cheerio";
// import Event from "../models/Events.js";

// class ScraperService {

//   async scrapeEventbriteSydney() {

//     try {

//       const url =
//         "https://www.eventbrite.com.au/d/australia--sydney/events/";

//       const response = await axios.get(url, {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
//         }
//       });

//       const html = response.data;

//       const $ = cheerio.load(html);

//       const events = [];

//       // Select event cards reliably
//       $("a[href*='/e/']").each((i, el) => {

//         try {

//           const element = $(el);

//           const title =
//             element.find("h3").first().text().trim();

//           let link =
//             element.attr("href");

//           // FIX image extraction (supports lazy loading)
//           let image =
//             element.find("img").attr("src") ||
//             element.find("img").attr("data-src") ||
//             element.find("img").attr("data-original") ||
//             element.find("img").attr("srcset");

//           // Clean srcset if exists
//           if (image && image.includes(",")) {
//             image = image.split(",")[0].split(" ")[0];
//           }

//           // Fix relative URLs
//           if (link && !link.startsWith("http")) {
//             link = `https://www.eventbrite.com.au${link}`;
//           }

//           // Validation
//           if (!title || !link) return;

//           const eventData = {

//             title,

//             description: title,

//             dateTime: new Date(),

//             venueName: "Sydney",

//             venueAddress: "Sydney",

//             city: "Sydney",

//             category: "Event",

//             imageUrl:
//               image ||
//               "https://via.placeholder.com/400x200?text=Event",

//             sourceWebsite: "Eventbrite",

//             originalEventUrl: link,

//             lastScrapedAt: new Date()

//           };

//           events.push(eventData);

//         } catch (err) {

//           console.error("Error parsing event:", err.message);

//         }

//       });

//       console.log(`Events found: ${events.length}`);

//       // Save to MongoDB
//       let savedCount = 0;

//       for (const event of events) {

//         await Event.updateOne(

//           { originalEventUrl: event.originalEventUrl },

//           { $set: event },

//           { upsert: true }

//         );

//         savedCount++;

//       }

//       console.log(`Events saved: ${savedCount}`);

//       return {
//         success: true,
//         count: savedCount
//       };

//     } catch (error) {

//       console.error("Scraper error:", error.message);

//       return {
//         success: false,
//         error: error.message
//       };

//     }

//   }

// }

// export default new ScraperService();

import puppeteer from "puppeteer";
import Event from "../models/Events.js";

class ScraperService {

  async scrapeEventbriteSydney() {

    let browser;

    try {

      browser = await puppeteer.launch({
        headless: true
      });

      const page = await browser.newPage();

      await page.goto(
        "https://www.eventbrite.com.au/d/australia--sydney/events/",
        {
          waitUntil: "networkidle2",
          timeout: 0
        }
      );

      // Wait for events to load
      await page.waitForSelector("a[href*='/e/']");

      const events = await page.evaluate(() => {

        const eventElements =
          document.querySelectorAll("a[href*='/e/']");

        const results = [];

        eventElements.forEach(el => {

          const title =
            el.querySelector("h3")?.innerText?.trim();

          const link =
            el.href;

          const image =
            el.querySelector("img")?.src;

          if (title && link) {

            results.push({

              title,

              description: title,

              dateTime: new Date().toISOString(), // send as string

              venueName: "Sydney",

              venueAddress: "Sydney",

              city: "Sydney",

              category: "Event",

              imageUrl: image || "",

              sourceWebsite: "Eventbrite",

              originalEventUrl: link

              // REMOVE lastScrapedAt here

            });

          }

        });

        return results;

      });

      console.log("Events found:", events.length);

      let saved = 0;

      for (const event of events) {

        await Event.updateOne(

          { originalEventUrl: event.originalEventUrl },

          {
            $set: {
              ...event,

              // SET DATE HERE (Node.js context)
              lastScrapedAt: new Date(),

              dateTime: new Date(event.dateTime)
            }
          },

          { upsert: true }

        );

      }

      // console.log("Events saved:", saved);

      await browser.close();

      return {
        success: true,
        saved
      };

    } catch (error) {

      if (browser) await browser.close();

      console.error(error);

      return {
        success: false,
        error: error.message
      };

    }

  }

}

export default new ScraperService();