const mongoose = require("mongoose");
const BRANCH = require("./branchData"); // Import the Branch schema
const PRODUCT = require("./product");

let RECORD;

if (mongoose.models && mongoose.models.RECORD) {
  RECORD = mongoose.model("RECORD");
} else {
  const recordSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: BRANCH, // Reference to the Branch model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sellNotes: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  });

  RECORD = mongoose.model("RECORD", recordSchema);
}

module.exports = RECORD;
