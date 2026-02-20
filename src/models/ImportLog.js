import mongoose from "mongoose";

const importLogSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const ImportLog = mongoose.model("ImportLog", importLogSchema);

export default ImportLog;
