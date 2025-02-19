const mongoose = require('mongoose');
const BRANCH = require("./branchData"); // Import the Branch schema

let ACTIVITYLOG;

if (mongoose.models && mongoose.models.ACTIVITYLOG) {
  ACTIVITYLOG = mongoose.models.ACTIVITYLOG;
} else {
  const activityLogSchema = new mongoose.Schema({
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BRANCH', // Reference to the Branch model
      required: true
    },
    process: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  });

  ACTIVITYLOG = mongoose.model('ACTIVITYLOG', activityLogSchema);
}

module.exports = ACTIVITYLOG;
