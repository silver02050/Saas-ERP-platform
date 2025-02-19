const mongoose = require("mongoose");
const BRANCH = require("./branchData");

let STAFF;

if (mongoose.models.STAFF) {
  STAFF = mongoose.model("STAFF");
} else {
  const staffSchema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true, // Let MongoDB generate the _id automatically
    },
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: BRANCH, // Reference to the Branch model
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },salary: {
      type: Number,
      required: true,
      min: 0, 
    },
    bonus: {
      type: Number,
      min: 0, 
    },
    dayOff: {
      default: 0,
      min: 0, 
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
  });

  STAFF = mongoose.model("STAFF", staffSchema);
}

module.exports = STAFF;
