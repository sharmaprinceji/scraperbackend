import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    description: {
      type: String,
      trim: true
    },

    dateTime: {
      type: Date,
      required: true,
      index: true
    },

    venueName: {
      type: String,
      trim: true
    },

    venueAddress: {
      type: String,
      trim: true
    },

    city: {
      type: String,
      default: "Sydney",
      index: true
    },

    category: {
      type: String,
      index: true
    },

    imageUrl: {
      type: String
    },

    sourceWebsite: {
      type: String,
      required: true
    },

    originalEventUrl: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    status: {
      type: String,
      enum: ["new", "updated", "inactive", "imported"],
      default: "new",
      index: true
    },

    lastScrapedAt: {
      type: Date,
      default: Date.now
    },

    importedAt: {
      type: Date,
      default: null
    },

    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    importNotes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
