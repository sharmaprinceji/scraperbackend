import mongoose from "mongoose";

const emailOptinSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },

    consent: {
      type: Boolean,
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const EmailOptin = mongoose.model("EmailOptin", emailOptinSchema);

export default EmailOptin;
