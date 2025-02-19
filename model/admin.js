const mongoose = require('mongoose');

let ADMIN;

if (mongoose.models && mongoose.models.ADMIN) {
  ADMIN = mongoose.model('ADMIN');
} else {
  const adminSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    tenant: {
      type: String,
      required: true
    },
    connection: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    debug: {
      type: Boolean,
      default: false
    },
    is_signup: {
      type: Boolean,
      default: false
    },
    usePasskey: {
      type: Boolean,
      default: false
    }
  });

  ADMIN = mongoose.model('ADMIN', adminSchema);
}

module.exports = ADMIN;