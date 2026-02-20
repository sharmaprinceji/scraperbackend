import mongoose from "mongoose";

const scrapeLogSchema = new mongoose.Schema(
  {
    sourceWebsite: {
      type: String,
      required: true
    },

    totalScraped: {
      type: Number,
      default: 0
    },

    newEvents: {
      type: Number,
      default: 0
    },

    updatedEvents: {
      type: Number,
      default: 0
    },

    inactiveEvents: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      required: true
    },

    error: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const ScrapeLog = mongoose.model("ScrapeLog", scrapeLogSchema);

export default ScrapeLog;
