"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Session";
const COLLECTION_NAME = "Sessions";
const sessionSchema = new Schema(
  {
    session_id: {
      type: String,
      required: true,
      unique: true,
    },
    expired_day: {
      type: Date,
      required: true,
    },
    user_id: { type: Schema.Types.ObjectId, ref: "Customer", require: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, sessionSchema);
