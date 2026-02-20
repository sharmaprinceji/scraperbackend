import axios from "axios";
import * as cheerio from "cheerio";
import Event from "../models/Events.js";

class ScraperService {

  async scrapeEventbriteSydney() {

    try {

      const url =
        "https://www.eventbrite.com.au/d/australia--sydney/events/";

      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });

      const html = response.data;

      const $ = cheerio.load(html);

      const events = [];

      $("a[href*='/e/']").each((i, el) => {

        const title =
          $(el).find("h3").text().trim();

        const link =
          $(el).attr("href");

        const image =
          $(el).find("img").attr("src");

        if (!title || !link) return;

        events.push({

          title,

          description: title,

          dateTime: new Date(),

          venueName: "Sydney",

          venueAddress: "Sydney",

          city: "Sydney",

          category: "Event",

          imageUrl: image || "",

          sourceWebsite: "Eventbrite",

          originalEventUrl: link.startsWith("http")
            ? link
            : `https://www.eventbrite.com.au${link}`,

          lastScrapedAt: new Date()

        });

      });

      console.log("Events found:", events.length);

      for (const event of events) {

        await Event.updateOne(

          { originalEventUrl: event.originalEventUrl },

          { $set: event },

          { upsert: true }

        );

      }

      console.log("Events saved to database");

    } catch (error) {

      console.error("Scraper error:", error.message);

    }

  }

}

export default new ScraperService();