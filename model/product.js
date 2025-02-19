const mongoose = require("mongoose");


let PRODUCT;

if (mongoose.models && mongoose.models.PRODUCT) {
  PRODUCT = mongoose.model('PRODUCT');
} else {
  const ProductSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: String,
      notes: String,
      category: {
        type: String,
      },
      price: {
        type: Number,
        min: 0, 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value >= 0;
          },
          message: "Quantity must be a non-negative number",
        },
      },
      branch: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );
  PRODUCT = mongoose.model("PRODUCT", ProductSchema);

}

module.exports = PRODUCT;

